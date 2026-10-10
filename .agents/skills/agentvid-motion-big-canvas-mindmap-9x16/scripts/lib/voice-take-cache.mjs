import { createHash, randomUUID } from "node:crypto";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

export const synthesisKey = ({ engine, model, voice, style, language, text }) =>
  JSON.stringify({ schema: 2, engine, model: model || null, voice: voice || null, style: style || null, language, text });

export const fileSha256 = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");

export function assertSafeSceneId(sceneId) {
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(sceneId || ""))
    throw new Error(`invalid scene id "${sceneId}" (use letters, numbers, _ or -)`);
  if (/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(sceneId))
    throw new Error(`scene id "${sceneId}" is a reserved Windows device basename`);
  return sceneId;
}

export function validateVoiceScenes(scenes, textFor) {
  const seen = new Set();
  return scenes.map((scene) => {
    assertSafeSceneId(scene.id);
    const folded = scene.id.toLowerCase();
    if (seen.has(folded)) throw new Error(`duplicate scene id after Windows case-folding: "${scene.id}"`);
    seen.add(folded);
    const text = textFor(scene);
    if (typeof text !== "string" || !/[\p{L}\p{N}]/u.test(text)) throw new Error(`${scene.id}: scene has no spoken text`);
    return text;
  });
}

export function synthesisCacheMatches(manifest, key, wav, validate = () => {}) {
  try {
    if (!manifest || manifest.key !== key || !existsSync(wav) || statSync(wav).size === 0 || manifest.sha256 !== fileSha256(wav)) return false;
    validate(wav);
    return true;
  } catch {
    return false;
  }
}

/** Synthesize into a new sibling, validate it, then publish it without ever trusting a pre-existing output. */
export async function synthesizeFresh(out, synthesize, validate = () => {}) {
  const suffix = extname(out);
  const stem = basename(out, suffix);
  const stage = join(dirname(out), `.${stem}-${randomUUID()}${suffix}`);
  try {
    await synthesize(stage);
    if (!existsSync(stage) || statSync(stage).size === 0) throw new Error("synthesis produced no audio");
    validate(stage);
    renameSync(stage, out);
  } finally {
    rmSync(stage, { force: true });
  }
}

export function isTransientSynthesisError(error) {
  const seen = new Set();
  for (let current = error; current && !seen.has(current); current = current.cause) {
    seen.add(current);
    const status = Number(current.status ?? current.statusCode ?? current.response?.status);
    if (status === 408 || status === 429 || status >= 500 && status <= 599) return true;
    if (["ECONNRESET", "ETIMEDOUT", "EAI_AGAIN"].includes(String(current.code || "").toUpperCase())) return true;
    if (/\b(408|429|5\d\d)\b|timed?\s*out|temporar(?:y|ily)|rate.?limit/i.test(String(current.message || current))) return true;
  }
  return false;
}

export async function synthesizeWithRetries(out, synthesize, validate, { attempts = 2 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await synthesizeFresh(out, synthesize, validate);
    } catch (error) {
      lastError = error;
      if (attempt === attempts || !isTransientSynthesisError(error)) throw error;
    }
  }
  throw lastError;
}

export function invalidateSceneAudioCaches(root, sceneId) {
  assertSafeSceneId(sceneId);
  rmSync(join(root, "data", "align", `${sceneId}.json`), { force: true });
  rmSync(join(root, "data", "vo-lines.json"), { force: true });
}

export function planSynthesisTakes(scenes, textFor, limit) {
  const texts = validateVoiceScenes(scenes, textFor);
  const takes = [];
  for (const [index, scene] of scenes.entries()) {
    const text = texts[index];
    if (text.length > limit)
      throw new Error(`${scene.id}: ${text.length} chars exceeds the ${limit}-char provider limit; shorten this scene`);
    const last = takes.at(-1);
    if (last && last.chars + text.length + 2 <= limit) (last.scenes.push(scene), (last.chars += text.length + 2));
    else takes.push({ scenes: [scene], chars: text.length });
  }
  return takes;
}

/** Exclusive project writer lock. Abandoned locks fail closed because lock reclamation is not atomically portable. */
export function acquireProjectLock(root) {
  const dir = join(root, "data");
  const file = join(dir, ".generate-voiceover.lock");
  mkdirSync(dir, { recursive: true });
  const token = `${process.pid}:${randomUUID()}`;
  const create = () => {
    const fd = openSync(file, "wx");
    try { writeFileSync(fd, token); } finally { closeSync(fd); }
  };
  try { create(); } catch (error) {
    if (error.code === "EEXIST")
      throw new Error(`voice audio pipeline is already running for ${root}; if no process is active, remove ${file}`);
    throw error;
  }
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    try { if (readFileSync(file, "utf8") === token) rmSync(file, { force: true }); } catch { /* already removed */ }
  };
  process.once("exit", release);
  return () => {
    process.removeListener("exit", release);
    release();
  };
}

export async function withProjectLock(root, action) {
  const release = acquireProjectLock(root);
  try {
    return await action();
  } finally {
    release();
  }
}
