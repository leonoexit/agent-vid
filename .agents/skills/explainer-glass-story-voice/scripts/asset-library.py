"""Skill-local cutout catalogue: register, select, request, install and record use.

Python stdlib only. No generation API, OCR, browser or dependency installation.
"""
import argparse
from contextlib import contextmanager
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import struct
import time
import unicodedata
import uuid

SKILL = Path(__file__).resolve().parent.parent
LIBRARY = SKILL / 'assets/library'
STYLE = json.loads((SKILL / 'references/asset-style.json').read_text(encoding='utf8'))


def read_json(path, fallback=None):
    return json.loads(path.read_text(encoding='utf8')) if path.exists() else fallback


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(path.name + '.' + uuid.uuid4().hex + '.tmp')
    try:
        temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
        temp.replace(path)
    finally:
        temp.unlink(missing_ok=True)


def emit(value):
    print(json.dumps(value, ensure_ascii=False, indent=2))


@contextmanager
def library_lock():
    LIBRARY.mkdir(parents=True, exist_ok=True)
    path = LIBRARY / '.write.lock'
    deadline = time.monotonic() + 5
    while True:
        try:
            fd = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            os.close(fd)
            break
        except FileExistsError:
            if time.monotonic() >= deadline:
                raise ValueError('Library busy. Retry later; inspect a stale lock before removing it.')
            time.sleep(.1)
    try:
        yield
    finally:
        path.unlink(missing_ok=True)


def slug(value):
    if not isinstance(value, str) or not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,79}', value):
        raise ValueError('IDs, families and roles must use lowercase letters, digits and hyphens (max 80).')
    return value


def strings(value, label):
    if not isinstance(value, list) or not value or any(not isinstance(x, str) or not x.strip() for x in value):
        raise ValueError(label + ' must be a nonempty list of strings.')
    return value


def normalized(value):
    text = unicodedata.normalize('NFKD', value.lower()).replace('đ', 'd')
    return ' '.join(re.findall(r'[a-z0-9]+', ''.join(c for c in text if not unicodedata.combining(c))))


def catalogue():
    return read_json(LIBRARY / 'catalog.json', {'schema': 1, 'style': STYLE['id'], 'assets': []})


def register(args):
    metadata = read_json(args.metadata)
    if not isinstance(metadata, dict):
        raise ValueError('Metadata must be an object.')
    for key in ('id', 'family', 'role'):
        slug(metadata.get(key))
    if metadata.get('style') != STYLE['id']:
        raise ValueError('Asset must use this skill\'s style: ' + STYLE['id'])
    for key in ('subjects', 'states', 'capabilities', 'tags'):
        strings(metadata.get(key), key)
    if not isinstance(metadata.get('description'), str) or not metadata['description'].strip():
        raise ValueError('Supply a useful description.')
    origin = metadata.get('origin')
    if not isinstance(origin, dict) or not origin.get('kind') or not origin.get('tool'):
        raise ValueError('Record origin.kind and origin.tool.')
    if origin['kind'] == 'imagegen' and not origin.get('prompt'):
        raise ValueError('Generated assets must retain the exact prompt.')
    raw = args.image.read_bytes()
    if len(raw) < 33 or raw[:8] != b'\x89PNG\r\n\x1a\n' or raw[12:16] != b'IHDR':
        raise ValueError('Supply a PNG cutout.')
    width, height = struct.unpack('>II', raw[16:24])
    if raw[25] not in (4, 6):
        raise ValueError('PNG must have an alpha channel; retain the generated transparency.')
    digest = hashlib.sha256(raw).hexdigest()
    with library_lock():
        catalog = catalogue()
        if any(a['id'] == metadata['id'] for a in catalog['assets']):
            raise ValueError('Asset ID already exists. Register a new version; do not overwrite.')
        if any(a['sha256'] == digest for a in catalog['assets']):
            raise ValueError('These exact image bytes are already registered.')
        parent_id = metadata.get('variant_of')
        if parent_id:
            parent = next((a for a in catalog['assets'] if a['id'] == parent_id), None)
            if not parent or parent['family'] != metadata['family']:
                raise ValueError('variant_of must exist and share the same family.')
        folder = LIBRARY / metadata['id']
        if folder.exists():
            raise ValueError('Asset directory exists; resolve it before registering this ID.')
        metadata.update(file=f"{metadata['id']}/image.png", sha256=digest,
                        width=width, height=height, alpha_channel=True,
                        added_at=datetime.now(timezone.utc).isoformat())
        folder.mkdir()
        try:
            shutil.copyfile(args.image, folder / 'image.png')
            write_json(folder / 'metadata.json', metadata)
            summary = {k: v for k, v in metadata.items() if k not in ('origin',)}
            catalog['assets'].append(summary)
            write_json(LIBRARY / 'catalog.json', catalog)
        except Exception:
            shutil.rmtree(folder)
            raise
    emit({'registered': metadata['id'], 'file': str(folder / 'image.png')})


