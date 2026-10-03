# New C pointer demo — glass story

Audience: hobby learners with basic logic, no professional programming assumptions. Language: Vietnamese.
Voice: Thái Sơn (preset label: male, Southern, storytelling), pitch-preserving speed 0.88. Paragraph gap 0.9 s;
scene holds 0.8–2 s in addition to the default 1.6 s after narration. No music bed for this demo.

Art direction: user's batch_01 Dream State reference, adapted from a square carousel to vertical video.
Entities retain identity: x starts as a box, p as an address ticket, read as a separate result display.

| Beat | Learning goal | Visual operation | State carried forward |
| --- | --- | --- | --- |
| Intro | One clear pointer idea, then a familiar example | Address and data hero tiles | Introduce vocabulary without syntax |
| 1 | A container holds data | Box enters; lid lifts to expose 10 | Box has 10 |
| 2 | Location differs from stored data | Symbolic Ô A address chip appears below the value | 10 and address stay separate |
| 3 | Pointer keeps location, not copied data | A visible Ô A token travels from box address to ticket, then p→x relation draws | x=10, ticket holds Ô A |
| 4 | Analogy maps to C names | Same box/ticket settle into x/p cards; Ô A becomes symbolic &x | x=10, p=&x |
| 5 | Two declaration lines establish the model | Code panel reveals/highlights one line at a time | x=10, p=&x |
| 6 | Dereferencing reads the targeted data | Trace p→x, copy visible 10 into a separate *p reading | x remains 10, p remains &x |
| 7 | Assignment through p updates x | Highlight *p=20; orange 20 travels into x and commits there | x=20, p remains &x |
| 8 | Predict a similar update | Show *p=30, pause after the question, reveal/update 30 with the answer | x=30, p remains &x |
| Outro | A simple recap and valid-access boundary | Clean two-tile recap, finished model/code removed | p stores an address; *p accesses data |

Important operation times in the synced plan: address copy 52.762 s; reading 116.941 s; write 132.774 s;
practice answer 154.103 s. A transfer commits after 1.05 s. These phrase cues use estimated word timings.
Browser tests cover start/middle/end and reverse seeks. Rendered MP4 frames at 53.262 s and 133.274 s confirm
that the address/data token is visible in transit; destination values remain unchanged until arrival.
