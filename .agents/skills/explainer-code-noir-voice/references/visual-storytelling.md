# Typography plus visual anchors

The design has two jobs: typography expresses the idea; a visual asset or spatial relationship makes it concrete. Neither must occupy a fixed region throughout the video. Vary the dominant subject when the explanation changes role.

## Score with the script

For each explanatory beat, write: spoken clause → visual anchor → visible-before → operation/focus → visible-after → time to read the consequence. Mark which words stay as headings or labels and which prose can be removed because the image now shows it. Assets can be native SVG, a compact diagram, an actual UI detail or a purposeful generated illustration. Choose one coherent visual language.

Useful roles:
- **Anchor:** an identifiable file, value, location marker or component carried through related scenes.
- **Explanation:** connectors, containment, branching or a state change reveal a relationship that text would otherwise describe at length.
- **Emphasis:** a large symbol or subject punctuates a conclusion already supported by evidence.
- **Illustration:** a well-mapped concrete subject/metaphor makes an abstract idea easier to hold in mind.

Do not meet this contract by adding a tiny icon beside every heading. Do not prescribe an asset count per video. A text-only beat is appropriate for a precise definition, prediction or conclusion, but a whole example should not automatically become a sequence of the same title-plus-lines page.

## Terminal case study: reusable lesson, specific implementation

The first 94-second trial was readable but repeated static text blocks. A useful alternative keeps a small filesystem model and a marker for the current directory. `pwd` identifies the marker, `ls` lists its children, `ls code` selects a branch, and `cd code` moves the marker. The same relative path then targets a different child. Empty space is now used to express relationship, not filled with extra prose.

For terminal versus shell, show input/output in a terminal frame and the shell as a labelled software participant. A connector shows which receives the command and which displays the result. This is a conceptual diagram, not a screenshot of a real OS architecture. Respect causal order and keep this distinction explicit.

## Review time, not only stills

Watch a few consecutive seconds around each important clause. Is the result already visible before its input? Is an animation merely replaying the same decoration? Does the voice introduce a new relationship while the picture remains unrelated? Recompose or change state where that mismatch exists. A static interval is useful when reading/comparing visible evidence; it is not automatically a defect.

Timestamps should reflect narration. Existing synthesized word estimates are only a starting point; inspect or listen near critical operations. Keep the explanatory state deterministic on backward seeks. Black background, monospace hierarchy and syntax accents remain constant while the model can change.
