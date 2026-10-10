// Location of the shared local-voice Python env (same one the AgentVid explainer skills use).
// Created once by scripts/setup-vieneu.py; override the base dir with AGENTVID_HOME.
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const agentvidHome = () => process.env.AGENTVID_HOME || join(homedir(), ".agentvid");

export function vieneuPython() {
  const env = join(agentvidHome(), "vieneu-env");
  const py = process.platform === "win32" ? join(env, "Scripts", "python.exe") : join(env, "bin", "python");
  if (!existsSync(py)) throw new Error("Local voice not installed: run  python scripts/setup-vieneu.py  once (~2-5 min, ~1.1 GB).");
  return py;
}
