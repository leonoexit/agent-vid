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
  const finite = (name, value, min = 0, strict = false) => {
    if (!Number.isFinite(value) || (strict ? value <= min : value < min))
      throw new Error(`${name} must be a finite ${strict ? "positive" : "nonnegative"} number`);
  };
  finite("duration", cfg.duration, 0, true);
  if (!Number.isInteger(cfg.fps) || cfg.fps <= 0) throw new Error("fps must be a positive integer (default 30)");
  finite("tempo", cfg.tempo, 0, true);
  for (const key of ["cutAfter", "voLead", "segPre", "segPost", "fadeOut"]) finite(key, cfg[key]);
  if (cfg.fadeOut > cfg.duration) throw new Error("fadeOut exceeds duration");
  if (!Number.isFinite(cfg.musicDb)) throw new Error("musicDb must be finite");
  if (cfg.outroBed != null) {
    finite("outroBed", cfg.outroBed);
    if (cfg.outroBed > cfg.duration) throw new Error("outroBed exceeds duration");
  }
  const arrangement = readJsonIf(root, "data/music-arrangement.json");
  const bpm = arrangement?.bpm ?? cfg.bpm ?? 120;
  const beat0 = arrangement?.beat0 ?? cfg.beat0 ?? 0;
  finite("bpm", bpm, 0, true);
  finite("beat0", beat0);
  const beatLen = 60 / bpm;
  const beat = (n) => beat0 + beatLen * n;
  const nextBeat = (t) => beat(Math.ceil((t - beat0) / beatLen - 1e-6));
  const time = (v) => {
    if (v == null) return null;
    if (typeof v !== "number" && (!v || typeof v !== "object" || Array.isArray(v) ||
      Object.keys(v).some((key) => !["beat", "plus"].includes(key)) ||
      !Number.isFinite(v.beat) || v.beat < 0 || (v.plus != null && !Number.isFinite(v.plus))))
      throw new Error("anchor must be finite seconds or { beat, plus }");
    const t = typeof v === "number" ? v : beat(v.beat) + (v.plus ?? 0);
    finite("anchor time", t);
    if (t > cfg.duration) throw new Error(`anchor time ${t} exceeds duration ${cfg.duration}`);
    return t;
  };
  if (!cfg.anchors || typeof cfg.anchors !== "object" || Array.isArray(cfg.anchors)) throw new Error("anchors must be an object");
  for (const anchor of Object.values(cfg.anchors)) {
    if (!anchor || typeof anchor !== "object" || Array.isArray(anchor)) throw new Error("scene anchor must be an object");
    time(anchor.scene);
    if (anchor.lines != null && !Array.isArray(anchor.lines)) throw new Error("anchor lines must be an array");
    (anchor.lines || []).forEach(time);
  }
  if (!Array.isArray(cfg.drops) || !Array.isArray(cfg.kick)) throw new Error("drops and kick must be arrays");
  cfg.drops.forEach((n) => { finite("drop beat", n); time({ beat: n }); });
  for (const range of cfg.kick) {
    if (!Array.isArray(range) || range.length !== 2) throw new Error("kick must contain [from, to] beat ranges");
    range.forEach((n) => finite("kick beat", n));
    if (range[1] <= range[0]) throw new Error("kick beat range must increase");
    range.forEach((n) => time({ beat: n }));
  }
  const outroBeat = arrangement?.fadeOut?.beat ?? Math.floor((cfg.duration - beat0) / beatLen);
  finite("outroBeat", outroBeat);
  time({ beat: outroBeat });
  return { cfg, arrangement, bpm, beat0, beatLen, beat, nextBeat, time, outroBeat };
}
