"""Check that fresh work cannot accidentally inherit the cache demo's content."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SKILL = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('cutout_validation', SKILL / 'scripts/validate-script.py')
validation = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validation)


class NewProjectTest(unittest.TestCase):
    def setUp(self):
        self.scratch = tempfile.TemporaryDirectory()
        self.addCleanup(self.scratch.cleanup)
        self.project = Path(self.scratch.name) / 'project'

    def create(self, *args):
        return subprocess.run([sys.executable, str(SKILL / 'scripts/new-project.py'),
                               str(self.project), *args], capture_output=True, text=True)

    def test_default_is_unfinished_and_subject_free(self):
        self.assertEqual(self.create().returncode, 0)
        script = json.loads((self.project / 'script.json').read_text())
        self.assertTrue(validation.validate(script), 'A draft must not pass as authored narration')
        self.assertEqual(list((self.project / 'assets/images').iterdir()), [])
        self.assertEqual(json.loads((self.project / 'assets/asset-prompts.json').read_text()), {'assets': []})
        self.assertIn('CUTOUT_UNAUTHORED', (self.project / 'story.js').read_text())
        for name in ['design.js', 'story.js', 'storyboard.md', 'script.json']:
            self.assertNotIn('cache', (self.project / name).read_text().lower())
        self.assertFalse((self.project / 'style-study.html').exists())
        for name in ['assets/js/gsap.min.js', 'assets/fonts/sans.woff2', 'voice.json']:
            self.assertTrue((self.project / name).is_file())

    def test_refuses_existing_destination_without_modifying_it(self):
        self.project.mkdir()
        sentinel = self.project / 'script.json'
        sentinel.write_text('existing user work')
        self.assertNotEqual(self.create().returncode, 0)
        self.assertEqual(sentinel.read_text(), 'existing user work')
        self.assertEqual(list(self.project.iterdir()), [sentinel])

    def test_example_is_explicit_and_self_contained(self):
        self.assertEqual(self.create('--example', 'cache').returncode, 0)
        self.assertEqual(validation.validate(json.loads((self.project / 'script.json').read_text())), [])
        for name in ['motion-study.html', 'transition-study.html', 'style-study.html',
                     'assets/images/hand-card.png', 'assets/images/lime-tray.png',
                     'assets/images/copy-typographic.png']:
            self.assertTrue((self.project / name).is_file())
        def check_paths(value):
            if isinstance(value, dict):
                for child in value.values(): check_paths(child)
            elif isinstance(value, list):
                for child in value: check_paths(child)
            elif isinstance(value, str):
                self.assertFalse(value.startswith('template/assets/'))
                if value.startswith('assets/'):
                    self.assertTrue((self.project / value).is_file(), value)
        for name in ['asset-prompts.json', 'typographic-asset-prompt.json']:
            check_paths(json.loads((self.project / 'assets' / name).read_text()))

    def test_unknown_example_does_not_create_destination(self):
        self.assertNotEqual(self.create('--example', 'other').returncode, 0)
        self.assertFalse(self.project.exists())


if __name__ == '__main__':
    unittest.main()
