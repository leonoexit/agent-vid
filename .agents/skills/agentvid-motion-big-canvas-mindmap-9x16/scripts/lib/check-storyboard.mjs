// Static checks of data/storyboard.json against the scheduled voice, run by build-timeline before rendering:
// every storyboard scene has a voiced scene, types are known to the theme, and every word anchor is spoken.
// Structural/media failures stop the pipeline; unspoken word anchors remain recoverable warnings.
import { existsSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { normWord } from "./project-io.mjs";

const SCENE_TYPES = ["hook", "label", "photo", "illus", "howto", "tips", "offer", "cover", "stats", "feature", "statement", "outro",
  "power", "swarm", "gauge", "handoff", "fan-out", "split", "recap", "roll", "choice", "year", "formula", "compare", "figure",
  "morph", "breath", "stairs", "balance", "orbit", "ripple", "ring", "reveal", "why", "journey"];

/** Collects anchor values ("word", "word#2", { word }) from any `at` key, at any depth of a spec. */
function anchors(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => anchors(n, out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "at") {
        const collect = (value, named = false, array = false) => {
          if (Array.isArray(value) && array) value.forEach((leaf) => collect(leaf));
          else if (named && value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length &&
            !["word", "nth", "plus", "beat"].some((key) => Object.hasOwn(value, key)))
            Object.values(value).forEach((leaf) => collect(leaf, false, true));
          else if (value != null) out.push(value);
        };
        // Scene/card/widget at maps name separate anchors; item at fields are documented leaves only.
        collect(v, typeof node.id === "string" || typeof node.kind === "string");
      } else anchors(v, out);
    }
  }
  return out;
}

export function transitionTypesForTheme(theme = {}) {
  if (theme.transitionTypes) return theme.transitionTypes;
  const types = theme.sceneTypes || [];
  if (types.includes("power")) return ["none", "slam", "glitch", "dots", "flip", "fade"];
  if (types.includes("roll")) return ["none", "dissolve", "fade"];
  if (types.includes("morph")) return ["none"];
  if (types.includes("journey")) return ["none", "soft", "sheet"];
  if (theme.base === "_ink-paper-shared" || types.includes("photo") || types.includes("swarm"))
    return ["none", "sweep", "lift", "turn", "fade", ...(types.includes("swarm") ? ["dissolve"] : [])];
  if (theme.skill_name?.includes("ink-paper")) return ["none", "sweep", "lift", "turn", "fade"];
  if (theme.skill_name?.includes("keynote")) return ["none", "up", "zoom", "flip", "iris", "fade"];
  return ["none", "sweep", "lift", "turn", "fade", "up", "zoom", "flip", "iris", "slam", "glitch", "dots", "dissolve", "soft", "sheet"];
}

function checkMedia(spec, root, errors) {
  const mediaKeys = new Set(["src", "bg", "photo", "img", "platformLogo"]);
  const inspect = (node, field = "") => {
    if (Array.isArray(node)) return node.forEach((n) => inspect(n, field));
    if (node && typeof node === "object") return Object.entries(node).forEach(([key, v]) => inspect(v, key));
    if ((!mediaKeys.has(field) && field !== "photos") || typeof node !== "string") return;
    if (!node.trim() || isAbsolute(node) || /^[a-z][a-z0-9+.-]*:/i.test(node) || node.includes("\\") || node.split("/").includes("..")) {
      errors.push(`${spec.id}: ${field} must be a local path inside the project`);
      return;
    }
    if (!root) return;
    const path = resolve(root, node);
    if (!existsSync(path) || !statSync(path).isFile()) errors.push(`${spec.id}: missing local asset ${node}`);
    else {
      const rel = relative(realpathSync(root), realpathSync(path));
      if (rel.startsWith("..") || isAbsolute(rel)) errors.push(`${spec.id}: asset escapes project ${node}`);
    }
  };
  inspect(spec);
}

