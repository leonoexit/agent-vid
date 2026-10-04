import json,pathlib,subprocess,sys,tempfile,unittest,wave
ROOT=pathlib.Path(__file__).resolve().parents[2]
class RemotionPipeline(unittest.TestCase):
 def new(self,path):
  return subprocess.run([sys.executable,str(ROOT/'scripts/new-project.py'),str(path),'--language','en'],capture_output=True,text=True)
 def test_new_project_refuses_overwrite(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/'project';self.assertEqual(self.new(p).returncode,0)
   (p/'script.json').write_text('preserve me')
   self.assertNotEqual(self.new(p).returncode,0);self.assertEqual((p/'script.json').read_text(),'preserve me')
 def test_actual_voice_asset_reaches_remotion_with_lead_and_duration(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/'project';self.assertEqual(self.new(p).returncode,0)
   audio=p/'assets/audio/test.wav';audio.parent.mkdir(parents=True,exist_ok=True)
   with wave.open(str(audio),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(8000);w.writeframes(b'\0\0'*8000)
   (p/'timings.json').write_text(json.dumps({'sections':[{'id':'intro','duration':1,'file':'assets/audio/test.wav','words':[{'w':'hello','start':0,'end':1}]}]}))
   subprocess.run([sys.executable,str(ROOT/'scripts/sync-narration.py'),'--project',str(p),'--no-bgm'],check=True,capture_output=True)
   data=json.loads((p/'project-data.json').read_text());self.assertEqual(data['audio'],[{'src':'assets/audio/test.wav','start':.15,'duration':1,'volume':1}])
   result=subprocess.run(['node',str(p/'scripts/prepare-media.cjs')],capture_output=True,text=True);self.assertEqual(result.returncode,0,result.stderr)
   self.assertEqual(audio.read_bytes(),(p/'public/assets/audio/test.wav').read_bytes())
   data['audio'][0]['src']='../outside.wav';(p/'project-data.json').write_text(json.dumps(data))
   self.assertNotEqual(subprocess.run(['node',str(p/'scripts/prepare-media.cjs')],capture_output=True).returncode,0)