def select(args):
    history = read_json(LIBRARY / 'usage.json', {'schema': 1, 'videos': []})['videos']
    # Re-editing one video should not penalize its own existing selections.
    if args.project:
        manifest = read_json(args.project / 'asset-manifest.json', {})
        history = [v for v in history if v['video_id'] != manifest.get('video_id')]
    recent = history[-STYLE['recent_video_window']:]
    terms = set(normalized(args.query).split())
    candidates = []
    for asset in catalogue()['assets']:
        if asset['style'] != STYLE['id'] or asset['role'] != args.role:
            continue
        if args.state not in asset['states'] or not set(args.action).issubset(asset['capabilities']):
            continue
        if args.subject and normalized(args.subject) not in [normalized(s) for s in asset['subjects']]:
            continue
        corpus = set(normalized(' '.join([*asset['subjects'], *asset['tags'], asset['description']])).split())
        matched = sorted(terms & corpus)
        if terms and not matched:
            continue
        family_uses = sum(asset['family'] in v['families'] for v in recent)
        asset_uses = sum(asset['id'] in v['asset_ids'] for v in recent)
        candidates.append({'id': asset['id'], 'family': asset['family'], 'role': asset['role'],
                           'states': asset['states'], 'subjects': asset['subjects'],
                           'description': asset['description'], 'fit_score': len(matched),
                           'matched_terms': matched, 'recent_family_videos': family_uses,
                           'recent_asset_videos': asset_uses, 'file': asset['file']})
    candidates.sort(key=lambda a: (-a['fit_score'], a['recent_family_videos'], a['recent_asset_videos'], a['id']))
    if not candidates:
        action, reason = 'generate', 'No asset matches the requested role/state/actions and search terms.'
    elif args.importance == 'hero' and all(c['recent_family_videos'] for c in candidates):
        action, reason = 'variant', 'Compatible hero families appeared recently. Consider a new visual identity or a targeted variant; metadata matching still needs storyboard judgment.'
    else:
        action, reason = 'reuse', 'Compatible candidates ranked by textual fit, then recent family/asset usage. Choose the one that expresses this operation.'
    emit({'action': action, 'reason': reason, 'window_videos': STYLE['recent_video_window'],
          'candidates': candidates[:args.limit]})


def request(args):
    if not args.project.is_dir():
        raise ValueError('Project directory does not exist.')
    parent = next((a for a in catalogue()['assets'] if a['id'] == args.variant_of), None) if args.variant_of else None
    if args.variant_of and not parent:
        raise ValueError('Unknown variant_of asset.')
    subject, role, state = args.subject, slug(args.role), args.state
    prompt = (STYLE['prompt'] + '\nSubject: ' + subject + '.\nVisible state: ' + state +
              '.\nExplanatory role: ' + role + '.\nStoryboard operation: ' + args.operation + '.')
    if parent:
        prompt += '\nVariant of ' + parent['id'] + ': ' + args.change + '. Preserve its visual identity except for this change.'
    ident = slug(args.id)
    spec = {'id': ident, 'family': parent['family'] if parent else slug(args.family or ident),
            'style': STYLE['id'], 'role': role, 'subjects': [subject], 'states': [state],
            'capabilities': STYLE['default_capabilities'], 'tags': args.tag or [role],
            'description': args.operation, 'origin': {'kind': 'imagegen', 'tool': 'built-in image_gen',
                                                    'prompt': prompt, 'reference_asset_ids': [parent['id']] if parent else []}}
    if parent:
        spec['variant_of'] = parent['id']
    path = args.project / 'asset-requests' / (ident + '.json')
    if path.exists():
        raise ValueError('Request already exists; use a new ID.')
    write_json(path, spec)
    emit({'request': str(path), 'prompt': prompt, 'transparent_background': True,
          'reference_image': str(LIBRARY / parent['file']) if parent else None,
          'next': 'Generate with built-in image_gen, then register using this request as metadata. This command does not call a generation API.'})