export function validateStoryboard(board, scenes, { root, theme = {}, knownTypes = theme.sceneTypes || SCENE_TYPES } = {}) {
  const errors = [];
  const warn = [];
  if (!Array.isArray(board?.scenes) || !board.scenes.length) return { errors: ["storyboard needs a nonempty scenes array"], warnings: warn };
  const seen = new Set();
  const transitions = transitionTypesForTheme(knownTypes === SCENE_TYPES ? theme : { ...theme, sceneTypes: knownTypes });
  const farm = theme.skill_name?.includes("farm-market") || (knownTypes.includes("photo") && knownTypes.includes("illus") && knownTypes !== SCENE_TYPES);
  const byId = new Map(scenes.map((s) => [s.id, s]));
  for (const spec of board.scenes || []) {
    if (!spec || typeof spec !== "object" || typeof spec.id !== "string" || !spec.id.trim() || ["__proto__", "constructor", "prototype"].includes(spec.id)) {
      errors.push("every storyboard scene needs a nonempty safe id");
      continue;
    }
    if (seen.has(spec.id)) errors.push(`${spec.id}: duplicate storyboard scene id`);
    seen.add(spec.id);
    if (typeof spec.type !== "string" || !spec.type || (knownTypes.length && !knownTypes.includes(spec.type)))
      errors.push(`${spec.id}: unknown scene type "${spec.type}"`);
    if (spec.transition != null && !transitions.includes(spec.transition)) errors.push(`${spec.id}: unknown transition "${spec.transition}"`);
    if (farm || ["photo", "illus", "howto"].includes(spec.type)) {
      if (spec.type === "photo" && (!Array.isArray(spec.photos) || spec.photos.length < 1 || spec.photos.length > 2 || spec.photos.some((p) => !p || typeof p.src !== "string" || !p.src.trim())))
        errors.push(`${spec.id}: photo needs 1–2 photos with src paths`);
      if (["illus", "howto"].includes(spec.type) && (typeof spec.src !== "string" || !spec.src.trim())) errors.push(`${spec.id}: ${spec.type} needs src`);
      if (spec.type === "illus" && (typeof spec.caption !== "string" || !spec.caption.trim())) errors.push(`${spec.id}: illustration needs a disclosure caption`);
      if (spec.type === "howto" && (!Array.isArray(spec.steps) || spec.steps.length !== 3 || spec.steps.some((p) => !p?.text || p.n == null))) errors.push(`${spec.id}: howto needs three numbered steps`);
      if (spec.type === "hook" && (!Array.isArray(spec.lines) || spec.lines.length < 1 || spec.lines.length > 2 || spec.lines.some((p) => !p?.text))) errors.push(`${spec.id}: hook needs 1–2 text lines`);
    }
    checkMedia(spec, root, errors);
    const sc = byId.get(spec.id);
    if (!sc) { errors.push(`${spec.id}: no scene with this id in script.json`); continue; }
    const words = sc.lines.flatMap((l) => l.words);
    for (const a of anchors(spec)) {
      if (typeof a === "number") {
        if (!Number.isFinite(a) || a < 0 || a > sc.end - sc.start) errors.push(`${spec.id}: anchor seconds must be inside the scene`);
        continue;
      }
      const object = a && typeof a === "object" && !Array.isArray(a);
      if ((typeof a !== "string" && (!object || typeof a.word !== "string" ||
          Object.keys(a).some((key) => !["word", "nth", "plus"].includes(key)))) ||
          (object && Object.hasOwn(a, "plus") && !Number.isFinite(a.plus))) {
        errors.push(`${spec.id}: invalid word anchor`);
        continue;
      }
      const match = typeof a === "string" ? /^([^#]+)(?:#(\d+))?$/.exec(a) : null;
      const word = object ? a.word : match?.[1];
      const nth = object ? (Object.hasOwn(a, "nth") ? a.nth : 1) : Number(match?.[2] ?? 1);
      if (!word || !normWord(word) || !Number.isSafeInteger(nth) || nth < 1) {
        errors.push(`${spec.id}: anchor needs a word and positive integer occurrence`);
        continue;
      }
      const hit = words.filter((w) => w[0] === normWord(word))[nth - 1];
      const plus = object && Object.hasOwn(a, "plus") ? a.plus : 0;
      if (hit) {
        // Scheduled words retain [key, shown, onset, end]. Renderer fallbacks vary by field and theme.
        const resolved = hit[2] + plus;
        if (!Number.isFinite(resolved) || resolved < sc.start - 1e-9 || resolved > sc.end + 1e-9)
          errors.push(`${spec.id}: resolved word anchor must be inside the scene`);
      } else {
        if (plus !== 0) errors.push(`${spec.id}: nonzero plus requires a spoken word anchor`);
        warn.push(`${spec.id}: anchor "${word}"${nth > 1 ? ` #${nth}` : ""} is not spoken in this scene`);
      }
    }
  }
  for (const s of scenes) if (!seen.has(s.id)) errors.push(`${s.id}: voiced scene has no storyboard entry (screen stays empty)`);
  return { errors, warnings: warn };
}

export function checkStoryboard(board, scenes, knownTypes, options = {}) {
  const { errors, warnings } = validateStoryboard(board, scenes, { ...options, knownTypes });
  if (errors.length) throw new Error(`Invalid storyboard:\n${errors.join("\n")}`);
  return warnings;
}
