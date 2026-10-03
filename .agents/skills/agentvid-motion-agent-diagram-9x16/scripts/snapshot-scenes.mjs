// Snapshots every scene at ~85% of its window (when its reveals are done) and tiles them into
// renders/contact-sheet.jpg for review. Needs data/timeline.json (run build-timeline first).
// Usage: node scripts/snapshot-scenes.mjs [--at=0.85] [--cols=4]
import { execFileSync, execSync } from "node:child_process";
import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { providerEnv } from "./lib/load-api-keys.mjs";
import { parseSnapshotOptions } from "./lib/cli-validation.mjs";
import { ensureDir, parseArgs, projectRoot, readJson } from "./lib/project-io.mjs";

const HYPERFRAMES = "hyperframes@0.8.75";
const root = projectRoot(import.meta.url);
const args = parseArgs();
const { at: frac, cols } = parseSnapshotOptions(args.rawValue("at"), args.rawValue("cols"));
const { scenes } = readJson(root, "data/timeline.json");
const times = Object.values(scenes).map((s) => (s.start + (s.end - s.start) * frac).toFixed(2));

const dir = join(root, "snapshots");
rmSync(dir, { recursive: true, force: true });
execSync(`npx --yes ${HYPERFRAMES} snapshot --at ${times.join(",")}`, { cwd: root, stdio: "inherit", env: providerEnv() }); // numeric args only

const shots = readdirSync(dir).filter((f) => /^frame-.*\.png$/.test(f)).sort().slice(0, times.length).map((f) => join(dir, f));
const out = join(ensureDir(join(root, "renders")), "contact-sheet.jpg");
// Tiled with plain append, not `magick montage`: montage loads a default font even without labels and fails on
// machines where ImageMagick has no font configured (seen on macOS). Thumbnails 640 px wide, 6 px dark gutter.
const rows = [];
for (let i = 0; i < shots.length; i += cols) rows.push("(", ...shots.slice(i, i + cols), "-resize", "640x", "-bordercolor", "#111", "-border", "6", "+append", ")");
execFileSync("magick", [...rows, "-background", "#111", "-append", "-quality", "88", out]);
console.log(`contact sheet (${shots.length} scenes at ${times.join(", ")} s) -> ${out}`);
