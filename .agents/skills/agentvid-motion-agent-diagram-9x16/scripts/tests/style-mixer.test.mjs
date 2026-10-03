// Unit tests for the scene mixer (phase 3): style resolution/validation (check-style-mix.mjs) and the STYLE
// block injector (inject-timing.mjs). Run: node --test scripts/tests/style-mixer.test.mjs
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { checkStyleMix, resolveStyleSlug } from "../lib/check-style-mix.mjs";
import { injectIntoComposition } from "../lib/inject-timing.mjs";

function fakeProject(styles) {
  const root = mkdtempSync(join(tmpdir(), "style-mix-"));
  for (const [slug, profile] of Object.entries(styles)) {
    const dir = join(root, "styles", slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "profile.json"), JSON.stringify(profile));
  }
  return root;
}

const glass = { tone: "dark", fonts: { display: "Plus Jakarta Sans", body: "Be Vietnam Pro" }, aliases: ["keynote style"] };
const comic = { tone: "dark", fonts: { display: "Anton", body: "Be Vietnam Pro" }, aliases: ["comic hype"] };
const linen = { tone: "light", fonts: { display: "Cormorant Garamond", body: "Be Vietnam Pro" }, aliases: [] };
const morph = { tone: "dark", fonts: { display: "Playfair Display", body: "Playfair Display" }, aliases: [] };

test("resolveStyleSlug matches an installed folder or one of its aliases", () => {
  const root = fakeProject({ "glass-keynote": glass });
  assert.equal(resolveStyleSlug(root, "glass-keynote"), "glass-keynote");
  assert.equal(resolveStyleSlug(root, "keynote style"), "glass-keynote");
  assert.equal(resolveStyleSlug(root, "KEYNOTE STYLE"), "glass-keynote");
  assert.equal(resolveStyleSlug(root, "nope"), null);
  rmSync(root, { recursive: true, force: true });
});

test("a valid mix resolves base + per-scene overrides and reports no errors", () => {
  const root = fakeProject({ "glass-keynote": glass, "comic-halftone": comic });
  const scenes = [{ id: "s01" }, { id: "s02" }];
  const cfg = { base: "glass-keynote", scenes: { s02: "comic hype" }, chip: true };
  const out = checkStyleMix(cfg, { root, scenes, themeMeta: {} });
  assert.deepEqual(out.errors, []);
  assert.equal(out.base, "glass-keynote");
  assert.equal(out.scenes.s02, "comic-halftone");
  assert.equal(out.chip, true);
  rmSync(root, { recursive: true, force: true });
});

test("an unknown style is reported instead of silently falling back", () => {
  const root = fakeProject({ "glass-keynote": glass });
  const out = checkStyleMix({ base: "glass-keynote", scenes: { s01: "not-a-style" } }, { root, scenes: [{ id: "s01" }] });
  assert.ok(out.errors.some((e) => /unknown style "not-a-style"/.test(e)));
  rmSync(root, { recursive: true, force: true });
});

test("a style.json scene id with no matching voiced scene is reported", () => {
  const root = fakeProject({ "glass-keynote": glass });
  const out = checkStyleMix({ base: "glass-keynote", scenes: { "ghost-scene": "glass-keynote" } }, { root, scenes: [{ id: "s01" }] });
  assert.ok(out.errors.some((e) => /"ghost-scene" has no matching voiced scene/.test(e)));
  rmSync(root, { recursive: true, force: true });
});

test("more than 4 styles in the mix fails the gate with the exact message", () => {
  const styles = { a: comic, b: comic, c: comic, d: comic, e: comic };
  const root = fakeProject(Object.fromEntries(Object.keys(styles).map((k) => [k, { ...comic, aliases: [] }])));
  const cfg = { base: "a", scenes: { s1: "b", s2: "c", s3: "d", s4: "e" } };
  const scenes = ["s1", "s2", "s3", "s4"].map((id) => ({ id }));
  const out = checkStyleMix(cfg, { root, scenes });
  assert.deepEqual(out.errors, ["too many styles in the mix (5 > 4): a, b, c, d, e"]);
  rmSync(root, { recursive: true, force: true });
});

