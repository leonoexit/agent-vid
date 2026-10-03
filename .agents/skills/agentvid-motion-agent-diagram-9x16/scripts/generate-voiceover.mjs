// Voices data/script.json into assets/audio/vo/<scene id>.wav.
// Default: ONE take for the whole script (one TTS call), then the take is cut into scene clips at the pauses between
// scenes. Separate calls to the same TTS voice can drift apart (reported on Gemini: another timbre or tone per scene,
// audible when the clips are joined); one take keeps one reading. Cutting needs word timings, so this step
// also recognises the take once (script.json "align", default auto) and caches them in data/align/<scene>.json;
// align-voiceover then only matches.
// Usage: node scripts/generate-voiceover.mjs [--force] [--allow-multi-take] [--per-scene [--only=s01-cover,s02-stats]]
//   --per-scene         old mode: one call per scene (only to patch a single scene; the patched scene may sound different)
//   --allow-multi-take  a script over the engine's one-call limit is read in several takes (voice may shift between
//                       them); without it such a script stops here so it gets shortened instead
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cutClip, mediaSeconds, silences } from "./lib/audio-probe.mjs";
import { parseArgs, projectRoot, readCacheJson, readJson, spokenText, writeJson } from "./lib/project-io.mjs";
import { recogniseWords, resolveAlignEngine } from "./lib/recognise-words.mjs";
import { estimateWordTimes } from "./lib/estimate-word-times.mjs";
import { planTakeCuts, planTakeCutsByPauses } from "./lib/split-voice-take.mjs";
import { speak } from "./lib/tts-engines.mjs";
import { acquireProjectLock, fileSha256, invalidateSceneAudioCaches, planSynthesisTakes, synthesisCacheMatches, synthesisKey, synthesizeFresh, synthesizeWithRetries, validateVoiceScenes } from "./lib/voice-take-cache.mjs";

// longest take per call; a longer script is read in a few takes of whole scenes
const MAX_CHARS = { gemini: 4000, elevenlabs: 2800, soniox: 3000, vieneu: Infinity };

const root = projectRoot(import.meta.url);
const args = parseArgs();
const script = readJson(root, "data/script.json");
const voice = { language: script.language, ...script.voice };
const ctx = { scriptsDir: dirname(fileURLToPath(import.meta.url)) };
const vo = (id) => join(root, "assets/audio/vo", `${id}.wav`);
const validateAudio = (file) => {
  const seconds = mediaSeconds(file);
  if (!Number.isFinite(seconds) || seconds <= 0) throw new Error(`synthesis produced invalid audio: ${file}`);
};
// every scene ends a sentence, so the reader pauses between scenes
const sceneText = (s) => s.lines.map(spokenText).join(" ").trim().replace(/([^.!?…])$/u, "$1.");

validateVoiceScenes(script.scenes, sceneText);
const releaseLock = acquireProjectLock(root);
try {
  await generateVoiceover();
} finally {
  releaseLock();
}

