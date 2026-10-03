// Runs the multix CLI (npm @mrgoonie/multix) without a shell: node <multix bin> <args>.
// No shell means no quoting bugs with Vietnamese text or quotes on Windows.
// Success is judged by the expected output file, because multix on Windows can print a libuv
// assertion on exit and return a non-zero code after the file was written correctly.
import { execSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { providerEnv } from "./load-api-keys.mjs";

let entry;
function multixEntry() {
  if (entry) return entry;
  const npmRoot = execSync("npm root -g", { encoding: "utf8" }).trim(); // fixed command, no user input
  const pkgDir = join(npmRoot, "@mrgoonie", "multix");
  if (!existsSync(join(pkgDir, "package.json"))) {
    throw new Error("multix is not installed. Run: npm install -g @mrgoonie/multix");
  }
  const bin = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")).bin.multix;
  entry = join(pkgDir, bin);
  return entry;
}

/**
 * multix(["gemini", "generate-speech", ...], { output }) -> resolves with the log.
 * `output`: file that must exist (and be non-empty) afterwards. multix drops extra copies into
 * ./multix-output, so it runs in a temp dir to keep the project clean.
 */
export function multix(args, { output, cwd = join(tmpdir(), "agentvid-multix") } = {}) {
  mkdirSync(cwd, { recursive: true });
  if (output) mkdirSync(dirname(output), { recursive: true });
  return new Promise((ok, fail) => {
    const child = spawn(process.execPath, [multixEntry(), ...args.map(String)], { cwd, env: providerEnv() });
    let log = "";
    child.stdout.on("data", (d) => (log += d));
    child.stderr.on("data", (d) => (log += d));
    child.on("close", (code) => {
      const made = output ? existsSync(output) && statSync(output).size > 0 : code === 0;
      if (made) ok(log);
      else fail(new Error(`multix ${args.slice(0, 2).join(" ")} failed (exit ${code}):\n${log.slice(-800)}`));
    });
  });
}

/** Runs `fn` over `items` with at most `size` in flight. */
export async function pool(items, size, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: Math.min(size, queue.length) }, async () => {
    while (queue.length) await fn(queue.shift());
  }));
}
