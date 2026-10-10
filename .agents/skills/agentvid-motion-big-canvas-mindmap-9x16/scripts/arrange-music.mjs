// Re-arranges the generated music on its own beat grid so its drops land where the video needs them.
// ElevenLabs Music does not honour section lengths, so whole bars are copied from the raw track to target
// beats (data/music-arrangement.json) and joined with short crossfades that end exactly on each downbeat.
// A gap between segments becomes a silent stop (e.g. for a shout line right before a drop).
// Verify with: python scripts/verify-arrangement.py .   Usage: node scripts/arrange-music.mjs
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { projectRoot, readJson } from "./lib/project-io.mjs";

const root = projectRoot(import.meta.url);
const plan = readJson(root, "data/music-arrangement.json");
const BEAT = 60 / plan.bpm;
const at = (n) => plan.beat0 + BEAT * n; // same grid for source and target
const XF = plan.crossfade ?? 0.025;
const FMT = "aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo";

const graph = [`[0:a]${FMT},asplit=${plan.segments.length}${plan.segments.map((_, i) => `[s${i}]`).join("")}`];
plan.segments.forEach(({ to: [a, b], from }, i) => {
  // Each piece spans [downbeat(a) - XF, downbeat(b)]. The first piece must start at 0 s: amix re-bases the
  // mixed stream to its earliest sample, so a later start would shift every segment (a uniform 40 ms lag).
  const pre = i === 0 ? at(a) : XF;
  const len = (b - a) * BEAT + pre;
  graph.push(
    `[s${i}]atrim=start=${(at(from) - pre).toFixed(4)}:duration=${len.toFixed(4)},asetpts=PTS-STARTPTS,` +
      `afade=t=in:d=${pre || 0.005},afade=t=out:st=${(len - XF).toFixed(4)}:d=${XF},adelay=delays=${Math.round((at(a) - pre) * 1000)}:all=1[p${i}]`,
  );
});
const end = at(plan.segments.at(-1).to[1]);
const fade = at(plan.fadeOut.beat);
graph.push(
  `${plan.segments.map((_, i) => `[p${i}]`).join("")}amix=inputs=${plan.segments.length}:normalize=0:dropout_transition=0,` +
    `afade=t=out:st=${fade.toFixed(3)}:d=${plan.fadeOut.seconds},atrim=0:${end.toFixed(3)}[out]`,
);

const out = join(root, plan.output);
execFileSync("ffmpeg", ["-hide_banner", "-v", "error", "-y", "-i", join(root, plan.source), "-filter_complex", graph.join(";"), "-map", "[out]", "-c:a", "flac", out]);
for (const { to: [a, b], from, role } of plan.segments) {
  console.log(`beats ${String(a).padStart(3)}–${String(b).padEnd(3)} (${at(a).toFixed(2)}s) ← source beat ${String(from).padStart(3)}  ${role || ""}`);
}
console.log(`music -> ${plan.output} (${end.toFixed(2)}s, fade from ${fade.toFixed(2)}s)`);
