import copy, importlib.util, json, pathlib, unittest
ROOT = pathlib.Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('narrative_validator', ROOT/'scripts/validate-script.py')
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)
class Narrative(unittest.TestCase):
 def setUp(self): self.script = json.loads((ROOT/'references/script.example.en.json').read_text())
 def test_case_without_phases(self): self.assertEqual(v.validate(self.script), [])
 def test_editorial_notes_have_no_fixed_order_or_vocabulary(self):
  for scene, note in zip(self.script['scenes'], ['result', 'replay', 'compare', 'result']): scene['phase'] = note
  self.assertEqual(v.validate(self.script), [])
 def test_one_core_scene_is_not_rejected_by_narrative(self):
  self.script['scenes'] = self.script['scenes'][:1]
  self.assertEqual(v.validate(self.script), [])
 def test_brief_and_optional_notes_checked(self):
  for field in ('question', 'example', 'takeaway'):
   with self.subTest(field=field):
    s = copy.deepcopy(self.script); s['story'][field] = ''
    self.assertTrue(any('story.'+field in x for x in v.validate(s)))
  for path in ('approach', 'audience', 'phase'):
   s = copy.deepcopy(self.script)
   if path == 'approach': s['story'][path] = []
   elif path == 'audience': s[path] = []
   else: s['scenes'][0][path] = []
   self.assertTrue(any(path in x for x in v.validate(s)))
 def test_technical_cue_check_still_applies(self):
  self.script['scenes'][0]['events'][0]['on'] = 'not spoken anywhere'
  self.assertTrue(any('spoken phrase' in x for x in v.validate(self.script)))
 def test_unknown_format_rejected(self):
  self.script['storyFormat'] = 'unknown'
  self.assertTrue(any('storyFormat' in x for x in v.validate(self.script)))
 def test_explicit_old_contract_remains_strict(self):
  self.script['storyFormat'] = 'worked-trace-v1'
  for scene, phase in zip(self.script['scenes'], ['setup', 'decode', 'execute', 'verify']): scene['phase'] = phase
  self.assertEqual(v.validate(self.script), [])
  self.script['scenes'][0]['phase'] = 'verify'
  errors = v.validate(self.script)
  self.assertTrue(any('order' in x for x in errors))
  self.assertTrue(any('four core phases' in x for x in errors))
 def test_unmarked_legacy_script_remains_compatible(self):
  del self.script['storyFormat']; del self.script['story']
  self.assertEqual(v.validate(self.script), [])
if __name__ == '__main__': unittest.main()
