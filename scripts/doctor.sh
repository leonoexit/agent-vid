#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/activate.sh
for tool in python node npm ffmpeg ffprobe magick espeak-ng hyperframes multix; do
  command -v "$tool" >/dev/null || { echo "Missing: $tool"; exit 1; }
done
python -c 'import numpy, scipy, PIL; print("Python image/audio dependencies: ready")'
"$AGENTVID_HOME/vieneu-env/bin/python" -c 'import vieneu, kokoro_onnx, soundfile, faster_whisper; print("Local voice and alignment imports: ready")'
python .agents/skills/explainer-ai-for-business-voice/scripts/setup-voice.py --check
python .agents/skills/agentvid-motion-agent-diagram-9x16/scripts/setup-vieneu.py --check --align
hyperframes --version
multix --version
echo 'AgentVid environment: ready'
