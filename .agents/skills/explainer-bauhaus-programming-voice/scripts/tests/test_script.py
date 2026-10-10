import importlib.util,json,pathlib,unittest,tempfile,subprocess,sys
R=pathlib.Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('bau_validator',R/'scripts/validate-script.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
class Script(unittest.TestCase):
 def setUp(self):self.s=json.loads((R/'references/script.example.vi.json').read_text())
 def test_both_languages(self):
  for lang in ('vi','en'):self.assertEqual(v.validate(json.loads((R/f'references/script.example.{lang}.json').read_text())),[])
 def test_missing_phrase(self):
  self.s['scenes'][0]['cues']['first']='not in this voice'
  self.assertTrue(any('spoken phrase' in e for e in v.validate(self.s)))
 def test_occurrence(self):
  self.s['intro']['cues']['equation']={'on':'Dấu phần trăm','occurrence':2}
  self.assertTrue(v.validate(self.s))
 def test_narrative_is_not_a_phase_enum(self):
  self.s['scenes']=self.s['scenes'][:1];self.s['scenes'][0]['phase']='a custom argument'
  self.assertEqual(v.validate(self.s),[])
 def test_nonfinite_hold(self):
  self.s['intro']['hold']=float('nan');self.assertTrue(v.validate(self.s))
 def test_creation_and_existing_destination(self):
  with tempfile.TemporaryDirectory() as tmp:
   p=pathlib.Path(tmp)/'demo';cmd=[sys.executable,str(R/'scripts/new-project.py'),str(p),'--language','en']
   subprocess.run(cmd,check=True,capture_output=True);self.assertEqual(json.loads((p/'script.json').read_text())['language'],'en')
   (p/'keep.txt').write_text('keep');self.assertNotEqual(subprocess.run(cmd,capture_output=True).returncode,0);self.assertEqual((p/'keep.txt').read_text(),'keep')
if __name__=='__main__':unittest.main()
