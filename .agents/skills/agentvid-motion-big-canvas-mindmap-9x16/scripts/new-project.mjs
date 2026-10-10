// Scaffolds a video project from this skill. Run from anywhere:
//   node <skill>/scripts/new-project.mjs <project dir> [--language=en|vi] [--brand=path/to/brand.json] [--style=<name>]
//                                        [--voice=<name>] [--engine=gemini|vieneu|soniox|elevenlabs] [--region=bac|trung|nam]
//                                        [--aspect=<name>] [--music=<id>]
//   node <skill>/scripts/new-project.mjs --list-voices        # Vietnamese VieNeu presets by region
// Voice: theme default for the language < ~/.agentvid/voice.json < --engine/--voice/--region (lib/resolve-project-voice.mjs).
// Music: a theme that bundles tracks (theme.json "musicTracks": ["a", "b"], files assets/audio/music/bgm-default-<id>.mp3)
// starts every project from one of them (--music=<id>, default the first) as assets/audio/music/bgm-raw.mp3.
// Aspect: the skill's own aspect.json by default; --aspect=<name> picks an alternate the theme opted into via
// theme.json "aspects" (build-motion-skill.py then copies skill/aspects/<name>.json) — e.g. "square-1x1".
// Themes with "styles" in theme.json: --style picks one (default theme.defaultStyle); index.html's {{STYLE}} becomes the
// style name, and data examples named <file>.example.<style>.json or script/storyboard.example.<lang>.<style>.json win.
// Copies the composition template, runtime, fonts, textures, example data and the pipeline scripts, merges the
// brand (skill default < your brand file) into <project>/brand.json, and fills the voice for the chosen language
// from theme.json. Never overwrites an existing project: use a new directory for every video.
import { execFileSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { ensureDir, parseArgs, writeJson } from "./lib/project-io.mjs";
import { readVoicePrefs, resolveProjectVoice } from "./lib/resolve-project-voice.mjs";

const skill = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs();
const catalog = JSON.parse(readFileSync(join(skill, "scripts", "lib", "vieneu-voices.json"), "utf8")).voices;
if (args.has("--list-voices")) {
  const REGION = { bac: "Bắc (Northern)", trung: "Trung (Central)", nam: "Nam (Southern)" };
  for (const [r, label] of Object.entries(REGION)) {
    console.log(`${label}:`);
    for (const v of catalog.filter((x) => x.region === r)) console.log(`  ${v.starred ? "*" : " "} ${v.name.padEnd(16)} ${v.gender.padEnd(7)} ${v.style}`);
  }
  console.log("pick one: --voice=\"Thùy Dung\", or --region=nam (keeps the theme voice's gender), or set it once in ~/.agentvid/voice.json");
  process.exit(0);
}
const target = args.mode && resolve(args.mode);
if (!target) throw new Error("usage: node new-project.mjs <project dir> [--language=en|vi] [--brand=brand.json]");
if (existsSync(join(target, "index.html"))) throw new Error(`${target} already holds a project; pick a new directory`);

const theme = JSON.parse(readFileSync(join(skill, "theme.json"), "utf8"));
const language = args.value("language") || theme.defaultLanguage || "en";
// theme.json "narration": "none" = a music-only theme (no voice take, no captions, no data/script.json); such a theme
// ships its own timing script instead of build-timeline. Anything else keeps the narrated pipeline.
const musicOnly = theme.narration === "none";
const themeVoice = musicOnly ? null : theme.voices?.[language];
if (!musicOnly && !themeVoice) throw new Error(`theme has no voice for language "${language}" (available: ${Object.keys(theme.voices || {}).join(", ")})`);
const { voice, from: voiceFrom } = musicOnly ? { voice: null, from: "none" } : resolveProjectVoice({
  themeVoice, prefs: readVoicePrefs(), language, catalog,
  flags: { engine: args.value("engine"), voice: args.value("voice"), region: args.value("region") },
});
const styles = Object.keys(theme.styles || {});
const style = styles.length ? args.value("style") || theme.defaultStyle || styles[0] : null;
if (style && !styles.includes(style)) throw new Error(`unknown style "${style}" (available: ${styles.join(", ")})`);

// Validate every input BEFORE creating anything on disk (an invalid --aspect, a missing/malformed --brand file,
// etc. used to throw after the project dir + template + scripts were already copied, leaving a partial project
// that then failed "already holds a project" on retry). Everything below reads only from `skill` or the user's
// own files — nothing here touches `target` yet.
const KEBAB_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// aspect: the skill's own aspect.json, or one of its opt-in alternates (theme.json "aspects", copied by
// build-motion-skill.py into skill/aspects/<name>.json) via --aspect=<name>. Strict kebab-case doubles as the
// containment check — it can never contain "..", "/" or "\\", so join(skill, "aspects", aspectFlag) can never
// resolve outside skill/aspects/.
const musicTracks = theme.musicTracks || [];
const musicFlag = args.rawValue("music") ?? null; // rawValue keeps an empty "--music=" so it is rejected, not defaulted
if (musicFlag !== null && !musicTracks.includes(musicFlag))
  throw new Error(`unknown --music "${musicFlag}" (this skill bundles: ${musicTracks.length ? musicTracks.join(", ") : "no tracks"})`);
const aspectFlag = args.value("aspect");
let aspectSrc = join(skill, "aspect.json");
if (aspectFlag) {
  if (!KEBAB_SLUG.test(aspectFlag)) throw new Error(`invalid --aspect "${aspectFlag}" (use a kebab-case name like "square-1x1")`);
  const aspectsDir = join(skill, "aspects");
  const alt = join(aspectsDir, `${aspectFlag}.json`);
  if (!(resolve(alt).startsWith(resolve(aspectsDir) + sep) && existsSync(alt))) {
    const available = existsSync(aspectsDir) ? readdirSync(aspectsDir).map((f) => f.replace(/\.json$/, "")) : [];
    throw new Error(`unknown --aspect "${aspectFlag}" (this skill supports: ${available.length ? available.join(", ") : "only its default aspect"})`);
  }
  aspectSrc = alt;
}
const aspect = JSON.parse(readFileSync(aspectSrc, "utf8"));

// brand: the skill default (AgentVid) when no file is given; with a user file, start clean so no AgentVid text or
// logo leaks in, derive the obvious fields from the name, and copy every logo file into the project
const defaults = JSON.parse(readFileSync(join(skill, "brand.default.json"), "utf8"));
const userBrandPath = args.value("brand");
let brand = defaults;
// logoCopies: resolved (src, dst) pairs computed now, before `target` exists, so a missing logo file fails here
// — not after the project directory, template and scripts were already written.
const logoCopies = [];
if (userBrandPath) {
  if (!existsSync(userBrandPath)) throw new Error(`--brand file not found: ${userBrandPath}`);
  const user = JSON.parse(readFileSync(userBrandPath, "utf8")); // throws clearly on malformed JSON, before any write
  const name = user.name || "Brand";
  brand = {
    name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), signature: name, signatureAt: 1.0,
    tagline: "", hudLabel: name.toUpperCase(), outroLine: "", url: "", ...user,
    colors: { ...defaults.colors, ...user.colors },
  };
  for (const key of ["logo", "logoOnLight", "logoMark"]) {
    if (!user[key]) continue;
    const src = resolve(dirname(userBrandPath), user[key]);
    if (!existsSync(src)) throw new Error(`--brand "${key}" file not found: ${src}`);
    const dst = `assets/brand/${key}${extname(src)}`;
    logoCopies.push({ key: user[key], src, dst });
    brand[key] = dst;
  }
  brand.logoOnLight ||= brand.logo || "";
  brand.logoMark ||= "";
}

