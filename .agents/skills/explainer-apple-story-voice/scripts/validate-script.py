"""Validate Apple's flexible story brief using the shared technical checks."""
import argparse
import copy
import importlib.util
import json
from pathlib import Path


def load_technical_validator():
    path = Path(__file__).resolve().parents[2] / 'explainer-bento-story-voice/scripts/validate-script.py'
    if not path.is_file():
        raise FileNotFoundError(f'Missing required Bento technical validator: {path}')
    spec = importlib.util.spec_from_file_location('bento_technical_validator', path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.validate


def validate(script, technical_validate):
    if not isinstance(script, dict):
        return ['script.json must be an object']
    errors = []
    if script.get('storyFormat') != 'apple-action-v1':
        errors.append('storyFormat: expected apple-action-v1')
    if not isinstance(script.get('audience'), str) or not script['audience'].strip():
        errors.append('audience: expected nonempty text')
    brief = script.get('story')
    if not isinstance(brief, dict):
        errors.append('story: expected question/example/takeaway brief')
    else:
        for key in ('question', 'example', 'takeaway'):
            value = brief.get(key)
            if not isinstance(value, str) or not value.strip():
                errors.append(f'story.{key}: expected nonempty text')
    scenes = script.get('scenes')
    for index, scene in enumerate(scenes if isinstance(scenes, list) else []):
        if isinstance(scene, dict) and 'phase' in scene:
            if not isinstance(scene['phase'], str) or not scene['phase'].strip():
                errors.append(f'scene {index + 1}.phase: expected nonempty editorial label')
    # Only the narrative marker is removed; preserve all technical validation.
    technical_script = copy.deepcopy(script)
    technical_script.pop('storyFormat', None)
    return errors + technical_validate(technical_script)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', required=True, type=Path)
    args = parser.parse_args()
    try:
        script = json.loads((args.project / 'script.json').read_text(encoding='utf-8-sig'))
        technical_validate = load_technical_validator()
    except (ValueError, OSError) as error:
        parser.exit(1, str(error) + '\n')
    errors = validate(script, technical_validate)
    if isinstance(script, dict):
        for collection, label in (('entities', 'illustration'), ('stickers', 'sticker')):
            items = script.get(collection, [])
            for item in items if isinstance(items, list) else []:
                if isinstance(item, dict) and isinstance(item.get('image'), str):
                    if not (args.project / item['image']).is_file():
                        errors.append(f'Missing {label}: {item["image"]}')
    for error in errors:
        print('x', error)
    print('OK' if not errors else f'{len(errors)} problem(s)')
    parser.exit(bool(errors))


if __name__ == '__main__':
    main()
