"""Validate the Ink script's text, layouts, local images and spoken reveal cues."""
import argparse
import json
import math
from pathlib import Path
import re
import unicodedata
import runpy


def tokens(value):
    return re.findall(r'[^\W_]+', unicodedata.normalize('NFC', str(value)).lower())


def validate(s, project=None):
    errors = []
    def fail(path, why): errors.append(f'{path}: {why}')
    def text(value, path):
        if not isinstance(value, str) or not value.strip(): fail(path, 'expected nonempty text')
    def cue(b, path, narration):
        if ('at' in b) == ('on' in b): fail(path, 'choose exactly one of on/at'); return
        if 'at' in b:
            at = b['at']
            if isinstance(at, bool) or not isinstance(at, (int, float)) or not math.isfinite(at) or at < 0: fail(path + '.at', 'expected finite nonnegative seconds')
        else:
            text(b['on'], path + '.on')
            needle, words = tokens(b['on']), tokens(narration)
            occurrence = b.get('occurrence', 1)
            if isinstance(occurrence, bool) or not isinstance(occurrence, int) or occurrence < 1: fail(path + '.occurrence', 'expected positive integer')
            elif not needle or sum(words[j:j+len(needle)] == needle for j in range(len(words)-len(needle)+1)) < occurrence: fail(path + '.on', 'phrase/occurrence absent from narration')
    def image_path(src, path):
        if not isinstance(src, str) or not src.startswith('assets/illustrations/') or '..' in Path(src).parts or '\\' in src: fail(path, 'use a local assets/illustrations/ path')
        elif project is not None and not (project / src).is_file(): fail(path, 'missing image')
    def diagram(b, path, narration):
        limits = {'row': (2,4), 'tree': (2,5), 'loop': (3,5), 'cards': (2,6)}
        kind=b.get('kind');text(b.get('label'),path+'.label')
        if kind not in limits: fail(path+'.kind','choose row/tree/loop/cards');return
        items=b.get('items');lo,hi=limits[kind]
        if not isinstance(items,list) or not lo<=len(items)<=hi: fail(path+'.items',f'expected {lo}–{hi} nodes');return
        ids=set()
        for i,item in enumerate(items):
            ip=f'{path}.items[{i}]'
            if not isinstance(item,dict): fail(ip,'expected object');continue
            ident=item.get('id');text(item.get('label'),ip+'.label')
            if not isinstance(ident,str) or not re.fullmatch(r'[a-z][a-z0-9-]*',ident) or ident in ids: fail(ip+'.id','expected unique lowercase identifier')
            else: ids.add(ident)
            if 'value' in item: text(item['value'],ip+'.value')
            if 'src' in item: image_path(item['src'],ip+'.src');text(item.get('alt'),ip+'.alt')
        events=b.get('events',[])
        if not isinstance(events,list): fail(path+'.events','expected list');return
        for i,e in enumerate(events):
            ep=f'{path}.events[{i}]'
            if not isinstance(e,dict): fail(ep,'expected object');continue
            action=e.get('action')
            if action not in ('focus','update','arrow','circle','strike','underline','clear'): fail(ep+'.action','unknown visual action')
            refs=('from','to') if action=='arrow' else ('target',)
            for ref in refs:
                if not isinstance(e.get(ref),str) or e[ref] not in ids: fail(ep+'.'+ref,'unknown node')
            if action=='arrow' and e.get('from')==e.get('to'): fail(ep,'arrow needs two different nodes')
            if action=='update': text(e.get('value'),ep+'.value')
            if 'hand' in e and not isinstance(e['hand'],bool): fail(ep+'.hand','expected boolean')
            if 'duration' in e:
                d=e['duration']
                if isinstance(d,bool) or not isinstance(d,(int,float)) or not math.isfinite(d) or not .18<=d<=2.4: fail(ep+'.duration','expected 0.18–2.4 seconds')
            cue(e,ep,narration)
    if not isinstance(s, dict): return ['script: expected object']
    if s.get('storyFormat') != 'ink-reasoning-v1': fail('storyFormat', 'expected ink-reasoning-v1')
    if s.get('language') not in ('vi', 'en', 'mixed'): fail('language', 'choose vi/en/mixed')
    for key in ('title', 'audience'): text(s.get(key), key)
    brief = s.get('story')
    if not isinstance(brief, dict): fail('story', 'expected question/example/takeaway')
    else:
        for key in ('question', 'example', 'takeaway'): text(brief.get(key), 'story.' + key)
    if 'handwriting' in s and not isinstance(s['handwriting'], bool): fail('handwriting', 'expected boolean')
    scenes = s.get('scenes')
    if not isinstance(scenes, list): fail('scenes', 'expected a list'); scenes = []
    sections = [('intro', s.get('intro'))] + [(f'scene-{i+1}', c) for i, c in enumerate(scenes)] + [('outro', s.get('outro'))]
    for sid, c in sections:
        if not isinstance(c, dict): fail(sid, 'expected object'); continue
        for key in ('title', 'vo'): text(c.get(key), sid + '.' + key)
        if 'handwriting' in c and not isinstance(c['handwriting'], bool): fail(sid + '.handwriting', 'expected boolean')
        if c.get('layout') not in ('statement', 'comparison', 'example', 'illustration', 'rule'): fail(sid, 'unknown layout')
        hold = c.get('hold', 0)
        if isinstance(hold, bool) or not isinstance(hold, (int, float)) or not math.isfinite(hold) or not 0 <= hold <= 6: fail(sid + '.hold', 'expected 0–6 seconds')
        elif hold > 0: text(c.get('readTask'), sid + '.readTask')
        blocks = c.get('blocks')
        if not isinstance(blocks, list) or not (0 if 'canvas' in s else 1) <= len(blocks) <= 4: fail(sid + '.blocks', 'expected 1–4 readable units'); continue
        for i, b in enumerate(blocks):
            bp = f'{sid}.blocks[{i}]'
            if not isinstance(b, dict): fail(bp, 'expected object'); continue
            if 'handwrite' in b and not isinstance(b['handwrite'], bool): fail(bp + '.handwrite', 'expected boolean')
            if b.get('type') not in ('text', 'note', 'code', 'result', 'image', 'diagram'): fail(bp, 'unknown block type')
            if b.get('type') == 'diagram':
                diagram(b,bp,c.get('vo',''))
            elif b.get('type') == 'image':
                text(b.get('alt'), bp + '.alt')
                src = b.get('src')
                if not isinstance(src, str) or not src.startswith('assets/illustrations/') or '..' in Path(src).parts or '\\' in src:
                    fail(bp + '.src', 'use a local assets/illustrations/ path')
                elif project is not None and not (project / src).is_file(): fail(bp + '.src', 'missing image')
            else: text(b.get('text'), bp + '.text')
            if 'emphasis' in b and b['emphasis'] not in ('red', 'yellow'): fail(bp + '.emphasis', 'choose red/yellow')
            cue(b,bp,c.get('vo',''))
    if 'canvas' in s:
        mapping={sid:c for sid,c in sections if isinstance(c,dict)}
        errors.extend(runpy.run_path(str(Path(__file__).with_name('validate-canvas.py')))['validate_canvas'](s['canvas'],mapping,cue,image_path))
    return errors


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--project', required=True, type=Path)
    a = p.parse_args()
    try: s = json.loads((a.project / 'script.json').read_text(encoding='utf-8-sig'))
    except (OSError, ValueError) as e: p.exit(1, str(e) + '\n')
    errors = validate(s, a.project)
    for error in errors: print('x', error)
    print('OK' if not errors else f'{len(errors)} problem(s)')
    p.exit(bool(errors))


if __name__ == '__main__': main()
