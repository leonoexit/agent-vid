// Word timings for every voice clip -> data/vo-lines.json { sceneId: { lines: [{ start, end, words: [{ t, s, e }] }] } }
// (seconds, clip-local). Engine: script.json "align" (default auto: soniox with a key, else local faster-whisper,
// else estimate from pauses; see lib/recognise-words.mjs). Raw words are cached in data/align/<id>.json; the one-take
// voice step already writes them, so this step normally only matches words onto the script.
// Usage: node scripts/align-voiceover.mjs [--force]   (--force re-recognises every scene clip on its own)
import { existsSync } from "node:fs";
import { join } from "node:path";
import { mediaSeconds } from "./lib/audio-probe.mjs";
import { matchScene } from "./lib/match-script-words.mjs";
import { parseArgs, projectRoot, readJson, spokenText, writeJson } from "./lib/project-io.mjs";
import { recogniseWords, resolveAlignEngine } from "./lib/recognise-words.mjs";
import { pool } from "./lib/run-multix.mjs";
import { validateVoiceScenes, withProjectLock } from "./lib/voice-take-cache.mjs";

const root = projectRoot(import.meta.url);
const args = parseArgs();
const script = readJson(root, "data/script.json");
validateVoiceScenes(script.scenes, (scene) => scene.lines.map(spokenText).join(" "));
await withProjectLock(root, async () => {
  const todo = script.scenes.filter((s) => args.force || !existsSync(join(root, `data/align/${s.id}.json`)));
  const engine = todo.length ? resolveAlignEngine(script.align) : null;

  await pool(todo, engine === "local" ? 1 : 3, async (s) => {
    const cacheRel = `data/align/${s.id}.json`;
    const wav = join(root, "assets/audio/vo", `${s.id}.wav`);
    if (!existsSync(wav)) throw new Error(`${s.id}: missing ${wav} — run generate-voiceover first`);
    const text = s.lines.map(spokenText).join(" ");
    const words = await recogniseWords({ engine, file: wav, language: script.language, text, cache: join(root, cacheRel) });
    writeJson(root, cacheRel, { engine, words });
    console.log(`aligned ${s.id} (${words.length} words, ${engine})`);
  });

  const result = {};
  for (const s of script.scenes) {
    const wav = join(root, "assets/audio/vo", `${s.id}.wav`);
    const { words } = readJson(root, `data/align/${s.id}.json`);
    if (!words.length) throw new Error(`${s.id}: the aligner heard no words — check the audio file`);
    const { lines, matched } = matchScene(s, words, mediaSeconds(wav));
    const cachedEngine = readJson(root, `data/align/${s.id}.json`).engine;
    if (matched < 0.85)
      console.warn(`${s.id}: only ${Math.round(matched * 100)}% of script words were heard` + (cachedEngine === "local"
        ? " — the local recogniser misspells some Vietnamese words; unheard words get times between their neighbours, so re-voice only if the audio itself is wrong"
        : ` — re-voice it or fix "say"`));
    result[s.id] = { matched, lines };
    console.log(`${s.id.padEnd(20)} ${lines.map((l) => `${l.start.toFixed(2)}-${l.end.toFixed(2)}`).join(" | ")}  (${Math.round(matched * 100)}%)`);
  }
  writeJson(root, "data/vo-lines.json", result);
});
