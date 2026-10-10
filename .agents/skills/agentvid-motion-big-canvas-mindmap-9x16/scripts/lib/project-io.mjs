// Shared paths and JSON helpers for a motion project.
// Every CLI script lives in <project>/scripts/ and treats its parent directory as the project root.
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { agentvidHome } from "./vieneu-env.mjs";

/** Project root of the calling script: <project>/scripts/<name>.mjs -> <project>. */
export const projectRoot = (metaUrl) => resolve(dirname(fileURLToPath(metaUrl)), "..");

export const readJson = (root, rel) => JSON.parse(readFileSync(join(root, rel), "utf8"));

/** Like readJson, but returns `fallback` when the file does not exist (optional data files). */
export const readJsonIf = (root, rel, fallback = null) => (existsSync(join(root, rel)) ? readJson(root, rel) : fallback);

/** Optional cache JSON: malformed content is a safe cache miss; filesystem errors still surface. */
export const readCacheJson = (root, rel, fallback = null) => {
  try {
    return readJsonIf(root, rel, fallback);
  } catch (error) {
    if (error instanceof SyntaxError) return fallback;
    throw error;
  }
};

export const writeJson = (root, rel, value, indent = 1) => {
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  const stage = join(dirname(file), `.${file.split(/[\\/]/).at(-1)}-${randomUUID()}.tmp`);
  try {
    writeFileSync(stage, JSON.stringify(value, null, indent));
    JSON.parse(readFileSync(stage, "utf8"));
    renameSync(stage, file);
  } finally {
    rmSync(stage, { force: true });
  }
  return file;
};

export const ensureDir = (dir) => (mkdirSync(dir, { recursive: true }), dir);

/** CLI flags: --force, --only=a,b and a positional mode. */
export const parseArgs = (argv = process.argv.slice(2)) => ({
  mode: argv.find((a) => !a.startsWith("--")),
  force: argv.includes("--force"),
  only: (argv.find((a) => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean),
  has: (flag) => argv.includes(flag),
  value: (name) => (argv.find((a) => a.startsWith(`--${name}=`)) || "").slice(name.length + 3) || null,
  rawValue: (name) => {
    const arg = argv.find((a) => a.startsWith(`--${name}=`));
    return arg === undefined ? undefined : arg.slice(name.length + 3);
  },
});

/** Spoken text of a script line: `say` (pronunciation hint) wins over the displayed `text`. */
export const spokenText = (line) => line.say || line.text;

const escapeRegExp = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Respells words the voice model mispronounces: whole words only, any case ("ACME" -> "ac mi"). */
export function respell(text, table) {
  let out = text;
  for (const [word, said] of Object.entries(table || {})) {
    if (!word.trim()) throw new Error('pronounce: an empty word cannot be respelled');
    // letters, digits, underscore and combining marks (decomposed Vietnamese) all belong to a word
    const w = String.raw`\p{L}\p{N}\p{M}_`;
    out = out.replace(new RegExp(`(?<![${w}])${escapeRegExp(word)}(?![${w}])`, "giu"), () => String(said));
  }
  return out;
}

/**
 * The machine-wide pronunciation dictionary: ~/.agentvid/pronounce.json (or $AGENTVID_HOME), { "ACME": "ác mi" }.
 * It lives outside any skill, so words you teach the voice once (a brand, an acronym) apply to every motion project on
 * this computer and are never packaged or sold with a skill. {} when missing or unreadable.
 */
export function readLocalPronounce() {
  const file = join(agentvidHome(), "pronounce.json");
  if (!existsSync(file)) return {};
  let data;
  try {
    data = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    console.warn(`pronounce: ${file} is not valid JSON, ignored`);
    return {};
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    console.warn(`pronounce: ${file} must be a JSON object { "word": "respelling" }, ignored`);
    return {};
  }
  const entries = Object.entries(data).filter(([word, said]) => word.trim() && typeof said === "string");
  if (entries.length !== Object.keys(data).length) console.warn(`pronounce: ${file}: entries that are not "word": "respelling" strings were skipped`);
  return Object.fromEntries(entries);
}

/**
 * Respelling table in force: the local dictionary < theme.json "pronounce" (copied into script.json by new-project) <
 * script.json "pronounce" (this video). Returns the script with each respelled line carrying that spelling in `say`, so
 * voicing, alignment and caption matching all use the sound while captions keep `text`. No table anywhere: returned as is.
 */
export function applyPronounce(script) {
  const table = { ...readLocalPronounce(), ...script.pronounce };
  if (!Object.keys(table).length) return script;
  const lineWith = (l) => {
    const said = respell(spokenText(l), table);
    return said === spokenText(l) ? l : { ...l, say: said };
  };
  return { ...script, scenes: script.scenes.map((s) => ({ ...s, lines: s.lines.map(lineWith) })) };
}

/** Word tokens of a text: whitespace split, keeping only tokens that contain a letter or digit. */
export const wordTokens = (text) => text.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t));

/** Normalised lookup key of a word: lower case, punctuation stripped ("AgentVid:" -> "agentvid"). */
export const normWord = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");

export const round = (x, d = 3) => Math.round(x * 10 ** d) / 10 ** d;