test("four styles pass (one display font each, at the 4-style cap); body-family spread only warns", () => {
  const root = fakeProject({ "glass-keynote": glass, "comic-halftone": comic, "linen-editorial": linen, "morph-minimal": morph });
  const cfg = { base: "glass-keynote", scenes: { s1: "comic-halftone", s2: "linen-editorial", s3: "morph-minimal" } };
  const scenes = ["s1", "s2", "s3"].map((id) => ({ id }));
  // linen-editorial is tone "light" against a dark base: needs an explicit opt-in, same as the tone-mix test below
  const out = checkStyleMix(cfg, { root, scenes, themeMeta: { styleTones: ["dark", "light"] } });
  assert.deepEqual(out.errors, []);
  assert.deepEqual(out.warnings, []); // Be Vietnam Pro + Playfair Display = 2 body families, at (not over) the cap
  rmSync(root, { recursive: true, force: true });
});

test("more than 2 body font families in the mix warns without failing the build", () => {
  const linenDistinctBody = { ...linen, fonts: { ...linen.fonts, body: "Literata" } };
  const root = fakeProject({ "glass-keynote": glass, "comic-halftone": comic, "linen-editorial": linenDistinctBody, "morph-minimal": morph });
  const cfg = { base: "glass-keynote", scenes: { s1: "comic-halftone", s2: "linen-editorial", s3: "morph-minimal" } };
  const scenes = ["s1", "s2", "s3"].map((id) => ({ id }));
  const out = checkStyleMix(cfg, { root, scenes, themeMeta: { styleTones: ["dark", "light"] } });
  assert.deepEqual(out.errors, []); // a warning, never an error: the build still succeeds
  assert.deepEqual(out.warnings, [
    "3 body font families in the mix (Be Vietnam Pro, Literata, Playfair Display): every one is loaded; prefer styles that share the base body font",
  ]);
  rmSync(root, { recursive: true, force: true });
});

test("a tone mismatch is rejected unless theme.json declares styleTones", () => {
  const root = fakeProject({ "glass-keynote": glass, "linen-editorial": linen });
  const cfg = { base: "glass-keynote", scenes: { s1: "linen-editorial" } };
  const scenes = [{ id: "s1" }];
  const rejected = checkStyleMix(cfg, { root, scenes, themeMeta: {} });
  assert.ok(rejected.errors.some((e) => /tone "light"/.test(e)));
  const allowed = checkStyleMix(cfg, { root, scenes, themeMeta: { styleTones: ["dark", "light"] } });
  assert.deepEqual(allowed.errors, []);
  rmSync(root, { recursive: true, force: true });
});

test("data/style.json is refused when the build has no styles/ folder at all", () => {
  const root = mkdtempSync(join(tmpdir(), "style-mix-none-"));
  const out = checkStyleMix({ base: "glass-keynote" }, { root, scenes: [] });
  assert.ok(out.errors.some((e) => /no styles\/ folder/.test(e)));
  rmSync(root, { recursive: true, force: true });
});

test("resolveStyleSlug never escapes styles/ (path traversal is rejected, not resolved)", () => {
  const root = fakeProject({ "glass-keynote": glass });
  // a real profile.json actually exists one level above styles/ — a traversal bug would find it
  writeFileSync(join(root, "profile.json"), JSON.stringify({ tone: "dark", fonts: {}, aliases: [] }));
  for (const traversal of ["../profile", "..\\profile", "../../etc/passwd", "styles/../glass-keynote"])
    assert.equal(resolveStyleSlug(root, traversal), null, traversal);
  rmSync(root, { recursive: true, force: true });
});

test("a corrupt profile.json is never accepted just because the folder exists", () => {
  const root = fakeProject({ "glass-keynote": glass });
  mkdirSync(join(root, "styles", "broken"), { recursive: true });
  writeFileSync(join(root, "styles", "broken", "profile.json"), "{ not valid json");
  assert.equal(resolveStyleSlug(root, "broken"), null);
  const out = checkStyleMix({ base: "broken" }, { root, scenes: [] });
  assert.ok(out.errors.some((e) => /unknown style "broken"/.test(e)));
  rmSync(root, { recursive: true, force: true });
});

