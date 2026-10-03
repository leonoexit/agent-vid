// Word timings of a voice clip, behind one interface: recogniseWords({ engine, file, language, text, cache }).
// Engines (script.json "align"):
//   auto        default: soniox when SONIOX_API_KEY is set, else local when installed, else estimate
//   soniox      Soniox async STT, script text as context                          key SONIOX_API_KEY
//   elevenlabs  ElevenLabs forced alignment (key needs the forced_alignment permission)
//   local       faster-whisper on CPU in the shared voice env (setup-vieneu.py --align), no key
//   estimate    no recogniser: pauses + word length (lib/estimate-word-times.mjs), no key, no install
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mediaSeconds, silences } from "./audio-probe.mjs";
import { estimateWordTimes } from "./estimate-word-times.mjs";
import { providerEnv } from "./load-api-keys.mjs";
import { multix } from "./run-multix.mjs";
import { sonioxWords } from "./soniox-client.mjs";
import { vieneuPython } from "./vieneu-env.mjs";

const SCRIPTS = join(dirname(fileURLToPath(import.meta.url)), "..");
const pyEnv = { ...process.env, PYTHONIOENCODING: "utf-8", HF_HUB_DISABLE_SYMLINKS_WARNING: "1" };

let localReady;
/** True when the shared voice env has faster-whisper (checked once per run). */
export function localAlignReady() {
  if (localReady === undefined) {
    try {
      localReady = spawnSync(vieneuPython(), ["-c", "import faster_whisper"], { env: pyEnv }).status === 0;
    } catch {
      localReady = false; // voice env not installed
    }
  }
  return localReady;
}

/** Concrete engine for "auto" / unset; explicit names pass through. */
export function resolveAlignEngine(requested) {
  if (requested && requested !== "auto") return requested;
  if (providerEnv().SONIOX_API_KEY) return "soniox";
  if (localAlignReady()) return "local";
  console.warn("align: no SONIOX_API_KEY and no local recogniser — estimating word times from pauses " +
    "(for tighter captions run  python scripts/setup-vieneu.py --align  once)");
  return "estimate";
}

function localWords(file, language, text) {
  const tmp = join(tmpdir(), `agentvid-asr-${process.pid}-${Date.now()}`);
  writeFileSync(`${tmp}.txt`, text);
  try {
    const r = spawnSync(vieneuPython(), [join(SCRIPTS, "transcribe-words-local.py"), file, "--language", language,
      "--out", `${tmp}.json`, "--prompt-file", `${tmp}.txt`], { stdio: ["ignore", "inherit", "inherit"], env: pyEnv });
    if (r.status !== 0) throw new Error("local recogniser failed (see above); run  python scripts/setup-vieneu.py --align");
    return JSON.parse(readFileSync(`${tmp}.json`, "utf8"));
  } finally {
    for (const f of [`${tmp}.txt`, `${tmp}.json`]) try { unlinkSync(f); } catch { /* not written */ }
  }
}

/** -> [{ t, s, e }] seconds from the start of `file`. `text` is what the clip says; `cache` a scratch path (elevenlabs). */
export async function recogniseWords({ engine, file, language, text, cache, runMultix = multix }) {
  if (engine === "soniox") return sonioxWords({ file, language, context: text });
  if (engine === "elevenlabs") {
    mkdirSync(dirname(cache), { recursive: true });
    const stage = join(dirname(cache), `.${cache.split(/[\\/]/).at(-1)}-${randomUUID()}.provider.json`);
    try {
      await runMultix(["elevenlabs", "align", "--input", file, "--text", text, "--output", stage], { output: stage });
      return JSON.parse(readFileSync(stage, "utf8")).words.map((w) => ({ t: w.text, s: w.start, e: w.end }));
    } finally {
      try { unlinkSync(stage); } catch { /* provider did not write it */ }
    }
  }
  if (engine === "local") return localWords(file, language, text);
  if (engine === "estimate") return estimateWordTimes(text, mediaSeconds(file), silences(file));
  throw new Error(`unknown align engine "${engine}" (use auto, soniox, local, estimate or elevenlabs)`);
}
