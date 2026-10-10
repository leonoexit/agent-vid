# Source this file in bash or zsh: source scripts/activate.sh
if [ -n "${ZSH_VERSION:-}" ]; then
  _agentvid_source="${(%):-%N}"
else
  _agentvid_source="${BASH_SOURCE[0]}"
fi
_agentvid_root="$(cd "$(dirname "$_agentvid_source")/.." && pwd)"
export AGENTVID_HOME="$_agentvid_root/.runtime/agentvid"
export HF_HOME="$_agentvid_root/.cache/huggingface"
export PIP_CACHE_DIR="$_agentvid_root/.cache/pip"
export UV_CACHE_DIR="$_agentvid_root/.cache/uv"
export npm_config_cache="$_agentvid_root/.cache/npm"
# The bundled multix resolver uses npm root -g; keep that prefix local.
export npm_config_prefix="$_agentvid_root/.runtime/npm"
export REELCREW_HOME="$_agentvid_root/.runtime/reelcrew"
export REELCREW_SKILLS_DIR="$_agentvid_root/.agents/skills"
export PATH="$_agentvid_root/node_modules/.bin:$REELCREW_HOME/bin:$npm_config_prefix/bin:$PATH"
export HYPERFRAMES_NO_TELEMETRY=1
export HYPERFRAMES_FONT_CACHE_DIR="$_agentvid_root/.cache/hyperframes/fonts"
export HYPERFRAMES_EXTRACT_CACHE_DIR="$_agentvid_root/.cache/hyperframes/frames"
export PYTHONIOENCODING=utf-8
export HF_HUB_DISABLE_SYMLINKS_WARNING=1
source "$_agentvid_root/.venv/bin/activate"
unset _agentvid_root _agentvid_source