test("injectIntoComposition inserts a fresh STYLE script when no marker exists, and leaves TIMING/BRAND untouched", () => {
  const root = mkdtempSync(join(tmpdir(), "inject-style-"));
  writeFileSync(join(root, "index.html"),
    "<html><body><div id=\"root\" data-duration=\"1\"></div>\n" +
    "<script>/*TIMING:BEGIN*/window.TIMING=null;/*TIMING:END*/</script>\n" +
    "<script>/*BRAND:BEGIN*/window.BRAND=null;/*BRAND:END*/</script>\n</body></html>");
  const timing = { duration: 42 };
  const brand = { name: "Test" };
  const style = { base: "glass-keynote", scenes: {}, chip: false };
  injectIntoComposition(root, { timing, brand, style });
  const html = readFileSync(join(root, "index.html"), "utf8");
  assert.match(html, /window\.TIMING=\{"duration":42\}/);
  assert.match(html, /window\.BRAND=\{"name":"Test"\}/);
  assert.match(html, /\/\*STYLE:BEGIN\*\/window\.STYLE=\{"base":"glass-keynote","scenes":\{\},"chip":false\};\/\*STYLE:END\*\//);
  assert.match(html, /<\/script>\s*<\/body>/);
  rmSync(root, { recursive: true, force: true });
});

test("injectIntoComposition never touches index.html's STYLE marker when style is not given (default projects)", () => {
  const root = mkdtempSync(join(tmpdir(), "inject-style-off-"));
  const original = "<html><body><div id=\"root\" data-duration=\"1\"></div>\n" +
    "<script>/*TIMING:BEGIN*/window.TIMING=null;/*TIMING:END*/</script>\n" +
    "<script>/*BRAND:BEGIN*/window.BRAND=null;/*BRAND:END*/</script>\n</body></html>";
  writeFileSync(join(root, "index.html"), original);
  injectIntoComposition(root, { timing: { duration: 1 }, brand: {} });
  const html = readFileSync(join(root, "index.html"), "utf8");
  assert.ok(!html.includes("STYLE"), "no STYLE text should appear when style is not passed");
  rmSync(root, { recursive: true, force: true });
});

test("removing data/style.json turns the mixer back off on rebuild (styled -> unstyled)", () => {
  const root = mkdtempSync(join(tmpdir(), "inject-style-toggle-"));
  writeFileSync(join(root, "index.html"),
    "<html><body><div id=\"root\" data-duration=\"1\"></div>\n" +
    "<script>/*TIMING:BEGIN*/window.TIMING=null;/*TIMING:END*/</script>\n" +
    "<script>/*BRAND:BEGIN*/window.BRAND=null;/*BRAND:END*/</script>\n</body></html>");
  const timing = { duration: 1 };
  const brand = {};
  // pass 1: data/style.json present -> STYLE injected
  injectIntoComposition(root, { timing, brand, style: { base: "glass-keynote", scenes: {}, chip: false } });
  assert.match(readFileSync(join(root, "index.html"), "utf8"), /window\.STYLE=\{"base":"glass-keynote"/);
  // pass 2: data/style.json removed (build-timeline.mjs passes style: null) -> STYLE must be cleared, not left stale
  injectIntoComposition(root, { timing, brand, style: null });
  const html = readFileSync(join(root, "index.html"), "utf8");
  assert.ok(!html.includes("STYLE"), `STYLE block should be fully removed after style.json is deleted, got:\n${html}`);
  assert.match(html, /window\.TIMING=\{"duration":1\}/); // TIMING/BRAND still intact
  rmSync(root, { recursive: true, force: true });
});

test("a latin-only display font warns only for Vietnamese videos", () => {
  const term = { tone: "dark", fonts: { display: "Share Tech Mono", body: "JetBrains Mono", latinOnly: ["Share Tech Mono"] }, aliases: [] };
  const root = fakeProject({ "glass-keynote": glass, "terminal-ops": term });
  const cfg = { base: "glass-keynote", scenes: { s1: "terminal-ops" } };
  const scenes = [{ id: "s1" }];
  assert.ok(checkStyleMix(cfg, { root, scenes, language: "vi" }).warnings.some((w) => /latin-only display font/.test(w)));
  assert.ok(!checkStyleMix(cfg, { root, scenes, language: "en" }).warnings.some((w) => /latin-only/.test(w)));
  rmSync(root, { recursive: true, force: true });
});
