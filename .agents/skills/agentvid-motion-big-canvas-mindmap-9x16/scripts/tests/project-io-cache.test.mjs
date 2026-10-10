import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { readCacheJson } from "../lib/project-io.mjs";

test("malformed optional cache JSON is a safe miss", () => {
  const root = mkdtempSync(join(tmpdir(), "agentvid-json-cache-"));
  mkdirSync(join(root, "data"));
  writeFileSync(join(root, "data", "manifest.json"), "{partial");
  assert.equal(readCacheJson(root, "data/manifest.json"), null);
  assert.deepEqual(readCacheJson(root, "data/missing.json", {}), {});
});
