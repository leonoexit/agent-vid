# Facebook video cover, included by default

After the new video is rendered and reviewed, create a dedicated cover for that video's actual concept and audience. This completes the video package; do not wait for another cover request. This is a local thumbnail deliverable, not a Page cover/banner or authorization to upload/publish. A revision of an existing video needs a refreshed cover when its headline, topic or visual identity changes; otherwise reuse its approved cover.

Use 1080×1920 portrait PNG and high-quality JPG as this skill's default master, matching its video. This is our output convention, not a claim about a universal Facebook requirement. If the user specifies a placement/size, follow it; verify current platform requirements if promising upload compatibility. The default exporter also makes center-square and 4:5 crop previews to reveal fragile compositions. These previews do not guarantee how every Facebook surface crops; recompose an additional version if a requested placement requires it.

Choose a concise Vietnamese headline that poses the video's actual question or benefit, usually 4–9 words as a starting point. Keep one dominant hero or one clear relationship from the finished video, preserve identity colors and material/light, and at most a short supporting label if needed. A cover is not the full lesson, a list of chapters or an arbitrary mid-animation screenshot. Avoid tiny code, subtitle bands, fabricated metrics, exaggerated claims, fake player controls and required branding/CTA. Use native text for exact words and reuse approved assets first. Use imagegen only if a missing subject benefits from generated art, following that skill and keeping title text separate.

Adapt `assets/cover-template.html` into `<project>/cover/cover.html`, copy required helper/font files beside it or update paths to project assets. Its example title and three-node history are illustrative, not mandatory content. Match the actual video. Keep the main headline and hero near the central area; the template starts important content within y=440–1450 so a center-square crop can retain it. Do not force cramped layouts just to satisfy hypothetical crops. Preview both full portrait and crops at phone size, and make intentional alternatives if needed.

From the repository root (where puppeteer-core is installed):

```sh
node <apple-skill>/scripts/export-cover.cjs <project>/cover/cover.html <project>/cover/cover-<slug>
```

Needs the existing local Chrome; `CHROME_PATH` may select a different installed executable. The exporter waits for local fonts/images, checks marked title/hero bounds and text overflow, and saves `*-1080x1920.png`, `*-1080x1920.jpg`, `*-crop-square.jpg`, `*-crop-4x5.jpg`. PNG/JPG are final deliverables; crop files are review aids. Inspect them visually: geometry checks cannot judge a headline's clarity, contrast, crop quality or resemblance to the video. Mark critical text/hero wrappers with `data-cover-critical`; a wrapper should bound visible content, not the whole canvas. Do not add these marks to intended full-bleed decoration.

Deliver links/previews for the MP4 and portrait cover, with editable HTML available. Disclose if the video or cover wasn't visually reviewed. For a skill-only update, validate the template without generating another narrated video.
