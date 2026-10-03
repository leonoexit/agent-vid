import copy
import importlib.util
import json
from pathlib import Path
import sys
import unittest

SKILL = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(SKILL / 'scripts'))
spec = importlib.util.spec_from_file_location('validator', SKILL / 'scripts/validate-script.py')
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)

class ScriptValidation(unittest.TestCase):
    def setUp(self):
        self.script = json.loads((SKILL / 'references/script.example.vi.json').read_text())

    def test_shipped_examples(self):
        for lang in ('vi', 'en'):
            with self.subTest(lang=lang):
                script = json.loads((SKILL / f'references/script.example.{lang}.json').read_text())
                self.assertEqual(v.validate(script), [])

    def test_reject_missing_spoken_cue(self):
        self.script['scenes'][0]['widget']['events'][0]['on'] = 'a phrase never spoken'
        self.assertTrue(any('not found' in e for e in v.validate(self.script)))

    def test_repeated_phrase_requires_existing_occurrence(self):
        self.script['scenes'][0]['widget']['events'][0]['occurrence'] = 2
        self.assertTrue(any('not found' in e for e in v.validate(self.script)))

    def test_reject_unknown_node_and_edge(self):
        event = self.script['scenes'][2]['widget']['events'][0]
        event['set'] = {'missing': '20'}
        event['edge'] = {'from': 'x', 'to': 'p'}
        errors = v.validate(self.script)
        self.assertTrue(any('unknown node' in e for e in errors))
        self.assertTrue(any('initialized edge' in e for e in errors))

    def test_reject_reinitialization_and_broken_continuity(self):
        self.script['scenes'][1]['widget']['nodes'] = []
        self.assertTrue(any('initialize' in e for e in v.validate(self.script)))
        del self.script['scenes'][1]['widget']['nodes']
        self.script['scenes'].insert(1, copy.deepcopy(self.script['scenes'][-1]))
        self.assertTrue(any('consecutive' in e for e in v.validate(self.script)))

    def test_cues_accept_punctuation_and_case(self):
        self.script['scenes'][0]['widget']['events'][0]['on'] = 'CHIẾC HỘP!'
        self.assertEqual(v.validate(self.script), [])

    def test_local_illustration_paths(self):
        scene = self.script['scenes'][-1]
        for src in ('https://example.com/a.png', 'assets/illustrations/../../secret.png'):
            scene['widget'] = {'kind': 'illustration', 'src': src, 'alt': 'Object'}
            self.assertTrue(any('local image' in e for e in v.validate(self.script)))
        scene['widget']['src'] = 'assets/illustrations/object-v1.png'
        self.assertEqual(v.validate(self.script), [])

if __name__ == '__main__':
    unittest.main()
