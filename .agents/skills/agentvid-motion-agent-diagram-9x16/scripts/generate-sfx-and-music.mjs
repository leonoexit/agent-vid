// Sound effects (data/sfx.json) and music (data/music-plan.json, optional data/outro-plan.json)
// through ElevenLabs via multix. Your own music instead: put it at assets/audio/music/bgm-raw.mp3 and skip "music".
// Usage: node scripts/generate-sfx-and-music.mjs <sfx|music|all> [--force] [--only=id1,id2]
import { existsSync } from "node:fs";
import { join } from "node:path";
import { parseArgs, projectRoot, readJson, readJsonIf } from "./lib/project-io.mjs";
import { multix, pool } from "./lib/run-multix.mjs";

const root = projectRoot(import.meta.url);
const args = parseArgs();
const mode = args.mode || "all";

async function genSfx() {
  const list = readJson(root, "data/sfx.json").filter((s) => !args.only.length || args.only.includes(s.id));
  await pool(list, 4, async (s) => {
    const out = join(root, "assets/audio/sfx", `${s.id}.mp3`);
    if (existsSync(out) && !args.force) return;
    // ElevenLabs accepts 0.5-30 s; clamp instead of failing the whole batch
    const dur = Math.min(30, Math.max(0.5, Number(s.duration) || 1));
    if (dur !== Number(s.duration)) console.warn(`sfx ${s.id}: duration ${s.duration} s clamped to ${dur} s (ElevenLabs range 0.5-30)`);
    await multix(["elevenlabs", "sfx", "--text", s.prompt, "--duration-seconds", dur, "--prompt-influence", "0.6", "--output", out], { output: out });
    console.log(`sfx ${s.id}`);
  });
}

async function compose(planRel, file) {
  const out = join(root, "assets/audio/music", file);
  if (existsSync(out) && !args.force) return console.log(`skip ${file} (exists; --force to regenerate)`);
  await multix(["elevenlabs", "music", "--plan", join(root, planRel), "--format", "mp3_44100_192", "--output", out], { output: out });
  console.log(`music ${file}`);
}

async function genMusic() {
  await compose("data/music-plan.json", "bgm-raw.mp3");
  // The calm ending is its own short composition, faded in under the main track's tail (timeline-config "outroBed").
  if (readJsonIf(root, "data/outro-plan.json")) await compose("data/outro-plan.json", "outro-raw.mp3");
}

if (mode === "sfx" || mode === "all") await genSfx();
if (mode === "music" || mode === "all") await genMusic();
