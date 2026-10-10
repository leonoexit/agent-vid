// Real DOM + bundled GSAP regression, with no render or network request.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");
const chrome = [process.env.CHROME_PATH, "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe", "/usr/bin/chromium", "/usr/bin/google-chrome"].filter(Boolean).find(existsSync);
const gsapPath = process.env.GSAP_PATH || join(repo, "kits/product-feature-highlight-editor/editor/runs/fixture/hyperframes/assets/gsap.min.js");

test("second farm photo stays hidden until its anchor and restores on backward seeks", {
  skip: !chrome || !existsSync(gsapPath) ? "Set CHROME_PATH and GSAP_PATH for the real DOM regression" : false,
}, () => {
  const dir = mkdtempSync(join(tmpdir(), "farm-reveal-"));
  try {
    const farm = readFileSync(join(repo, "kits/motion-kit/themes/farm-market-9x16/template/scenes/farm-scenes.js"), "utf8");
    const gsap = readFileSync(gsapPath, "utf8");
    const html = `<!doctype html><style>.rv {opacity:0;visibility:hidden}</style><div id="scene"></div><pre id="result"></pre>
<script>${gsap}</script><script>
const renderers = {};
window.IK = {esc: s => s || '', stroke: () => '', TICK: '', header: () => {}, itemAt: () => 0,
  h: (tag, cls, content, parent) => { const el = document.createElement(tag); el.className=cls; el.innerHTML=content || ''; parent.append(el); return el; }};
window.MotionKit = {registerScene: (type, fn) => renderers[type]=fn, richText: s => s || ''};
</script><script>${farm}</script><script>
try {
  const tl=gsap.timeline({paused:true});
  renderers.photo(document.getElementById('scene'), {photos:[{src:'first.jpg'},{src:'second.jpg',at:'spoken'}]},
    {kit:{tl,pop:()=>{}},start:4,end:12,at:()=>8});
  const imgs=document.querySelectorAll('.photo-frame img');
  const initial=getComputedStyle(imgs[1]).opacity;
  const samples=[0,4,7.99,8.01,8.5,11,4,0,11,7.99].map(time => {
    tl.seek(time, false); return {time,first:Number(getComputedStyle(imgs[0]).opacity),second:Number(getComputedStyle(imgs[1]).opacity)};
  });
  document.getElementById('result').textContent=JSON.stringify({initial,samples});
  gsap.ticker.sleep();
} catch (e) { document.getElementById('result').textContent=JSON.stringify({error:String(e)}); }
</script>`;
    const file = join(dir, "test.html");
    writeFileSync(file, html);
    const out = spawnSync(chrome, ["--headless", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
      `--user-data-dir=${join(dir, "browser")}`, "--allow-file-access-from-files", "--dump-dom", pathToFileURL(file).href], {encoding:"utf8",timeout:30000,maxBuffer:2**20});
    assert.equal(out.status, 0, out.stderr || String(out.error));
    const result = JSON.parse(/<pre id="result">([^<]*)<\/pre>/.exec(out.stdout)?.[1] || '{}');
    assert.equal(result.error, undefined);
    assert.equal(result.initial, "0");
    assert.equal(result.samples.length, 10);
    for (const row of result.samples) {
      assert.equal(row.first, 1);
      if (row.time < 8) assert.equal(row.second, 0, JSON.stringify(row));
      else if (row.time >= 8.5) assert.equal(row.second, 1, JSON.stringify(row));
      else assert.ok(row.second > 0 && row.second < 1, JSON.stringify(row));
    }
  } finally { rmSync(dir, { recursive:true,force:true }); }
});
