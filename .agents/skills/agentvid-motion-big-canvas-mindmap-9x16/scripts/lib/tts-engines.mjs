// Text-to-speech engines behind one interface: speak(jobs, voiceCfg) writes one WAV per job.
// job = { id, text, style, out }   voiceCfg = script.json "voice" { engine, voice, model?, style?, language }
//   gemini      multix gemini generate-speech (style prompt steers delivery)      key GEMINI_API_KEY
//   elevenlabs  multix elevenlabs tts, mp3 converted to WAV                        key ELEVENLABS_API_KEY
//   soniox      Soniox REST tts-rt-v2, any voice speaks any language              key SONIOX_API_KEY
//   vieneu      local VieNeu-TTS (Vietnamese, free, CPU) via scripts/tts-vieneu-batch.py
import { execFileSync, spawnSync } from "node:child_process";
import { unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { multix, pool } from "./run-multix.mjs";
import { sonioxSpeak } from "./soniox-client.mjs";
import { vieneuPython } from "./vieneu-env.mjs";

const toWav = (src, out) => {
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-ar", "48000", "-ac", "1", out]);
  unlinkSync(src);
};

const ENGINES = {
  async gemini(jobs, v) {
    await pool(jobs, 4, (j) =>
      multix(["gemini", "generate-speech", "--model", v.model || "gemini-3.8-flash-tts", "--voice", v.voice || "Puck",
        ...(j.style ? ["--style", j.style] : []), "--text", j.text, "--output", j.out], { output: j.out }));
  },
  async elevenlabs(jobs, v) {
    await pool(jobs, 3, async (j) => {
      const mp3 = j.out.replace(/\.wav$/, ".mp3");
      await multix(["elevenlabs", "tts", "--model", v.model || "eleven_v3", ...(v.voice ? ["--voice", v.voice] : []),
        "--language-code", v.language, "--format", "mp3_44100_192", "--text", j.text, "--output", mp3], { output: mp3 });
      toWav(mp3, j.out);
    });
  },
  async soniox(jobs, v) {
    await pool(jobs, 4, (j) => sonioxSpeak({ text: j.text, voice: v.voice || "Adrian", language: v.language, out: j.out, model: v.model }));
  },
  async vieneu(jobs, v, { scriptsDir }) {
    // One process for all jobs: loading the model takes ~12 s, each line then takes about its own duration.
    const list = join(tmpdir(), `vieneu-jobs-${process.pid}.json`);
    writeFileSync(list, JSON.stringify(jobs.map(({ text, out }) => ({ text, out }))));
    const r = spawnSync(vieneuPython(), [join(scriptsDir, "tts-vieneu-batch.py"), list, "--voice", v.voice || "Thanh Bình"],
      { stdio: "inherit", env: { ...process.env, PYTHONIOENCODING: "utf-8", HF_HUB_DISABLE_SYMLINKS_WARNING: "1" } });
    unlinkSync(list);
    if (r.status !== 0) throw new Error("VieNeu synthesis failed (see output above)");
  },
};

export const ENGINE_NAMES = Object.keys(ENGINES);

export async function speak(jobs, voiceCfg, ctx) {
  const fn = ENGINES[voiceCfg.engine];
  if (!fn) throw new Error(`unknown voice engine "${voiceCfg.engine}" (use ${ENGINE_NAMES.join(", ")})`);
  if (jobs.length) await fn(jobs, voiceCfg, ctx);
}
