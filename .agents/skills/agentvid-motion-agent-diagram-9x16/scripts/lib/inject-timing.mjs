// Writes window.TIMING and window.BRAND into index.html between their markers and syncs data-duration.
// The composition never hard-codes times or brand strings; it reads both globals.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function replaceBlock(html, name, value) {
  const re = new RegExp(`/\\*${name}:BEGIN\\*/[\\s\\S]*?/\\*${name}:END\\*/`);
  if (!re.test(html)) throw new Error(`index.html is missing the /*${name}:BEGIN*/ ... /*${name}:END*/ marker`);
  return html.replace(re, () => `/*${name}:BEGIN*/window.${name}=${JSON.stringify(value)};/*${name}:END*/`);
}

// STYLE (scene mixer, phase 3) has no marker in any theme's index.html: adding one to every theme would touch a
// file every default build ships, breaking the "default builds stay byte-identical" contract. Instead this block
// replaces an existing marker when a theme opts in, and otherwise inserts a fresh <script> itself — so a project
// without data/style.json (the default) never has its composition touched by this function at all.
// It must land right after /*BRAND:END*/ (always present, always first), never at the end of <body>: every theme
// builds its DOM from an inline <script> before </body>, so window.STYLE has to exist before that script runs.
function replaceOrInsertBlock(html, name, value) {
  const re = new RegExp(`/\\*${name}:BEGIN\\*/[\\s\\S]*?/\\*${name}:END\\*/`);
  const block = `/*${name}:BEGIN*/window.${name}=${JSON.stringify(value)};/*${name}:END*/`;
  if (re.test(html)) return html.replace(re, () => block);
  const brandEnd = /<\/script>/.exec(html.slice(html.indexOf("/*BRAND:END*/")));
  if (!/\/\*BRAND:END\*\//.test(html) || !brandEnd) throw new Error("index.html has no /*BRAND:END*/ script to insert /*STYLE*/ after");
  const at = html.indexOf("/*BRAND:END*/") + brandEnd.index + brandEnd[0].length;
  return `${html.slice(0, at)}\n<script>${block}</script>${html.slice(at)}`;
}

// Removing data/style.json must turn the mixer off, not just stop updating it: a project built once with a style
// then rebuilt without one must render exactly like it never had a style. If we self-inserted the whole <script>
// (every case today — no theme ships a native STYLE marker), drop that entire tag. If a future theme ever ships a
// native marker (shared script, can't be deleted), null the value out in place instead.
function clearBlock(html, name) {
  const markerRe = new RegExp(`/\\*${name}:BEGIN\\*/[\\s\\S]*?/\\*${name}:END\\*/`);
  if (!markerRe.test(html)) return html; // never had one: nothing to clear
  const soleScriptRe = new RegExp(`\\s*<script>(?:/\\*${name}:BEGIN\\*/[\\s\\S]*?/\\*${name}:END\\*/)</script>`);
  if (soleScriptRe.test(html)) return html.replace(soleScriptRe, "");
  return html.replace(markerRe, () => `/*${name}:BEGIN*/window.${name}=null;/*${name}:END*/`);
}

export function injectIntoComposition(root, { timing, brand, storyboard, style }) {
  const file = join(root, "index.html");
  let html = readFileSync(file, "utf8");
  html = replaceBlock(html, "TIMING", timing);
  html = replaceBlock(html, "BRAND", brand);
  // storyboard-driven themes carry a STORYBOARD marker; the smoke skeleton does not
  if (storyboard && html.includes("/*STORYBOARD:BEGIN*/")) html = replaceBlock(html, "STORYBOARD", storyboard);
  // style mixer: inserted (or updated) right after BRAND when data/style.json resolved, and actively cleared
  // when it did not (a rebuild after removing data/style.json must restore the unstyled default — see build-timeline.mjs)
  html = style ? replaceOrInsertBlock(html, "STYLE", style) : clearBlock(html, "STYLE");
  // HyperFrames Studio may add data-hf-id attributes, so match the id anywhere in the tag.
  html = html.replace(/(<div\b[^>]*?\bid="root"[^>]*?data-duration=")[\d.]+"/, `$1${timing.duration}"`);
  html = html.replace(/(<audio\b[^>]*?\bid="mix"[^>]*?data-duration=")[\d.]+"/, `$1${timing.duration}"`);
  writeFileSync(file, html);
}
