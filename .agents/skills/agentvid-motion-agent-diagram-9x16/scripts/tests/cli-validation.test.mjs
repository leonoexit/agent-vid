import assert from "node:assert/strict";
import test from "node:test";
import { parseSnapshotOptions } from "../lib/cli-validation.mjs";

test("snapshot options accept defaults and documented bounds", () => {
  assert.deepEqual(parseSnapshotOptions(null, null), { at: 0.85, cols: 4 });
  assert.deepEqual(parseSnapshotOptions("0", "1"), { at: 0, cols: 1 });
  assert.deepEqual(parseSnapshotOptions("1", "8"), { at: 1, cols: 8 });
});

test("snapshot options reject unsafe values before cleanup", () => {
  for (const cols of ["0", "-1", "1.5", "NaN", "Infinity"])
    assert.throws(() => parseSnapshotOptions("0.5", cols), /positive integer/);
  for (const at of ["-0.1", "1.1", "NaN", "Infinity"])
    assert.throws(() => parseSnapshotOptions(at, "4"), /finite number from 0 to 1/);
  assert.throws(() => parseSnapshotOptions("", "4"), /requires a value/);
  assert.throws(() => parseSnapshotOptions("0.5", ""), /requires a value/);
});
