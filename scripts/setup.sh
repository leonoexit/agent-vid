#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
for tool in python3 node npm ffmpeg ffprobe magick espeak-ng; do
  command -v "$tool" >/dev/null || { echo "Missing $tool (macOS: brew install python@3.12 node ffmpeg imagemagick espeak-ng)"; exit 1; }
done
python3 -c 'import sys; assert sys.version_info[:2] == (3, 12), "Use Python 3.12 for the local voice dependencies"'
node -e 'if (Number(process.versions.node.split(".")[0]) < 22) throw Error("Node 22+ required")'
[[ -d .venv ]] || python3 -m venv .venv
source scripts/activate.sh
python -m pip install -r requirements/core.lock.txt
npm ci
npm install --global @mrgoonie/multix@0.7.0
hyperframes browser ensure
[[ -x "$AGENTVID_HOME/vieneu-env/bin/python" ]] || uv venv --python "$(command -v python3)" "$AGENTVID_HOME/vieneu-env"
uv pip sync --python "$AGENTVID_HOME/vieneu-env/bin/python" requirements/voice.lock.txt
python .agents/skills/explainer-ai-for-business-voice/scripts/setup-voice.py
python .agents/skills/agentvid-motion-agent-diagram-9x16/scripts/setup-vieneu.py --align
bash scripts/doctor.sh
