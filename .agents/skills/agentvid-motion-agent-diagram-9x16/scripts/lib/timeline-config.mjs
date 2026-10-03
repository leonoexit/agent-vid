// Loads data/timeline-config.json + data/music-arrangement.json and exposes the music grid.
// Time values in the config are either seconds (number) or { "beat": n, "plus": seconds } on the grid.
import { readJson, readJsonIf } from "./project-io.mjs";

const DEFAULTS = {
  fps: 30,
  tempo: 1.08, // energetic lines play this much faster; outro scenes keep natural pace
  cutAfter: 0.25, // next scene cuts on the first beat at least this long after the last spoken word (a breath)
  voLead: 0.05, // voice starts this long after its scene cut
  segPre: 0.15, // audio kept before a line's first word (aligner onsets can land late on soft vowels)
  segPost: 0.15, // audio kept after a line's last word
  kick: [], // quarter-note ranges [from, to) where the full beat plays (drives visual pulses)
  drops: [], // drop beats (big flash / shake)
  anchors: {}, // { sceneId: { scene: time, lines: [time|null, ...] } }
  outroBed: null, // seconds where outro-raw.mp3 fades in under the main track (null = no outro bed)
  musicDb: -3, // music level vs the voice (both normalised to -16 LUFS) before ducking; lands ~4-6 dB under speech
  fadeOut: 3.5, // final fade of the whole mix, seconds
};

export function loadTimeline(root) {
  const cfg = { ...DEFAULTS, ...readJson(root, "data/timeline-config.json") };
  if (!cfg.duration) throw new Error("data/timeline-config.json needs \"duration\" (seconds)");
  const arrangement = readJsonIf(root, "data/music-arrangement.json");
  const bpm = arrangement?.bpm ?? cfg.bpm ?? 120;
  const beat0 = arrangement?.beat0 ?? cfg.beat0 ?? 0;
  const beatLen = 60 / bpm;
  const beat = (n) => beat0 + beatLen * n;
  const nextBeat = (t) => beat(Math.ceil((t - beat0) / beatLen - 1e-6));
  const time = (v) => (v == null ? null : typeof v === "number" ? v : beat(v.beat) + (v.plus || 0));
  const outroBeat = arrangement?.fadeOut?.beat ?? Math.floor((cfg.duration - beat0) / beatLen);
  return { cfg, arrangement, bpm, beat0, beatLen, beat, nextBeat, time, outroBeat };
}
