// A draft must visibly identify itself, not quietly export an inherited demo.
const path = require('path');
const assert = require('assert');
const pp = require(require.resolve('puppeteer-core', {paths: [process.cwd()]}));
(async () => {
  const browser = await pp.launch({executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true, args: ['--no-sandbox', '--allow-file-access-from-files']});
  try {
    const page = await browser.newPage(), errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failed.push(r.url()));
    await page.goto('file://' + path.resolve(process.argv[2]) + '/index.html');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(errors.length, 1);
    assert(errors[0].startsWith('CUTOUT_UNAUTHORED:'));
    assert.deepEqual(failed, []);
    assert.equal(await page.evaluate(() => Object.keys(window.__timelines).length), 0);
    assert((await page.$eval('#pages', e => e.textContent)).includes('AUTHORING DRAFT'));
    const geometry = await page.evaluate(() => {
      document.getElementById('pages').replaceChildren();
      const parent = document.getElementById('pages');
      const label = CutoutDesign.text(parent, 'label', 'Dữ liệu', 80, 200, 600);
      const image = CutoutDesign.img(parent, {src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="2"/%3E',
        alt: 'test', x: 100, y: 350, width: 300});
      return {labelLeft: label.style.left, imageHeight: image.style.height,
        helpers: Object.keys(CutoutDesign).sort()};
    });
    assert.deepEqual(geometry, {labelLeft: '80px', imageHeight: 'auto', helpers: ['arrow', 'box', 'img', 'plane', 'text']});
    console.log('PASS: draft notice, no inherited timeline, all local resources load, neutral design helpers');
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exit(1);});
