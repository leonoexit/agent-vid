# Agent roster (roles by tier)

Skills name **roles**, never models. This file is the only place that maps a role to a model per runtime; update it
when models change (last update 2026-09-28; list Antigravity models with `agy models`). The skills run on Claude Code, Codex and Antigravity.

| Role | Does | Claude Code | Codex | Antigravity | Effort |
|---|---|---|---|---|---|
| **director** | taste and decisions: style choice, storyboard, still-frame gate, director notes, route | Opus 5.5 | Sol 5.6 (`gpt-5.6-sol`) | Gemini 3.1 Pro (`gemini-3.1-pro-high`) | high |
| **builder** | craft under a contract: scene HTML/GSAP, visual and motion observation | latest Sonnet (5, then 5.5) | Sol 5.6 | Gemini 3.8 Flash (`gemini-3.8-flash-high`) | medium (Flash: high) |
| **mechanic** | checkable chores: fill JSON from measurements, transcript, audio/beat, lint fixes, renders | Haiku 4.5 | smallest model available | Gemini 3.8 Flash (`gemini-3.8-flash-low`) | low |
| **escalation** | stuck after 2 rounds: engine, render, hard reasoning | Fable 5.1, Opus 5.5 | Astra 6 | call Claude / Codex | high |
| **verifier-logic** | challenge numbers, contracts, gates, route logic | Codex Sol 5.6 (cross-call) | Sol 5.6 in a separate session | call Codex | medium |
| **verifier-creative** | challenge taste, propose wider options | Opus 5.5 | call Claude | call Claude | high |

## Rules
- A verifier always runs on a **different model** from the author of the claim it checks (different vendor is better).
  Packets record `model`, and `merge-evidence-ledger.py` rejects same-model verdicts.
- Cross-runtime calls (Claude ↔ Codex ↔ Antigravity) pass the JSON contracts only, never the conversation.
- One level of workers, at most 5 at a time. The coordinator keeps merge decisions and user questions.
- **Lean mode** (`--lean`): one session, one model, same contracts and gates, self-review instead of a second model.
  It is the default when the runtime cannot spawn or call other models, and for public niche skills (style locked).