// --- every input validated: only from here does the script touch `target` ---
ensureDir(target);
cpSync(join(skill, "template"), target, { recursive: true });
cpSync(join(skill, "scripts"), join(target, "scripts"), {
  recursive: true,
  filter: (src) => !/[\\/](tests|__pycache__)([\\/]|$)/.test(src) && basename(src) !== "new-project.mjs",
});
if (musicTracks.length) {
  const music = join(target, "assets/audio/music");
  copyFileSync(join(music, `bgm-default-${musicFlag || musicTracks[0]}.mp3`), join(music, "bgm-raw.mp3"));
}
copyFileSync(aspectSrc, join(target, "data", "aspect.json"));
copyFileSync(join(skill, "theme.json"), join(target, "data", "theme.json")); // scene types for storyboard checks
if (existsSync(join(skill, "styles"))) cpSync(join(skill, "styles"), join(target, "styles"), { recursive: true }); // scene-mixer profiles (--styles builds only)
const html = join(target, "index.html");
writeFileSync(html, readFileSync(html, "utf8").replaceAll("{{WIDTH}}", aspect.width).replaceAll("{{HEIGHT}}", aspect.height)
  .replaceAll("{{STYLE}}", style || ""));

if (logoCopies.length) {
  ensureDir(join(target, "assets", "brand"));
  for (const { key, src, dst } of logoCopies) {
    copyFileSync(src, join(target, dst));
    // an opaque logo shows as a box on the theme background: say so, with the fix
    try {
      if (execFileSync("magick", ["identify", "-format", "%[opaque]", src], { encoding: "utf8" }).trim().toLowerCase().startsWith("true"))
        console.warn(`brand: ${key} has no transparency and will show as a box. Make a transparent PNG (see references/setup-and-brand.md).`);
    } catch { /* ImageMagick missing: skip the check */ }
  }
}
writeJson(target, "brand.json", brand, 2);

