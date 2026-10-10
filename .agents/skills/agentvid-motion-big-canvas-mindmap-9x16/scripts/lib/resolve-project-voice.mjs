// Which voice a new project starts with: the theme's voice for the language < the user's ~/.agentvid/voice.json
// (shared with the explainer skills) < new-project flags --engine= --voice= --region=bac|trung|nam.
// voice.json: {"engine": "vieneu", "voice": "Thùy Dung"} (applies to Vietnamese, the explainer format) or per language
// {"vi": {"engine": "vieneu", "voice": "Thùy Dung"}, "en": {"engine": "gemini", "voice": "Puck"}}.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { agentvidHome } from "./vieneu-env.mjs";

const defined = (o) => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => v != null && v !== ""));
export const PROJECT_VOICE_ENGINES = ["gemini", "elevenlabs", "soniox", "vieneu"];
export const VIENEU_REGIONS = ["bac", "trung", "nam"];

/** ~/.agentvid/voice.json (or $AGENTVID_HOME), {} when missing or unreadable. */
export function readVoicePrefs() {
  const file = join(agentvidHome(), "voice.json");
  try {
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
  } catch {
    console.warn(`voice: ${file} is not valid JSON, ignored`);
    return {};
  }
}

/**
 * themeVoice: theme.json voices[language]; prefs: voice.json; flags: { engine, voice, region }; catalog: vieneu voices.
 * -> { voice, from } where `from` names what decided it.
 */
export function resolveProjectVoice({ themeVoice, prefs = {}, language, flags = {}, catalog = [] }) {
  if (flags.engine && !PROJECT_VOICE_ENGINES.includes(flags.engine))
    throw new Error(`unknown voice engine "${flags.engine}" (use ${PROJECT_VOICE_ENGINES.join(", ")})`);
  if (flags.region && !VIENEU_REGIONS.includes(flags.region))
    throw new Error(`unknown VieNeu region "${flags.region}" (use ${VIENEU_REGIONS.join(", ")})`);
  // the flat explainer format carries only a VieNeu preset name ("engine": "vieneu" is written by its setup, not a
  // choice), so it only renames the voice of a theme that already reads Vietnamese with VieNeu
  const flat = language === "vi" && themeVoice.engine === "vieneu" ? { voice: prefs.voice } : {};
  const pref = defined(prefs[language] ?? flat);
  const want = { ...pref, ...defined({ engine: flags.engine, voice: flags.voice }) };
  const from = flags.engine || flags.voice ? "flags" : Object.keys(pref).length ? "~/.agentvid/voice.json" : "theme";
  // another engine: the theme's model / style / tempo belong to its own engine, start from that engine's defaults
  let voice = want.engine && want.engine !== themeVoice.engine ? { engine: want.engine, tempo: 1.0, ...want } : { ...themeVoice, ...want };
  if (!PROJECT_VOICE_ENGINES.includes(voice.engine))
    throw new Error(`unknown voice engine "${voice.engine}" (use ${PROJECT_VOICE_ENGINES.join(", ")})`);
  if (voice.engine === "vieneu" && language !== "vi")
    throw new Error(`VieNeu supports language "vi", not "${language}"; choose another --engine`);
  if (flags.region && flags.voice) throw new Error("use either --voice or --region, not both");
  if (flags.region && voice.engine !== "vieneu") throw new Error("--region is only valid with the VieNeu engine");
  if (flags.region && voice.engine === "vieneu" && !flags.voice) {
    const gender = catalog.find((v) => v.name === voice.voice)?.gender;
    const pick = [...catalog]
      .filter((v) => v.region === flags.region)
      .sort((a, b) => (b.gender === gender) - (a.gender === gender) || !!b.starred - !!a.starred)[0];
    if (!pick) throw new Error(`no VieNeu voice for region "${flags.region}" (use bac, trung or nam)`);
    voice = { ...voice, voice: pick.name };
    return { voice, from: `--region=${flags.region}` };
  }
  if (voice.engine === "vieneu" && (!catalog.length || !catalog.some((v) => v.name === voice.voice)))
    throw new Error(`"${voice.voice}" is not a known VieNeu preset (run node <skill>/scripts/new-project.mjs --list-voices)`);
  return { voice, from };
}
