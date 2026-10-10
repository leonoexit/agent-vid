"""Verify voice precedence and that timing changes preserve narration and explicit holds."""
import hashlib
import importlib.util
import json
import pathlib
import re
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts'))
import voice_common as vc
spec = importlib.util.spec_from_file_location('sync', ROOT / 'scripts/sync-narration.py')
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class TimingAndDefaults(unittest.TestCase):
    def test_voiced_sections_have_half_second_boundary_spacing(self):
        for kind in ('intro', 'scene', 'outro'):
            self.assertAlmostEqual(sync.section_duration(kind, 8, 0, 20), 8.5)
        self.assertAlmostEqual(sync.section_duration('scene', 8, .6, 20), 9.1)
        self.assertEqual(sync.section_duration('scene', 0, .6, 20), 20.6)

    def test_default_and_explicit_voice_survive_machine_preferences(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = pathlib.Path(tmp)
            machine = base / 'machine.json'
            machine.write_text(json.dumps({'voice': 'Thái Sơn'}))
            for flags, expected in (([], 'Hải Đăng'), (['--voice', 'Thái Sơn', '--speed', '.9'], 'Thái Sơn')):
                project = base / expected
                subprocess.run([sys.executable, str(ROOT / 'scripts/new-project.py'), str(project), *flags], check=True, capture_output=True)
                with patch.object(vc, 'VOICE_JSON', machine):
                    settings = vc.voice_settings(project=project)
                self.assertEqual(settings['vi'], expected)
                self.assertEqual(settings['paragraph_gap'], .2)
                self.assertEqual(settings['speed'], .9 if flags else 1.0)
            default = json.loads((base / 'Hải Đăng' / 'script.json').read_text())
            self.assertTrue(all(c.get('hold', 0) == 0 for c in [default['intro'], *default['scenes'], default['outro']]))

    def test_sync_offsets_words_and_audio_without_clipping(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = pathlib.Path(tmp) / 'trace'
            subprocess.run([sys.executable, str(ROOT / 'scripts/new-project.py'), str(project), '--language', 'en'], check=True, capture_output=True)
            script = json.loads((project / 'script.json').read_text())
            ids = ['intro', *[f'scene-{i+1}' for i in range(len(script['scenes']))], 'outro']
            clips = [{'id': sid, 'duration': 8, 'file': None, 'words': [{'w': 'example', 'start': 0, 'end': 8}]} for sid in ids]
            (project / 'timings.json').write_text(json.dumps({'sections': clips}))
            subprocess.run([sys.executable, str(ROOT / 'scripts/sync-narration.py'), '--project', str(project), '--no-bgm'], check=True, capture_output=True)
            text = (project / 'project-data.js').read_text()
            plan = json.loads(re.search(r'window.PLAN = (\{.*\});', text, re.S)[1])
            self.assertAlmostEqual(plan['total'], len(ids) * 8.5)
            for section in plan['sections']:
                self.assertAlmostEqual(section['words'][0]['t0'], section['start'] + .15)
                self.assertAlmostEqual(section['words'][0]['t1'], section['start'] + 8.15)
                self.assertLessEqual(section['words'][0]['t1'], section['start'] + section['dur'])
            self.assertIn(f'data-duration="{plan["total"]}"', (project / 'index.html').read_text())

    def test_reference_sources_match_manifest(self):
        manifest = json.loads((ROOT / 'references/source-manifest.json').read_text())
        self.assertEqual(len(manifest['files']), 6)
        self.assertEqual(sum(f['slides'] for f in manifest['files']), 67)
        for item in manifest['files']:
            self.assertEqual(hashlib.sha256((ROOT / 'references/source' / item['file']).read_bytes()).hexdigest(), item['sha256'])


if __name__ == '__main__':
    unittest.main()
