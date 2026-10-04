# Text, color and icons on a dark canvas

## Observed patterns

The entire source set uses changes in weight, scale and placement before decoration. In 01/alt, a giant bare title
contains one terracotta phrase. Slide 02 separates rejected/established claims with different left rails and a
strike-through. 03/06/09 put exact identifiers in inline highlights or technical insets. 08 distinguishes roles
with top bars; 10 uses matching icon discs and panel edge colors. 11 marks the active row with an edge/number.
16 projects Q badges outside the panel; 17 makes the result much larger than its supporting explanation. 18 uses
short highlighted phrases inside a connected sentence. These observations inform the primitives below.

## Three separate color jobs

1. **Identity:** an entity's label and subtle edge tint, retained when it moves. Use terracotta/pale violet or blue
   where useful; don't rainbow-color every new shot. Initial `tone` selects an identity accent/dark tint.
2. **State:** success/error/unknown has text or an icon as well as green/red/neutral. A green identity isn't proof of
   success; label the actual state separately. Never recolor a source object just because it became active.
3. **Operation focus:** one rail, code line, source word or moving token gets the current accent. A second glow,
   bright caption and huge icon competing for focus should be reduced. Karaoke stays in its reserved band.

Default canvas #050505, reading panel #141417, light text #E2E8F0, muted #94A3B8, primary #D97757.
Deep violet #7C3AED is decoration/surface; readable violet #C4B5FD is text. Green #86EFAC, red #FCA5A5 and
blue #93C5FD are readable accents on dark fields. They do not authorize colored text on an arbitrary light panel.

## Implemented primitives

`theme.css` imports `emphasis.css` and `compositions.css`. These operate on project-authored native DOM:
- `.noir-accent`: decisive short phrase or entity-linked name, using --noir-accent.
- `.noir-mark`: translucent neutral highlight with a thin accent underline; reveal at the spoken clause.
- `.noir-tag`: compact type/identity/state pill; no large badge on every phrase.
- `.noir-icon`: local inline SVG scaled by --noir-icon-size (default 88px), fill inherits currentColor.
- `.noir-surface-dark` / `.noir-surface-light`: explicit local foreground context. Light context darkens accent.
- `.noir-section-line`, terminal chrome, role top-bars, active rails and projecting question badge: compositions.css.

JSON titles, labels, notes and subtitles stay plain text; HTML in JSON is not supported. To animate an inline
phrase, make real spans with stable selectors in the project's renderer and add reversible timeline cues.
Do not claim accent markup is a rich-text schema feature.

## Type hierarchy and icons

Space Grotesk 700 carries titles, large outcome numbers and statement emphasis. Inter carries prose; JetBrains
Mono carries code, exact values, short technical tags and counters. Keep headings 1–2 readable lines, preserve
Vietnamese diacritics and avoid source line-height .8 for production. Full local fonts load with font-display:block.
Check pixels after fonts are ready; font-family names alone don't prove correct glyph coverage.

The source mixes FA solid, regular, brand icons and one emoji. Production standardizes on the inherited local FA
Free Solid 6.4.0 subset (16 files plus manifest/license). Use local SVG geometry; role icon 64–96px, optional primary
icon 120–160px, small inline icon about one line-height. Couple with a short label; icons do not replace exact
states. A helper's selection of a name doesn't load an arbitrary icon outside the subset. Add licensed local SVG
and its URL/hash when a new role genuinely needs one; don't silently substitute a different semantic icon.

## Contrast and state review

Check actual rendered text against its settled background, including nested tints/glow. Aim ≥4.5:1 for all needed
text even if large. Check body, code, active line, caption highlight, role tags, results and rare light panes.
A source .4 opacity or inherited transparent panel can fail; raise foreground/surface opacity instead of claiming
reference fidelity requires unreadable text. Source deep violet on black and dim inactive rail text are known
adaptation points. Decorations need no text contrast claim. Settled samples aren't certification of every fade frame.

Inspect deferred spans before/after cue and on reverse seek. Ancestor display:none prevents explicitly visible
children escaping inactive scenes. A change from gray to accent or a pulse counts as attention, not a model operation.
