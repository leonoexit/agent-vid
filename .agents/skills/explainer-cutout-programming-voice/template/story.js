/* Project-owned story. There is intentionally no default topic or layout. */
function buildCutout() {
  const root = document.getElementById('pages');
  Cutout.node('p', 'body', root,
    'AUTHORING DRAFT — write script.json and the shot score, sync narration, then implement this project’s story.js.',
    {padding: '100px', maxWidth: '1000px'});
  throw new Error('CUTOUT_UNAUTHORED: no story timeline exists yet. See storyboard.md and the skill runtime contract.');
  // Replace this function with the authored scene construction and paused GSAP timeline.
  // Use SCRIPT / PLAN from narration sync; Cutout.cue(section, planSection, key)
  // resolves phrase landmarks. Sections do not have to create separate pages.
  // Register __timelines['cutout-programming'] and extend it to PLAN.total.
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildCutout, {once: true});
else buildCutout();
