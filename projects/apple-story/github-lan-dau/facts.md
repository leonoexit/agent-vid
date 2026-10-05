# Factual scope and production notes

## What the video claims
- GitHub is a website that stores projects online; signed in from another device, you can open the same files.
- A repository (repo) holds a project's files plus the history of committed changes.
- Creating a repo on the web: `+` (top right) → **New repository** → name → visibility (**Public**: anyone can see;
  **Private**: only you and people you invite — simplified on screen to "Chỉ bạn xem") → **Add README** → **Create repository**.
- Repo names are shown without diacritics/spaces (`banh-chuoi`); GitHub converts unsupported characters to hyphens.
- With Add README, GitHub creates `README.md` containing `# banh-chuoi` and records the first commit automatically
  (message "Initial commit").
- Editing on the web: pencil (Edit this file) → **Commit changes…** → commit message → **Commit changes**.
- A commit = one save of the files with a message, author and time. The **Commits** list shows newest first.
- Opening a commit shows its changes: removed lines red (`-`), added lines green (`+`).
- Later commits do not delete earlier ones; an earlier commit can be browsed to see the whole file at that point.
- Edits that were never committed have no entry in history.

## What it does not claim
- No Git CLI, branches, pull requests or collaboration. The browser screen is a simplified illustration (labelled
  on screen); GitHub's real layout differs in detail and changes over time (2025 new-repository redesign).
- "Bản cũ vẫn còn" refers to ordinary use; rewriting history (force-push) is out of scope for this audience.

## Pronunciation
Narration spells English UI words phonetically for the Vietnamese voice; `script.json.captionDisplay` maps them back
in captions: Ghít-hắp → GitHub, ri-pô → repo, ri-pô-di-tô-ri → repository, com-mít → commit, rít-mi → README,
Niu → New, Prai-vịt → Private, Pắp-lích → Public, Cri-ết → Create.

## QA notes
- Apple validator OK. `hyperframes check`: runtime clean, motion clean.
- Remaining layout flag: the opaque commit dialog intentionally covers the README card (modal) at ~60–64 s.
- Remaining contrast flag: white digits on the teal commit beads; zoomed frame shows them clearly legible
  (sampler averages the glossy highlight).
- The shared Bento `motion_audit.py` reads script.json events; this project's motions live in `story-engine.js`
  (events are empty), so that heuristic does not apply.
- Word timings are VieNeu estimates (no forced alignment) — not reviewed by ear.

Sources: GitHub Docs — Creating a new repository; Editing files; About commits; GitHub Changelog (2025)
"Improved repository creation experience".
