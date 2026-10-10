import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { checkStoryboard, validateStoryboard } from "../lib/check-storyboard.mjs";
import { estimateWordTimes } from "../lib/estimate-word-times.mjs";
import { matchScene } from "../lib/match-script-words.mjs";
import { normWord } from "../lib/project-io.mjs";

const themes = resolve(dirname(fileURLToPath(import.meta.url)), "../../../themes");
// These checks read the theme sources in kits/motion-kit/themes, so a built or packaged skill skips them.
const farmPath = join(themes, "farm-market-9x16/theme.json");
const kitOnly = { skip: existsSync(farmPath) ? false : "repo-only: needs kits/motion-kit/themes" };
const farm = kitOnly.skip ? null : JSON.parse(readFileSync(farmPath));
const voiced = (ids) => ids.map((id) => ({ id, start: 0, end: 4, lines: [{ words: [["spoken", "spoken", 1, 2]] }] }));

test("malformed boards fail while unspoken anchors remain warnings", kitOnly, () => {
  const root = mkdtempSync(join(tmpdir(), "motion-board-"));
  try {
    mkdirSync(join(root, "assets"));
    writeFileSync(join(root, "assets/photo.jpg"), "local existing asset");
    const valid = { id: "s", type: "photo", photos: [{ src: "assets/photo.jpg", at: "unspoken" }], transition: "lift" };
    assert.deepEqual(validateStoryboard({ scenes: [valid] }, voiced(["s"]), { root, theme: farm }).errors, []);
    assert.match(checkStoryboard({ scenes: [valid] }, voiced(["s"]), farm.sceneTypes, { root, theme: farm })[0], /not spoken/);
    for (const spec of [
      { ...valid, photos: [] }, { ...valid, photos: [{ src: "assets/missing.jpg" }] },
      { ...valid, photos: [{ src: "../photo.jpg" }] }, { ...valid, photos: [{ src: "https://site/img.jpg" }] },
      { ...valid, photos: [{ src: "C:/photo.jpg" }] }, { ...valid, type: "typo" },
      { ...valid, transition: "typo" }, { ...valid, transition: "zoom" },
      { ...valid, type: "illus", src: "assets/photo.jpg" },
      { ...valid, photos: [{ src: "assets/photo.jpg", at: -1 }] },
      { ...valid, photos: [{ src: "assets/photo.jpg", at: { word: "spoken", nth: -1 } }] },
    ]) assert.throws(() => checkStoryboard({ scenes: [spec] }, voiced(["s"]), farm.sceneTypes, { root, theme: farm }), /Invalid storyboard/);
    assert.throws(() => checkStoryboard({ scenes: [valid, valid] }, voiced(["s"]), farm.sceneTypes, { root, theme: farm }), /duplicate/);
    assert.throws(() => checkStoryboard({ scenes: [] }, []), /nonempty/);
    assert.throws(() => checkStoryboard({ scenes: [valid] }, voiced(["s", "s2"]), farm.sceneTypes), /no storyboard/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("shipped storyboard examples across motion themes satisfy their own scene contracts", kitOnly, () => {
  let boards = 0;
  for (const name of readdirSync(themes).filter((n) => !n.startsWith("_") && n !== "profile-intro-16x9")) {
    const meta = JSON.parse(readFileSync(join(themes, name, "theme.json")));
    if (meta.base) {
      const base = JSON.parse(readFileSync(join(themes, meta.base, "theme.json")));
      meta.sceneTypes ||= base.sceneTypes;
    }
    const ownData = join(themes, name, "template/data");
    const data = existsSync(ownData) ? ownData : join(themes, meta.base, "template/data");
    for (const file of readdirSync(data).filter((n) => n.startsWith("storyboard.") && n.endsWith(".json"))) {
      const board = JSON.parse(readFileSync(join(data, file)));
      const script = JSON.parse(readFileSync(join(data, file.replace("storyboard.", "script."))));
      // Use the shipped script through the production estimate/matcher, with a two-second scene tail.
      // A one-word placeholder cannot exercise offset anchors that require their actual spoken occurrence.
      const scheduled = script.scenes.map((scene) => {
        const said = scene.lines.map((line) => line.say || line.text).join(" ");
        const { lines } = matchScene(scene, estimateWordTimes(said, 10, []), 10);
        return { id: scene.id, start: 0, end: 12, lines: lines.map((line) => ({
          words: line.words.map((word) => [normWord(word.t), word.t, word.s, word.e]),
        })) };
      });
      const { errors } = validateStoryboard(board, scheduled, { theme: meta });
      assert.deepEqual(errors, [], `${name}/${file}: ${errors.join(", ")}`);
      boards++;
    }
  }
  assert.ok(boards >= 15, `checked ${boards} examples`);
});

test("word anchors reject malformed leaves and resolved times outside the scene", kitOnly, () => {
  const scene = { id: "s", start: 10, end: 14, lines: [{ words: [["spoken", "spoken", 11, 12], ["spoken", "spoken", 13, 13.5]] }] };
  const check = (at) => validateStoryboard({ scenes: [{ id: "s", type: "photo", photos: [{ src: "assets/photo.jpg", at }] }] }, [scene], { theme: farm });
  for (const at of [
    { word: "spoken", plus: -100 }, { word: "spoken", plus: 100 }, { beat: 2 },
    { word: "spoken", nth: false }, { word: "spoken", nth: null }, { word: "spoken", nth: "2" },
    { word: "spoken", nth: 0 }, { word: "spoken", nth: 1.5 }, { word: "spoken", plus: null },
    { word: "spoken", plus: "1" }, { word: "spoken", beat: 2 }, { plus: 1 }, {}, "spoken#2#3",
    { word: "missing", plus: -100 }, { word: "missing", plus: 100 }, { bogus: 2 }, [2],
  ]) assert.ok(check(at).errors.length, `accepted invalid anchor ${JSON.stringify(at)}`);
  for (const at of [0, 4, "spoken", "spoken#2", { word: "spoken", plus: -1 }, { word: "spoken", nth: 2, plus: 1 }])
    assert.deepEqual(check(at).errors, [], JSON.stringify(at));
  const missing = check({ word: "missing", nth: 2, plus: 0 });
  assert.deepEqual(missing.errors, []);
  assert.match(missing.warnings[0], /not spoken/);
  const nested = validateStoryboard({ scenes: [{ id: "s", type: "feature", widget: { kind: "bundle", at: { panel: "spoken", items: ["spoken", { word: "spoken", nth: 2, plus: -0.1 }] } } }] },
    [scene], { theme: { sceneTypes: ["feature", "journey"] } });
  assert.deepEqual(nested.errors, []);
});

test("unresolved word offsets fail independently of the renderer's fallback", kitOnly, () => {
  const scene = { id: "s", start: 10, end: 14, lines: [{ words: [["spoken", "spoken", 11, 12]] }] };
  const check = (at) => validateStoryboard({ scenes: [{ id: "s", type: "photo", photos: [
    { src: "assets/first.jpg" }, { src: "assets/second.jpg", at },
  ] }] }, [scene], { theme: farm });
  // Farm's second photo fallback is start + 2: +3 is too late, -1 would fit, but both require a real word.
  for (const plus of [3, -1, 0.8, -0.001]) {
    const result = check({ word: "missing", plus });
    assert.match(result.errors.join(" "), /nonzero plus requires a spoken word anchor/);
    assert.equal(result.warnings.length, 1);
  }
  for (const at of ["missing", { word: "missing" }, { word: "missing", plus: 0 }]) {
    const result = check(at);
    assert.deepEqual(result.errors, []);
    assert.equal(result.warnings.length, 1);
  }
  assert.deepEqual(check({ word: "spoken", plus: -1 }).errors, []);
  assert.deepEqual(check({ word: "spoken", plus: 3 }).errors, []);
  assert.match(check({ word: "spoken", nth: 2, plus: 1 }).errors.join(" "), /nonzero plus requires/);
});
