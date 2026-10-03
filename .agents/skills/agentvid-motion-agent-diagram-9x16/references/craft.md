# Craft: motion vocabulary shared by every style

A style's `choreography.md` overrides these defaults for its own look. Everything here is seek-safe GSAP on the
kit's single paused timeline.

## Director notes → parameters
| Note | Parameter change |
|---|---|
| "slower ×N" / "faster ×N" | duration × N / ÷ N (keep the start time on its anchor) |
| "push in" | wrapper scale 1.00 → 1.06–1.12 over the whole shot, `power2.out` (or `none` for a drift) |
| "pull out" | scale 1.10 → 1.00, `power2.inOut` |
| "whip" | 0.25–0.35 s, x ±100% of the frame, `power4.in` out / `expo.out` in, the cut hidden inside the blur |
| "slam" | from scale 1.6–2.2 + opacity 0 to 1 in 0.12–0.18 s, `expo.out`, 2–4 frame overshoot, SFX hit on the same frame |
| "on beat" / "on the word" | snap the start to the beat grid / the word's aligned start (never eyeball) |
| "hold" | no motion for ≥ 0.8 s so the viewer can read (text ≥ 0.25 s per word on screen) |
| "breathe" | insert a 1.5–2.5 s calmer shot, often a tone reversal (dark ↔ light) |
| "stagger" | 0.04–0.08 s between siblings, reading order |

## Easing vocabulary
- **snap** (default entrance): `expo.out`, `power4.out`
- **exit**: `power4.in`, `expo.in` (fastest just before the cut)
- **mechanical slide** (panels, splits, wipes): `expo.inOut`
- **pop** (chips, UI, icons; keep it rare): `back.out(1.7)`
- **drift** (slow push, scroll): `none`
- **step** (typing, flicker, pixel looks): `steps(n)` or instant `set`

## Pacing curve (share of runtime)
| Stage | % | Typical shot |
|---|---|---|
| open | 0–20 | 1.5–3 s, hook lands in the first 3 s |
| build | 20–45 | 1–2 s, key words, first transforms |
| accelerate | 45–65 | 0.4–1 s, cuts on beats |
| breather | 65–80 | 1.5–2.5 s, tone shift |
| climax → lockup | 80–100 | fast hits, then a ≥ 1.5 s hold on the CTA |

## Typography
- The main word fills 85–95% of the frame width (fit to width, never a fixed px size for hero words).
- One family per role; contrast by extremes (hero words huge, labels 12–16 px mono equivalents).
- Vietnamese text only in fonts with full diacritics; `latinOnly` families only for Latin words.
- Keep a motif alive across cuts (a signature, a chip, a dot, a colour) so the style changes but the video stays one.

## Style mixing
- ≤ 4 styles per video (each style carries one display font, so the mix never has more than 4 display faces
  either — there is no separate cap to hit); captions and the brand signature follow the `base` style. Prefer
  styles whose body font matches the base: past 2 body families in the mix the checker warns (build still
  succeeds; every extra family is still bundled and loaded).
- Change style on a cut or a carrier (wipe, flash, colour block) that belongs to the incoming style.
- A dark → dark change needs a visible carrier; viewers miss a change of shade.
