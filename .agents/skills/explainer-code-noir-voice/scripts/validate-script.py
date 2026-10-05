"""Validate the Code Noir script's text, layouts, syntax spans and spoken reveal cues."""
import argparse
import json
import math
from pathlib import Path
import re
import unicodedata


def tokens(value):
    return re.findall(r'[^\W_]+', unicodedata.normalize('NFC', str(value)).lower())


def validate(s, project=None):
    errors = []
    def fail(path, why): errors.append(f'{path}: {why}')
    def text(value, path):
        if not isinstance(value, str) or not value.strip(): fail(path, 'expected nonempty text')
    def check_runs(runs, plain, path):
        if runs is None: return
        if not isinstance(runs, list) or not runs:
            fail(path, 'expected nonempty token spans'); return
        valid = all(isinstance(r, dict) and isinstance(r.get('text'), str) and r.get('token', 'plain') in ('plain', 'kw', 'fn', 'str', 'com', 'var') for r in runs)
        if not valid: fail(path, 'expected text and known syntax token'); return
        if ''.join(r['text'] for r in runs) != plain: fail(path, 'token spans must reproduce exact text')
    if not isinstance(s, dict): return ['script: expected object']
    if s.get('storyFormat') != 'code-noir-v1': fail('storyFormat', 'expected code-noir-v1')
    if s.get('language') not in ('vi', 'en', 'mixed'): fail('language', 'choose vi/en/mixed')
    for key in ('title', 'audience'): text(s.get(key), key)
    brief = s.get('story')
    if not isinstance(brief, dict): fail('story', 'expected question/example/takeaway')
    else:
        for key in ('question', 'example', 'takeaway'): text(brief.get(key), 'story.' + key)
    scenes = s.get('scenes')
    if not isinstance(scenes, list): fail('scenes', 'expected a list'); scenes = []
    sections = [('intro', s.get('intro'))] + [(f'scene-{i+1}', c) for i, c in enumerate(scenes)] + [('outro', s.get('outro'))]
    for sid, c in sections:
        if not isinstance(c, dict): fail(sid, 'expected object'); continue
        for key in ('title', 'vo'): text(c.get(key), sid + '.' + key)
        check_runs(c.get('titleRuns'), c.get('title'), sid + '.titleRuns')
        if c.get('layout') not in ('claim', 'code-output', 'comparison', 'verdict', 'rule'): fail(sid, 'unknown layout')
        hold = c.get('hold', 0)
        if isinstance(hold, bool) or not isinstance(hold, (int, float)) or not math.isfinite(hold) or not 0 <= hold <= 6: fail(sid + '.hold', 'expected 0–6 seconds')
        elif hold > 0: text(c.get('readTask'), sid + '.readTask')
        blocks = c.get('blocks')
        if not isinstance(blocks, list) or not 1 <= len(blocks) <= 4: fail(sid + '.blocks', 'expected 1–4 readable units'); continue
        for i, b in enumerate(blocks):
            bp = f'{sid}.blocks[{i}]'
            if not isinstance(b, dict): fail(bp, 'expected object'); continue
            if b.get('type') not in ('text', 'note', 'code', 'result'): fail(bp, 'unknown block type')
            text(b.get('text'), bp + '.text')
            if 'emphasis' in b and b['emphasis'] not in ('kw', 'fn', 'str', 'com', 'var'): fail(bp + '.emphasis', 'choose kw/fn/str/com/var')
            check_runs(b.get('runs'), b.get('text'), bp + '.runs')
            if ('at' in b) == ('on' in b): fail(bp, 'choose exactly one of on/at'); continue
            if 'at' in b:
                at = b['at']
                if isinstance(at, bool) or not isinstance(at, (int, float)) or not math.isfinite(at) or at < 0: fail(bp + '.at', 'expected finite nonnegative seconds')
            else:
                text(b['on'], bp + '.on')
                needle, words = tokens(b['on']), tokens(c.get('vo', ''))
                occurrence = b.get('occurrence', 1)
                if isinstance(occurrence, bool) or not isinstance(occurrence, int) or occurrence < 1: fail(bp + '.occurrence', 'expected positive integer')
                elif not needle or sum(words[j:j+len(needle)] == needle for j in range(len(words)-len(needle)+1)) < occurrence: fail(bp + '.on', 'phrase/occurrence absent from narration')
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