// example script in the chosen language, with that language's voice
const examples = join(target, "data");
// the style's own example (its story and wording) wins over the language default
const pick = (base) => [style && `${base}.${style}.json`, `${base}.json`].filter(Boolean).map((f) => join(examples, f)).find(existsSync);
if (!musicOnly) {
  const script = JSON.parse(readFileSync(pick(`script.example.${language}`), "utf8"));
  // the example may tune the theme voice (a style prompt, another preset); a voice the user chose wins over it, and the
  // example's fields are dropped when the user switched engine (a Gemini style prompt means nothing to VieNeu)
  const scriptVoice = voiceFrom === "theme" ? { ...voice, ...script.voice }
    : { ...(voice.engine === themeVoice.engine ? script.voice : {}), ...voice };
  // pronounce: the theme's respelling table, if any, applied to the voice text only, never to captions
  const pronounce = { ...theme.pronounce, ...script.pronounce };
  writeJson(target, "data/script.json", { ...script, language, voice: scriptVoice, ...(Object.keys(pronounce).length ? { pronounce } : {}) }, 2);
}
const board = pick(`storyboard.example.${language}`);
if (board) copyFileSync(board, join(examples, "storyboard.json"));
for (const f of readdirSync(examples)) {
  const m = /^(.+)\.example\.json$/.exec(f);
  // style.json is opt-in (scene mixer, phase 3): auto-instantiating it here would turn it on for every project
  // of every theme, even skills built without --styles (which never get a styles/ folder to validate against).
  // A director copies data/style.example.json to data/style.json by hand once styles are installed.
  if (m && m[1] !== "style" && !existsSync(join(examples, `${m[1]}.json`))) copyFileSync(join(examples, f), join(examples, `${m[1]}.json`));
}
// style data (music-plan.example.gift.json -> music-plan.json) replaces the generic example
if (style) for (const f of readdirSync(examples)) {
  const m = /^([a-z-]+)\.example\.([a-z]+)\.json$/.exec(f);
  if (m && m[2] === style) copyFileSync(join(examples, f), join(examples, `${m[1]}.json`));
}
// reading pace belongs to the voice: energetic EN lines are sped up, VieNeu keeps its natural pace
if (voice?.tempo) {
  const tc = JSON.parse(readFileSync(join(examples, "timeline-config.json"), "utf8"));
  writeJson(target, "data/timeline-config.json", { ...tc, tempo: voice.tempo }, 2);
}
const voiceNote = musicOnly ? "music only (no voice)" : `voice ${voice.engine}/${voice.voice || "default"} (from ${voiceFrom})`;
console.log(`project ready: ${target}\n  ${style ? `style ${style}, ` : ""}language ${language}, ${voiceNote}, brand "${brand.name}"\n  next: ${musicOnly ? "fill the theme's data files" : "edit data/script.json"}, then follow the skill's pipeline`);
