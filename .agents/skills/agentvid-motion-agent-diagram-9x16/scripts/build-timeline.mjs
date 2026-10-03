// Master timeline: schedules voice lines on the music grid, builds karaoke captions, resolves SFX cues,
// renders the audio mix + voice envelope, then injects TIMING and BRAND into index.html.
// Inputs: data/script.json, data/vo-lines.json, data/timeline-config.json, data/music-arrangement.json,
//         data/cues.json, data/aspect.json, brand.json, data/storyboard.json (+ data/theme.json scene types)
// Usage: node scripts/build-timeline.mjs [--dry] [--no-audio] [--stems]
//   --dry       print the schedule only (scene cuts with beat numbers, line spans)
//   --no-audio  keep the existing mix and envelope (captions / timing / visuals-only changes)
//   --stems     also write music and voice stems for scripts/measure-mix-balance.py
import { buildCaptions } from "./lib/build-captions.mjs";
import { checkStyleMix } from "./lib/check-style-mix.mjs";
import { checkStoryboard } from "./lib/check-storyboard.mjs";
import { injectIntoComposition } from "./lib/inject-timing.mjs";
import { parseArgs, projectRoot, readJson, readJsonIf, round, writeJson } from "./lib/project-io.mjs";
import { renderAudioMix } from "./lib/render-audio-mix.mjs";
import { resolveSfxCues } from "./lib/resolve-sfx-cues.mjs";
import { scheduleVoiceLines } from "./lib/schedule-voice-lines.mjs";
import { loadTimeline } from "./lib/timeline-config.mjs";

const root = projectRoot(import.meta.url);
const args = parseArgs();
const grid = loadTimeline(root);
const script = readJson(root, "data/script.json");
const scenes = scheduleVoiceLines(script, readJson(root, "data/vo-lines.json"), grid);

const beatOf = (t) => ((t - grid.beat0) / grid.beatLen).toFixed(1);
for (const s of scenes) {
  console.log(`${s.id.padEnd(20)} ${s.start.toFixed(2).padStart(7)} (b${beatOf(s.start)}) → ${s.end.toFixed(2).padStart(7)}  ` +
    s.lines.map((l) => `${l.on.toFixed(2)}–${l.off.toFixed(2)}`).join(" | "));
}
const themeMeta = readJsonIf(root, "data/theme.json", {});
const storyboard = readJsonIf(root, "data/storyboard.json");
if (storyboard) {
  const warnings = checkStoryboard(storyboard, scenes, themeMeta.sceneTypes);
  for (const w of warnings) console.warn(`storyboard: ${w}`);
  if (!warnings.length) console.log("storyboard: all anchors spoken");
}

// scene mixer (phase 3): data/style.json is opt-in and only works after the skill was built with --styles
// (a styles/ folder installed next to this project). See core/scripts/lib/check-style-mix.mjs for the rules.
const styleCfg = readJsonIf(root, "data/style.json");
let style = null;
if (styleCfg) {
  const { errors, warnings, base, scenes: styleScenes, chip } = checkStyleMix(styleCfg, { root, scenes, themeMeta, language: script.language });
  for (const w of warnings) console.warn(`style: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`style: ${e}`);
    process.exit(1);
  }
  style = { base, scenes: styleScenes, chip };
  const overrides = Object.keys(styleScenes).length;
  console.log(`style: base "${base}"${overrides ? `, ${overrides} scene override(s)` : ""}${chip ? ", chip on" : ""}`);
}
if (args.has("--dry")) process.exit(0);

const aspect = readJsonIf(root, "data/aspect.json", {});
const captions = buildCaptions(scenes, aspect.captions);
const sfxEvents = resolveSfxCues(readJsonIf(root, "data/cues.json", []), scenes, grid);
const env = args.has("--no-audio")
  ? readJson(root, "data/vo-envelope.json")
  : renderAudioMix(root, { scenes, sfxEvents, grid, stems: args.has("--stems") });
if (!args.has("--no-audio")) writeJson(root, "data/vo-envelope.json", env, 0);

const { cfg } = grid;
const timing = {
  duration: cfg.duration,
  fps: cfg.fps,
  language: script.language,
  aspect: { width: aspect.width, height: aspect.height, safe: aspect.safe, captions: aspect.captions },
  beat0: grid.beat0,
  beatLen: round(grid.beatLen, 6),
  kick: cfg.kick,
  drops: cfg.drops,
  outroBeat: grid.outroBeat,
  scenes: Object.fromEntries(scenes.map((s) => [s.id, {
    start: round(s.start), end: round(s.end), outro: s.outro,
    lines: s.lines.map((l) => ({ on: l.on, off: l.off, words: l.words.map(([key, , on, off]) => [key, on, off]) })),
  }])),
  captions,
  sfx: sfxEvents,
  env,
};
writeJson(root, "data/timeline.json", { ...timing, env: undefined });
injectIntoComposition(root, { timing, brand: readJson(root, "brand.json"), storyboard, style });
console.log(`captions ${captions.length}, sfx ${sfxEvents.length}, env frames ${env.length} -> index.html`);
