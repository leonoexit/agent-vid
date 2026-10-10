// Reads provider keys from local env files into a plain object for child processes and fetch calls.
// Keys never get printed or copied into the project. Lookup order (first hit per key wins):
//   process.env  >  $AGENTVID_KEYS_FILE  >  ~/.agentvid/keys.env  >  ~/.claude/ai-api-keys.env
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const KEY_FILES = [
  process.env.AGENTVID_KEYS_FILE,
  join(homedir(), ".agentvid", "keys.env"),
  join(homedir(), ".claude", "ai-api-keys.env"),
].filter(Boolean);

function parseEnvFile(file) {
  const out = {};
  for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(raw);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  return out;
}

let cached;
/** Merged environment: file values fill in whatever process.env does not already set. */
export function providerEnv() {
  if (cached) return cached;
  const merged = {};
  for (const file of [...KEY_FILES].reverse()) if (existsSync(file)) Object.assign(merged, parseEnvFile(file));
  cached = { ...merged, ...process.env };
  return cached;
}

/** Returns the key or throws a message that names the variable, never its value. */
export function requireKey(name) {
  const v = providerEnv()[name];
  if (!v) throw new Error(`${name} is not set. Add it to ~/.agentvid/keys.env (or ~/.claude/ai-api-keys.env).`);
  return v;
}
