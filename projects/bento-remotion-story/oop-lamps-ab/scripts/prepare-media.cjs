const fs = require('node:fs');
const path = require('node:path');
const project = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(project, 'project-data.json'), 'utf8'));
function localFile(src) {
  if (!src || path.isAbsolute(src) || src.split(/[\\/]/).includes('..') || /^[a-z]+:/i.test(src)) throw Error('Expected portable project asset: ' + src);
  const p = path.join(project, src);
  if (!fs.existsSync(p)) throw Error('Missing asset: ' + src);
}
for (const a of data.audio) localFile(a.src);
for (const a of [...(data.script.entities || []), ...(data.script.stickers || [])]) if (a.image) localFile(a.image);
fs.mkdirSync(path.join(project, 'public'), {recursive:true});
fs.cpSync(path.join(project, 'assets'), path.join(project, 'public/assets'), {recursive:true});
console.log('Portable assets prepared; audio clips:', data.audio.length);
