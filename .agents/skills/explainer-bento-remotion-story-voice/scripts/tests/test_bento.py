"""Bento style inputs must stay explicit and reject unsupported modes."""
import importlib.util,json,pathlib,unittest
ROOT=pathlib.Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('validator',ROOT/'scripts/validate-script.py')
v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
class BentoSchema(unittest.TestCase):
 def test_tones_and_comparison_connector(self):
  s=json.loads((ROOT/'references/script.example.en.json').read_text())
  for tone in v.TONES:
   s['entities'][0]['tone']=tone;s['intro']['tone']=tone;s['scenes'][0]['tone']=tone
   self.assertEqual(v.validate(s),[])
  self.assertEqual(s['outro']['connector'],'≠')
 def test_unknown_tone_is_not_silently_accepted(self):
  s=json.loads((ROOT/'references/script.example.en.json').read_text())
  s['entities'][0]['tone']='neon';s['intro']['connector']='too long'
  errors=v.validate(s)
  self.assertTrue(any('unknown bento tone' in e for e in errors))
  self.assertTrue(any('connector' in e for e in errors))
if __name__=='__main__':unittest.main()