def install(args):
    asset = next((a for a in catalogue()['assets'] if a['id'] == args.asset), None)
    if not asset:
        raise ValueError('Unknown asset.')
    for name in ('theme.css', 'story-engine.js'):
        template = args.project / name
        if not template.exists() or 'has-illustration' not in template.read_text(encoding='utf8'):
            raise ValueError('Project needs the v0.3 illustrated template. Create a fresh project, or explicitly migrate its CSS/renderer before installing cutouts.')
    script_path = args.project / 'script.json'
    script = read_json(script_path)
    if not isinstance(script, dict):
        raise ValueError('Project must contain script.json.')
    entity = next((n for n in script.get('entities', []) if n.get('id') == args.entity), None)
    if not entity:
        raise ValueError('Unknown storyboard entity.')
    if any(e.get('type') == 'open' and e.get('target') == args.entity
           for sc in script.get('scenes', []) for e in sc.get('events', [])):
        raise ValueError('This entity opens a native lid. Use native geometry or a separate state/parts layer; a flat PNG cannot articulate that lid.')
    minimum_height = 160 if entity.get('kind') == 'reader' else 250
    if entity.get('width', 0) < 300 or entity.get('height', 0) < minimum_height:
        raise ValueError('Illustrated entities need width >=300 and height >=250 (reader >=160).')
    source = LIBRARY / asset['file']
    if hashlib.sha256(source.read_bytes()).hexdigest() != asset['sha256']:
        raise ValueError('Asset bytes changed; register a new version before using them.')
    relative = 'assets/illustrations/' + asset['id'] + '-' + asset['sha256'][:8] + '.png'
    target = args.project / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)
    manifest_path = args.project / 'asset-manifest.json'
    manifest = read_json(manifest_path, {'schema': 1, 'skill': 'explainer-glass-story-voice',
                                        'video_id': str(uuid.uuid4()), 'assets': []})
    manifest['assets'] = [a for a in manifest['assets'] if a['entity'] != args.entity]
    manifest['assets'].append({'id': asset['id'], 'family': asset['family'], 'sha256': asset['sha256'],
                               'file': relative, 'entity': args.entity, 'reason': args.reason})
    entity.update(image=relative, alt=asset['description'])
    write_json(manifest_path, manifest)
    write_json(script_path, script)
    emit({'installed': asset['id'], 'entity': args.entity, 'image': relative,
          'usage': 'Not recorded yet. Record after this video renders successfully.'})


def record(args):
    manifest = read_json(args.project / 'asset-manifest.json')
    script = read_json(args.project / 'script.json')
    if not manifest or not script:
        raise ValueError('Project needs script.json and asset-manifest.json.')
    nodes = {n['id']: n for n in script['entities']}
    used = [a for a in manifest['assets'] if nodes.get(a['entity'], {}).get('image') == a['file']]
    if not used:
        raise ValueError('No installed library assets remain in the script.')
    # Count only entities with a show cue, not unused/copied files.
    shown = {e.get('target') for sc in script.get('scenes', []) for e in sc.get('events', []) if e.get('type') == 'show'}
    used = [a for a in used if a['entity'] in shown]
    if not used:
        raise ValueError('No installed library entities have a show cue.')
    video = {'video_id': manifest['video_id'], 'title': script.get('title', ''),
             'used_at': datetime.now(timezone.utc).isoformat(),
             'asset_ids': sorted({a['id'] for a in used}), 'families': sorted({a['family'] for a in used})}
    with library_lock():
        history = read_json(LIBRARY / 'usage.json', {'schema': 1, 'videos': []})
        previous = next((v for v in history['videos'] if v['video_id'] == video['video_id']), None)
        if previous:
            # Updating an old video's edit does not make it a newly published video.
            video['used_at'] = previous['used_at']
            history['videos'][history['videos'].index(previous)] = video
        else:
            history['videos'].append(video)
        write_json(LIBRARY / 'usage.json', history)
    emit({'recorded': video['video_id'], 'asset_ids': video['asset_ids'],
          'note': 'Run only after successful rendering; no external publishing is performed.'})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    p = commands.add_parser('register', help='Add an immutable PNG and its metadata.')
    p.add_argument('--image', type=Path, required=True)
    p.add_argument('--metadata', type=Path, required=True)
    p.set_defaults(run=register)
    p = commands.add_parser('select', help='Shortlist matching assets with recent-use context.')
    p.add_argument('--role', required=True)
    p.add_argument('--state', required=True)
    p.add_argument('--query', default='')
    p.add_argument('--subject')
    p.add_argument('--action', action='append', default=[])
    p.add_argument('--importance', choices=['hero', 'support'], default='hero')
    p.add_argument('--limit', type=int, default=5)
    p.add_argument('--project', type=Path)
    p.set_defaults(run=select)
    p = commands.add_parser('request', help='Write a scoped image-generation brief, without calling an API.')
    p.add_argument('--project', type=Path, required=True)
    p.add_argument('--id', required=True)
    p.add_argument('--family')
    p.add_argument('--subject', required=True)
    p.add_argument('--role', required=True)
    p.add_argument('--state', required=True)
    p.add_argument('--operation', required=True)
    p.add_argument('--tag', action='append', default=[])
    p.add_argument('--variant-of')
    p.add_argument('--change', default='Adapt the prop to the new storyboard operation')
    p.set_defaults(run=request)
    p = commands.add_parser('install', help='Copy one selection and attach it to an existing entity.')
    p.add_argument('--asset', required=True)
    p.add_argument('--project', type=Path, required=True)
    p.add_argument('--entity', required=True)
    p.add_argument('--reason', required=True)
    p.set_defaults(run=install)
    p = commands.add_parser('record', help='Record actual scripted use after successful rendering.')
    p.add_argument('--project', type=Path, required=True)
    p.set_defaults(run=record)
    args = parser.parse_args()
    if args.command == 'select' and args.limit < 1:
        parser.error('--limit must be positive')
    try:
        args.run(args)
    except (OSError, ValueError, KeyError, TypeError) as exc:
        parser.exit(1, str(exc) + '\n')


if __name__ == '__main__':
    main()
