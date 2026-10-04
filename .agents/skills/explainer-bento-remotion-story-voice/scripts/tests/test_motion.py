import json,pathlib,random,sys,unittest
ROOT=pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'scripts'))
from word_timing import estimate_words,validate_words
from motion_audit import audit,resolve

class Motion(unittest.TestCase):
 def test_pause_snapping_cannot_reverse_words(self):
  random.seed(8)
  text='First, a value. Then, another step. Now read it, and finally write the result.'
  for _ in range(300):
   duration=random.uniform(2,20)
   gaps=sorted((a,min(duration,a+random.uniform(.1,.5))) for a in [random.uniform(0,duration) for _ in range(10)])
   words=estimate_words(text,(0,duration),gaps)
   validate_words(words,duration)
   self.assertEqual([w['w'] for w in words],text.split())
 def test_bad_timings_fail_before_sync(self):
  for words in ([dict(start=2,end=1)],[dict(start=0,end=2),dict(start=1,end=3)],[dict(start=0,end=9)]):
   with self.assertRaises(ValueError):validate_words(words,4)
 def test_decoration_does_not_hide_static_exposition(self):
  s=json.loads((ROOT/'references/script.example.en.json').read_text());s['scenes']=s['scenes'][:1]
  scene=s['scenes'][0];scene['events']=[dict(type='pulse',target='x',at=i) for i in range(1,8)]
  s['intro']={'vo':'hello'};s['outro']={'vo':'bye'}
  plan={'sections':[dict(id=id,start=i*10,dur=10,words=[]) for i,id in enumerate(('intro','scene-1','outro'))]}
  report=audit(s,plan)
  self.assertEqual(report['sections'][1]['semanticBeats'],1)
  self.assertTrue(report['sections'][1]['stillIntervals'])
 def fixture(self, events):
  script={'intro':{'vo':'intro'},'outro':{'vo':'outro'},'entities':[],
          'scenes':[{'vo':'example','events':e} for e in events]}
  ids=['intro']+[f'scene-{i+1}' for i in range(len(events))]+['outro']
  return script,{'sections':[dict(id=id,start=i*7,dur=7,words=[]) for i,id in enumerate(ids)]}
 def test_text_changes_do_not_disguise_model_stillness(self):
  events=[{'type':'text','slot':'subtitle','text':str(i),'at':i} for i in range(1,6)]
  script,plan=self.fixture([events]*3);r=audit(script,plan)
  self.assertFalse(r['sections'][1]['stillIntervals'])
  self.assertEqual(r['sections'][1]['modelChanges'],0)
  self.assertTrue(r['sections'][1]['modelStillIntervals'])
  self.assertTrue(any('Text/attention-only run' in w for w in r['warnings']))
 def test_operation_breaks_text_only_run(self):
  text=[{'type':'text','slot':'subtitle','text':'read','at':1}]
  script,plan=self.fixture([text,text,[{'type':'write','to':'x','value':'20','at':2}],text])
  r=audit(script,plan)
  self.assertEqual(r['sections'][3]['modelChanges'],1)
  self.assertFalse(any('Text/attention-only run' in w for w in r['warnings']))
 def test_generated_art_is_optional_and_attention_is_not_operation(self):
  script,plan=self.fixture([[{'type':'focus','targets':['x'],'at':1},{'type':'code-focus','active':0,'at':3}]])
  r=audit(script,plan)
  self.assertFalse(any('supporting art' in w for w in r['warnings']))
  self.assertEqual(r['sections'][1]['attentionCues'],2)
  self.assertEqual(r['sections'][1]['modelChanges'],0)

 def test_reveal_splits_a_still_interval(self):
  section=dict(id='scene-1',start=5,dur=8,words=[dict(w='show',t0=6),dict(w='now',t0=7),dict(w='show',t0=9)])
  self.assertEqual(resolve({'on':'show','occurrence':2},section,''),9)
  with self.assertRaises(ValueError):resolve({'on':'missing'},section,'')

if __name__=='__main__':unittest.main()
