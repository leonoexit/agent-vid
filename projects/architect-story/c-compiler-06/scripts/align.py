import json,unicodedata,difflib,shutil,sys
from pathlib import Path
sys.path.insert(0,str(Path('.agents/skills/explainer-architect-story-voice/scripts').resolve()))
from word_timing import validate_words
p=Path(__file__).resolve().parents[1];tp=p/'timings.json'
shutil.copy2(tp,p/'timings-estimated.json');data=json.loads(tp.read_text());asr=json.loads((p/'audio-review.json').read_text())
def norm(s):return ''.join(c for c in unicodedata.normalize('NFKD',s.lower().replace('đ','d')) if not unicodedata.combining(c) and c.isalnum())
expand={'2':['hai'],'10':['muoi'],'10%':['muoi','phan','tram'],'100000':['mot','tram','nghin'],'90000':['chin','muoi','nghin']};report=[]
for sc,a in zip(data['sections'],asr):
 src=sc['words'];heard=[]
 for seg in a['segments']:
  for w in seg['words']:
   n=norm(w['word']);parts=expand.get(w['word'].strip(),expand.get(n,[n]));dur=w['end']-w['start']
   for i,word in enumerate(parts):heard.append({'n':word,'start':w['start']+dur*i/len(parts)})
 anchors={};last=-1
 for block in difflib.SequenceMatcher(None,[norm(w['w']) for w in src],[w['n'] for w in heard],autojunk=False).get_matching_blocks():
  for j in range(block.size):
   h=heard[block.b+j]
   if h['start']>=last+.025 and h['start']<sc['duration']-.04:anchors[block.a+j]=h['start'];last=h['start']
 if len(anchors)/len(src)<.5:report.append({'id':sc['id'],'matched':len(anchors),'total':len(src),'mode':'pause estimates retained'});continue
 points=[(-1,0),*sorted(anchors.items()),(len(src),sc['duration']-.03)];starts=[0]*len(src)
 for (i,a0),(j,b0) in zip(points,points[1:]):
  for k in range(i+1,j):starts[k]=a0+(b0-a0)*(k-i)/(j-i)
  if j<len(src):starts[j]=b0
 words=[{'w':w['w'],'start':round(starts[i],5),'end':round(starts[i]+.95*((starts[i+1] if i+1<len(src) else sc['duration']-.01)-starts[i]),5)} for i,w in enumerate(src)]
 validate_words(words,sc['duration']);sc['words']=words;report.append({'id':sc['id'],'matched':len(anchors),'total':len(src),'mode':'ASR anchors + interpolation'})
data['timing_refinement']='Local faster-whisper anchors + interpolation, original script preserved; not manual listening certification.'
tp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');(p/'alignment-report.json').write_text(json.dumps(report,indent=2));print(report)
