import copy,importlib.util,json,pathlib,unittest
ROOT=pathlib.Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('narrative_validator',ROOT/'scripts/validate-script.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
class Narrative(unittest.TestCase):
 def setUp(self):self.script=json.loads((ROOT/'references/script.example.en.json').read_text())
 def test_complete_order_and_brief(self):self.assertEqual(v.validate(self.script),[])
 def test_reversed_phase_rejected(self):
  self.script['scenes'][0]['phase']='verify';self.assertTrue(any('order' in e for e in v.validate(self.script)))
 def test_missing_phase_rejected(self):
  for s in self.script['scenes']:
   if s['phase']=='decode':s['phase']='setup'
  self.assertTrue(any('four core phases' in e for e in v.validate(self.script)))
 def test_unknown_phase_and_empty_question(self):
  self.script['scenes'][0]['phase']='sales';self.script['story']['question']=''
  errors=v.validate(self.script);self.assertTrue(any('.phase' in e for e in errors));self.assertTrue(any('story.question' in e for e in errors))
 def test_legacy_script_remains_compatible(self):
  del self.script['storyFormat'];del self.script['story']
  for s in self.script['scenes']:del s['phase']
  self.assertEqual(v.validate(self.script),[])
if __name__=='__main__':unittest.main()
