// Enforces the scene-mixer rules from data/style.json against the profiles a kit-edition build installed under
// <skill or project>/styles/<slug>/ (populated by build-motion-skill.py --styles). Pure function over the
// filesystem the caller points at; no network, no style-library import (motion-kit never depends on
// kits/style-library at runtime, only at build time via build-motion-skill.py).
//
// Contract: <=4 styles per video (one display font per style, so the mix never carries more than 4 display
// families either — a separate display-family cap would be unreachable and is not worth the dead code); every
// style must resolve to an installed styles/<slug>/ folder (aliases included); more than MAX_BODY_FAMILIES body
// families only warns (captions and the brand signature stay on the base style; a scene's body font is small,
// secondary text, not a reader-fatigue risk the way stacking display fonts is); and a style whose tone differs
// from the base style's tone is only allowed when theme.json declares "styleTones" listing both tones.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";

const MAX_BODY_FAMILIES = 2;
// Strict kebab-case only: this is also the containment check — a name built only from [a-z0-9-] can never
// contain "..", "/", "\\" or NUL, so join(root, "styles", name) can never resolve outside styles/.
const KEBAB_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const profilePath = (root, slug) => join(root, "styles", slug, "profile.json");

function readProfile(root, slug) {
  if (!KEBAB_SLUG.test(slug)) return null;
  const file = profilePath(root, slug);
  const stylesDir = resolve(join(root, "styles")) + sep;
  if (!resolve(file).startsWith(stylesDir) || !existsSync(file)) return null; // defense in depth alongside the kebab check above
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null; // corrupt profile.json: treated as "not installed" below, reported as an unknown style
  }
}

function installedSlugs(root) {
  const dir = join(root, "styles");
  return existsSync(dir) ? readdirSync(dir).filter((n) => readProfile(root, n) !== null) : [];
}

/**
 * A user-typed slug or alias -> the installed style slug (folder under styles/), or null when nothing matches.
 * A slug only resolves when it is strict kebab-case AND its profile.json exists and parses — a path-traversal
 * attempt (e.g. "../../etc") never matches KEBAB_SLUG, and a corrupt-but-present profile.json is never silently
 * "accepted" just because the folder exists.
 */
export function resolveStyleSlug(root, nameOrAlias) {
  if (!nameOrAlias || typeof nameOrAlias !== "string") return null;
  if (KEBAB_SLUG.test(nameOrAlias) && readProfile(root, nameOrAlias)) return nameOrAlias;
  const needle = nameOrAlias.trim().toLowerCase();
  for (const slug of installedSlugs(root)) {
    const aliases = (readProfile(root, slug)?.aliases || []).map((a) => a.toLowerCase());
    if (aliases.includes(needle)) return slug;
  }
  return null;
}

/**
 * Validates and resolves a style.json config.
 * @param {{base:string, scenes?:Record<string,string>, chip?:boolean}} styleCfg
 * @param {{root:string, scenes:{id:string}[], themeMeta?:{styleTones?:string[]}}} ctx
 * @returns {{errors:string[], base:string, scenes:Record<string,string>, chip:boolean}}
 */
export function checkStyleMix(styleCfg, { root, scenes = [], themeMeta = {}, language = null }) {
  const errors = [];
  const warnings = [];
  if (!existsSync(join(root, "styles")))
    errors.push('data/style.json is set but this build has no styles/ folder (build the skill with --styles first)');

  const used = new Set();
  const resolveNamed = (name, where) => {
    const slug = resolveStyleSlug(root, name);
    if (!slug) {
      errors.push(`${where}: unknown style "${name}" (not installed under styles/, and no alias matches)`);
      return name;
    }
    used.add(slug);
    return slug;
  };

  const base = styleCfg.base ? resolveNamed(styleCfg.base, "base") : (errors.push('style.json needs a "base" style'), null);
  const resolvedScenes = {};
  const knownIds = new Set(scenes.map((s) => s.id));
  for (const [sid, name] of Object.entries(styleCfg.scenes || {})) {
    if (!knownIds.has(sid)) errors.push(`style.json scene "${sid}" has no matching voiced scene in script.json`);
    resolvedScenes[sid] = resolveNamed(name, sid);
  }

  if (used.size > 4) errors.push(`too many styles in the mix (${used.size} > 4): ${[...used].sort().join(", ")}`);

  const body = new Set();
  for (const slug of used) {
    const family = readProfile(root, slug)?.fonts?.body;
    if (family) body.add(family);
  }
  if (body.size > MAX_BODY_FAMILIES)
    warnings.push(`${body.size} body font families in the mix (${[...body].sort().join(", ")}): every one is loaded; ` +
      `prefer styles that share the base body font`);

  const baseTone = base ? readProfile(root, base)?.tone : null;
  const allowedTones = themeMeta.styleTones && themeMeta.styleTones.length ? themeMeta.styleTones : baseTone ? [baseTone] : null;
  if (allowedTones) {
    for (const slug of used) {
      const tone = readProfile(root, slug)?.tone;
      if (tone && !allowedTones.includes(tone))
        errors.push(`style "${slug}" is tone "${tone}", but this theme only allows [${allowedTones.join(", ")}] ` +
          `(add "styleTones": ["${baseTone}", "${tone}"] to theme.json to allow the mix)`);
    }
  }

  if (language === "vi") {
    for (const slug of used) {
      const fonts = readProfile(root, slug)?.fonts || {};
      if (fonts.display && (fonts.latinOnly || []).includes(fonts.display))
        warnings.push(`style "${slug}" uses a latin-only display font ("${fonts.display}"): Vietnamese headlines will ` +
          `fall back to another font; pick a Vietnamese-safe style for vi videos`);
    }
  }
  return { errors, warnings, base, scenes: resolvedScenes, chip: !!styleCfg.chip };
}
