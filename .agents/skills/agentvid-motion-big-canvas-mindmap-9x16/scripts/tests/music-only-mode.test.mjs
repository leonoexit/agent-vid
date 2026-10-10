// theme.json "narration": "none" — new-project scaffolds a music-only project (no voice, no data/script.json),
// while a narrated theme without a voice for the language still fails before touching the disk.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scripts = join(dirname(fileURLToPath(import.meta.url)), "..");
const core = join(scripts, "..");

// A minimal built skill: theme.json, aspect.json, brand default, scripts/ and a template with one data example.
function fakeSkill(theme) {
  const dir = mkdtempSync(join(tmpdir(), "motion-music-only-"));
  cpSync(scripts, join(dir, "scripts"), { recursive: true, filter: (p) => !/[\\/]tests([\\/]|$)/.test(p) });
  writeFileSync(join(dir, "theme.json"), JSON.stringify(theme));
  // runs from kits/motion-kit/core (aspect/, brand/) and from a built skill (aspect.json, brand.default.json at its root)
  const pick = (...paths) => paths.find(existsSync);
  cpSync(pick(join(core, "aspect", "landscape-16x9.json"), join(core, "aspect.json")), join(dir, "aspect.json"));
  cpSync(pick(join(core, "brand", "brand.default.json"), join(core, "brand.default.json")), join(dir, "brand.default.json"));
  mkdirSync(join(dir, "template", "data"), { recursive: true });
  writeFileSync(join(dir, "template", "index.html"), '<div data-width="{{WIDTH}}" data-height="{{HEIGHT}}"></div>');
  writeFileSync(join(dir, "template", "data", "timeline-config.example.json"), JSON.stringify({ duration: 30, fps: 30 }));
  return dir;
}
const run = (skill, target, ...flags) =>
  spawnSync(process.execPath, [join(skill, "scripts", "new-project.mjs"), target, ...flags], { encoding: "utf8" });

test("music-only theme scaffolds without a voice or script.json", () => {
  const skill = fakeSkill({ narration: "none", defaultLanguage: "vi" });
  try {
    const target = join(skill, "project");
    const r = run(skill, target);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /music only \(no voice\)/);
    assert.ok(!existsSync(join(target, "data", "script.json")));
    assert.ok(existsSync(join(target, "data", "timeline-config.json")));
    const { width } = JSON.parse(readFileSync(join(skill, "aspect.json"), "utf8"));
    assert.match(readFileSync(join(target, "index.html"), "utf8"), new RegExp(`data-width="${width}"`));
  } finally {
    rmSync(skill, { recursive: true, force: true });
  }
});

test("narrated theme without a voice for the language still fails before writing", () => {
  const skill = fakeSkill({ defaultLanguage: "vi", voices: { en: { engine: "gemini", voice: "Orus" } } });
  try {
    const target = join(skill, "project");
    const r = run(skill, target);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /theme has no voice for language "vi"/);
    assert.ok(!existsSync(target));
  } finally {
    rmSync(skill, { recursive: true, force: true });
  }
});
