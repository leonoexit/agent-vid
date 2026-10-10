import importlib.util,json,pathlib,unittest
ROOT=pathlib.Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('validator',ROOT/'scripts/validate-script.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
class Validation(unittest.TestCase):
 def setUp(self):self.s=json.loads((ROOT/'references/script.example.vi.json').read_text())
 def add(self,**event):self.s['scenes'][0]['events'].append(dict(at=1,**event))
 def test_complete_samples(self):
  for lang in ('vi','en'):
   with self.subTest(language=lang):self.assertEqual(v.validate(json.loads((ROOT/f'references/script.example.{lang}.json').read_text())),[])
 def test_unknown_transfer_target(self):
  self.add(type='transfer',**{'from':'x','to':'missing','value':'10'});self.assertTrue(v.validate(self.s))
 def test_spoken_anchor_missing(self):
  self.s['scenes'][0]['events'][0]['on']='words never spoken';self.assertTrue(v.validate(self.s))
 def test_moving_entity_outside_stage(self):
  self.add(type='move',target='x',x=850,y=0);self.assertTrue(v.validate(self.s))
 def test_card_cannot_open_as_box(self):
  self.add(type='open',target='x');self.assertTrue(v.validate(self.s))
 def test_malformed_code_rejected_without_crash(self):
  self.add(type='code',lines=None);self.assertTrue(v.validate(self.s))
 def test_duplicate_entity_rejected(self):
  self.s['entities'][1]['id']='x';self.assertTrue(v.validate(self.s))
 def test_invalid_reveal_and_line_cue_rejected(self):
  self.add(type='reveal',target='x',fields=['imaginary']);self.assertTrue(v.validate(self.s))
  self.setUp();self.add(type='code',lines=['x = 1;'],lineCues=['never spoken']);self.assertTrue(v.validate(self.s))
 def test_hero_cue_is_checked(self):
  self.s['intro']['tiles'][1]['on']='absent phrase';self.assertTrue(v.validate(self.s))
 def test_sticker_cannot_be_native_target(self):
  self.s['stickers']=[dict(id='mascot',manual=True,image='assets/illustrations/mascot.png',alt='Mascot',x=0,y=0,width=100,height=100)]
  self.add(type='sticker',target='mascot',action='show');self.assertEqual(v.validate(self.s),[])
  self.add(type='transfer',**{'from':'mascot','to':'x','value':'1'});self.assertTrue(v.validate(self.s))
if __name__=='__main__':unittest.main()
