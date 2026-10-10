// Lint -> check -> render -> put the untouched mix back -> measure. Writes data/render-report.json and exits 1
// when any gate fails. The remux matters: the renderer re-encodes AAC and can push the true peak to 0 dBFS.
// Usage: node scripts/render-and-verify.mjs [--out=renders/video.mp4] [--social] [--verify-only] [--skip-check] [--low-memory] [--require-review]
// --require-review (or data/theme.json review.required) refuses to render unless review gates A and B passed on the current
// files, and records which files produced the MP4 so gate C can be stamped (references/review-gates.md).
// Low-memory mode (1 Chrome worker) turns on by itself when less than 3 GB of RAM is free.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";
import { freemem } from "node:os";
import { join } from "node:path";
import { providerEnv } from "./lib/load-api-keys.mjs";
import { interiorBlackIntervals } from "./lib/cli-validation.mjs";
import { loadTimeline } from "./lib/timeline-config.mjs";
import { ensureDir, parseArgs, projectRoot, readJson, readJsonIf, writeJson } from "./lib/project-io.mjs";

const HYPERFRAMES = "hyperframes@0.8.75";
const root = projectRoot(import.meta.url);
const args = parseArgs();
const aspect = readJson(root, "data/aspect.json");
const { cfg: { duration, fps } } = loadTimeline(root);
const out = join(root, args.value("out") || `renders/${readJson(root, "brand.json").slug || "video"}.mp4`);
ensureDir(join(out, ".."));

const requireReview = args.has("--require-review") || readJsonIf(root, "data/theme.json", {}).review?.required === true;
const gatePy = (...a) => spawnSync(process.platform === "win32" ? "python" : "python3", [join(root, "scripts/review-gate.py"), ...a], { cwd: root, stdio: "inherit" });
let inputsBefore = "";
if (requireReview && !args.has("--verify-only")) {
  // hash first: whatever the files are when the stamps are checked must also be what gets rendered
  const hashed = spawnSync(process.platform === "win32" ? "python" : "python3", [join(root, "scripts/review-gate.py"), "hash", "--project", root], { encoding: "utf8" });
  inputsBefore = hashed.status === 0 ? hashed.stdout.trim() : "";
  if (!/^[0-9a-f]{64}$/.test(inputsBefore)) {
    console.error("could not hash the project files for the review receipt");
    process.exit(1);
  }
  if (gatePy("require", "--project", root, "--gates", "A,B").status !== 0) {
    console.error("review gates A and B must pass on the current files before rendering (references/review-gates.md)");
    process.exit(1);
  }
  rmSync(join(root, "review/render-receipt.json"), { force: true }); // an older receipt must never vouch for this render
}

const q = (x) => (/^[\w@.,:=\\/-]+$/.test(x) ? x : `"${x}"`); // our own flags and paths only
const hf = (...a) => {
  console.log(`> hyperframes ${a.join(" ")}`);
  const r = spawnSync(`npx --yes ${HYPERFRAMES} ${a.map(q).join(" ")}`, { cwd: root, stdio: "inherit", shell: true, env: providerEnv() });
  if (r.status !== 0) throw new Error(`hyperframes ${a[0]} failed (exit ${r.status})`);
};
const ffErr = (a) => spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...a], { encoding: "utf8" }).stderr;

if (!args.has("--verify-only")) {
  hf("lint");
  if (!args.has("--skip-check")) hf("check");
  const lowMem = args.has("--low-memory") || freemem() < 3 * 1024 ** 3;
  if (lowMem) console.log(`low-memory render: ${Math.round(freemem() / 1024 ** 2)} MB free`);
  hf("render", "-q", "high", "-f", String(fps), "--strict", ...(lowMem ? ["--low-memory-mode"] : []), "-o", out);
  const tmp = out.replace(/\.mp4$/, ".remux.mp4");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", out, "-i", join(root, "assets/audio/mix.m4a"), "-map", "0:v:0", "-map", "1:a:0", "-c", "copy", "-movflags", "+faststart", tmp]);
  renameSync(tmp, out);
}
if (!existsSync(out)) throw new Error(`no video at ${out}`);

const probe = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate,sample_rate,channels:format=duration", "-of", "json", out], { encoding: "utf8" }));
const v = probe.streams.find((s) => s.codec_type === "video");
const a = probe.streams.find((s) => s.codec_type === "audio");
const loud = ffErr(["-i", out, "-af", "ebur128=peak=true", "-f", "null", "-"]);
const sum = loud.slice(loud.lastIndexOf("Summary"));
const lufs = Number(/I:\s+(-?[\d.]+) LUFS/.exec(sum)?.[1]);
const peak = Number(/Peak:\s+(-?[\d.]+) dBFS/.exec(sum)?.[1]);
// share of near-black pixels that makes a frame "black" (ffmpeg default 0.98). A theme drawn on pure black sets
// theme.json render.blackPictureThreshold closer to 1 so a lone glowing dot is not mistaken for a dead frame.
const picTh = readJsonIf(root, "data/theme.json", {}).render?.blackPictureThreshold ?? 0.98;
const blacks = interiorBlackIntervals([...ffErr(["-i", out, "-vf", `blackdetect=d=0.1:pix_th=0.05:pic_th=${picTh}`, "-an", "-f", "null", "-"]).matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)]
  .map((m) => [Number(m[1]), Number(m[2])]), duration);

const checks = {
  size: [`${v.width}x${v.height}`, v.width === aspect.width && v.height === aspect.height],
  fps: [v.r_frame_rate, v.r_frame_rate === `${fps}/1`],
  duration: [Number(probe.format.duration), Math.abs(Number(probe.format.duration) - duration) < 0.2],
  audio: [`${a?.sample_rate} Hz ${a?.channels} ch`, a?.sample_rate === "48000" && a?.channels === 2],
  loudness: [lufs, Math.abs(lufs + 14) <= 1],
  truePeak: [peak, peak <= -1],
  blackFrames: [blacks, blacks.length === 0],
};
const failed = Object.entries(checks).filter(([, [, ok]]) => !ok).map(([k]) => k);
writeJson(root, "data/render-report.json", { video: out, checks, failed });
for (const [k, [val, ok]] of Object.entries(checks)) console.log(`${ok ? "ok  " : "FAIL"} ${k.padEnd(12)} ${JSON.stringify(val)}`);

if (failed.length) {
  console.error(`render gates failed: ${failed.join(", ")}`);
  process.exit(1);
}
// The receipt is the last step and only for a render this run made (never --verify-only) that passed every check:
// gate C can then be stamped only on an MP4 that came from the reviewed files.
if (requireReview && !args.has("--verify-only") && gatePy("receipt", "--project", root, "--output", out, "--expect-inputs-sha", inputsBefore).status !== 0) {
  process.exit(1);
}

if (args.has("--social")) {
  const social = out.replace(/\.mp4$/, "-social.mp4");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", out, "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-maxrate", "6M", "-bufsize", "12M",
    "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.1", "-g", String(fps * 2), "-c:a", "copy", "-movflags", "+faststart", social]);
  console.log(`social -> ${social}`);
}
