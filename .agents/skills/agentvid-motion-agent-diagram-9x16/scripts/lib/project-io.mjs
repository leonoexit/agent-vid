// Shared paths and JSON helpers for a motion project.
// Every CLI script lives in <project>/scripts/ and treats its parent directory as the project root.
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Project root of the calling script: <project>/scripts/<name>.mjs -> <project>. */
export const projectRoot = (metaUrl) => resolve(dirname(fileURLToPath(metaUrl)), "..");

export const readJson = (root, rel) => JSON.parse(readFileSync(join(root, rel), "utf8"));

/** Like readJson, but returns `fallback` when the file does not exist (optional data files). */
export const readJsonIf = (root, rel, fallback = null) => (existsSync(join(root, rel)) ? readJson(root, rel) : fallback);

/** Optional cache JSON: malformed content is a safe cache miss; filesystem errors still surface. */
export const readCacheJson = (root, rel, fallback = null) => {
  try {
    return readJsonIf(root, rel, fallback);
  } catch (error) {
    if (error instanceof SyntaxError) return fallback;
    throw error;
  }
};

export const writeJson = (root, rel, value, indent = 1) => {
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  const stage = join(dirname(file), `.${file.split(/[\\/]/).at(-1)}-${randomUUID()}.tmp`);
  try {
    writeFileSync(stage, JSON.stringify(value, null, indent));
    JSON.parse(readFileSync(stage, "utf8"));
    renameSync(stage, file);
  } finally {
    rmSync(stage, { force: true });
  }
  return file;
};

export const ensureDir = (dir) => (mkdirSync(dir, { recursive: true }), dir);

/** CLI flags: --force, --only=a,b and a positional mode. */
export const parseArgs = (argv = process.argv.slice(2)) => ({
  mode: argv.find((a) => !a.startsWith("--")),
  force: argv.includes("--force"),
  only: (argv.find((a) => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean),
  has: (flag) => argv.includes(flag),
  value: (name) => (argv.find((a) => a.startsWith(`--${name}=`)) || "").slice(name.length + 3) || null,
  rawValue: (name) => {
    const arg = argv.find((a) => a.startsWith(`--${name}=`));
    return arg === undefined ? undefined : arg.slice(name.length + 3);
  },
});

/** Spoken text of a script line: `say` (pronunciation hint) wins over the displayed `text`. */
export const spokenText = (line) => line.say || line.text;

/** Word tokens of a text: whitespace split, keeping only tokens that contain a letter or digit. */
export const wordTokens = (text) => text.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t));

/** Normalised lookup key of a word: lower case, punctuation stripped ("AgentVid:" -> "agentvid"). */
export const normWord = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");

export const round = (x, d = 3) => Math.round(x * 10 ** d) / 10 ** d;