async function generateVoiceover() {
console.log(`voice: ${voice.engine} / ${voice.voice || "default"} (${voice.language})`);

if (args.has("--per-scene")) {
  const jobs = script.scenes
    .filter((s) => !args.only.length || args.only.includes(s.id))
    .map((s) => ({ id: s.id, text: sceneText(s), style: s.outro ? voice.outroStyle || voice.style : voice.style, out: vo(s.id) }));
  const limit = MAX_CHARS[voice.engine] ?? 3000;
  for (const j of jobs) if (j.text.length > limit)
    throw new Error(`${j.id}: ${j.text.length} chars exceeds the ${limit}-char provider limit; shorten this scene`);
  console.log(`per-scene mode: ${jobs.length} call(s); scenes voiced separately can sound like different takes`);
  for (const j of jobs) {
    const manifestRel = `data/align/synthesis/${j.id}.json`;
    const key = synthesisKey({ ...voice, style: j.style, text: j.text });
    const prev = readCacheJson(root, manifestRel);
    if (!args.force && synthesisCacheMatches(prev, key, j.out, validateAudio)) {
      console.log(`vo ${j.id} unchanged (proven synthesis cache)`);
      continue;
    }
    await synthesizeWithRetries(j.out, (out) => speak([{ ...j, out }], voice, ctx), validateAudio);
    invalidateSceneAudioCaches(root, j.id);
    writeJson(root, manifestRel, { schema: 2, key, seconds: mediaSeconds(j.out), sha256: fileSha256(j.out) });
    console.log(`vo ${j.id} -> ${j.out}`);
  }
  return;
}
if (args.only.length) console.warn("--only is ignored in one-take mode (the whole script is one take); use --per-scene to patch one scene");

// group whole scenes into takes under the engine's text limit (normally a single take)
const limit = MAX_CHARS[voice.engine] ?? 3000;
const takes = planSynthesisTakes(script.scenes, sceneText, limit);
if (takes.length > 1) {
  const chars = script.scenes.reduce((n, s) => n + sceneText(s).length + 2, -2);
  const msg = `script is ${chars} chars, over the ${limit}-char limit of one ${voice.engine} call`;
  if (!args.has("--allow-multi-take"))
    throw new Error(`${msg}: shorten data/script.json by ~${chars - limit} chars so it stays one take (one narrator), ` +
      "or, only if the user asks for the long version, re-run with --allow-multi-take (the voice may shift between takes)");
  console.warn(`${msg}: ${takes.length} takes (--allow-multi-take; the voice may shift between them)`);
}

const engine = resolveAlignEngine(script.align);
for (const [n, take] of takes.entries()) {
  const text = take.scenes.map(sceneText).join("\n\n");
  const key = synthesisKey({ ...voice, text });
  const manifestRel = `data/align/take-${n + 1}.json`;
  const prev = readCacheJson(root, manifestRel);
  const wav = join(root, "assets/audio/vo", `_take-${n + 1}.wav`);
  let heard, seconds, sha256;
  if (!args.force && synthesisCacheMatches(prev, key, wav, validateAudio)) {
    // same text and voice: keep the take and its words, only re-cut (cheap, picks up matcher fixes)
    ({ seconds, sha256 } = prev);
    console.log(`take ${n + 1}: unchanged (${take.scenes.length} scenes), re-cut from the kept take`);
  } else {
    console.log(`take ${n + 1}: ${take.scenes.length} scenes, ${text.length} chars, one call`);
    await synthesizeWithRetries(wav, (out) => speak([{ id: `take-${n + 1}`, text, style: voice.style, out }], voice, ctx), validateAudio);
    seconds = mediaSeconds(wav);
    sha256 = fileSha256(wav);
    if (fileSha256(wav) !== sha256) throw new Error(`take ${n + 1}: audio changed before its manifest could be published`);
    writeJson(root, manifestRel, { schema: 2, key, seconds, sha256 });
  }
  const rawRel = `data/align/_take-${n + 1}-raw.json`;
  const raw = readCacheJson(root, rawRel);
  const alignKey = JSON.stringify({ schema: 2, sha256, requestedEngine: script.align || "auto", resolvedEngine: engine, language: voice.language, text });
  if (!args.force && raw?.key === alignKey) heard = raw.words;
  else {
    heard = engine === "estimate" ? [] : await recogniseWords({ engine, file: wav, language: voice.language, text, cache: join(root, rawRel) });
    if (engine !== "estimate" && !heard.length) throw new Error(`take ${n + 1}: the aligner heard no words — check ${wav}`);
    writeJson(root, rawRel, { key: alignKey, words: heard });
  }
  if (fileSha256(wav) !== sha256) throw new Error(`take ${n + 1}: audio changed during alignment; retry the command`);
  const pauses = silences(wav, { minLen: 0.08 });
  const pieces = engine === "estimate"
    ? planTakeCutsByPauses(take.scenes, take.scenes.map(sceneText), seconds, pauses)
    : planTakeCuts(take.scenes, heard, seconds, pauses);
  for (const p of pieces) {
    await synthesizeFresh(vo(p.id), (out) => cutClip(wav, p.from, p.to, out), validateAudio);
    invalidateSceneAudioCaches(root, p.id);
    if (engine === "estimate") p.words = estimateWordTimes(sceneText(take.scenes.find((s) => s.id === p.id)), p.to - p.from, silences(vo(p.id)));
    writeJson(root, `data/align/${p.id}.json`, { engine, take: n + 1, from: p.from, to: p.to, words: p.words });
    console.log(`vo ${p.id.padEnd(20)} ${p.from.toFixed(2)}-${p.to.toFixed(2)} s of take ${n + 1} (${p.words.length} words)`);
  }
}
}
