from pathlib import Path
import json
from faster_whisper import WhisperModel
p=Path(__file__).resolve().parents[1]
model=WhisperModel(str(Path('.runtime/agentvid/models/whisper/models--Systran--faster-whisper-small/snapshots/536b0662742c02347bc0e980a01041f333bce120').resolve()),device='cpu',compute_type='int8')
tm=json.loads((p/'timings.json').read_text());report=[]
for s in tm['sections']:
 segs,_=model.transcribe(str(p/s['file']),language='vi',word_timestamps=True,beam_size=5)
 segs=list(segs);report.append({'id':s['id'],'expected':s['text'],'heard':' '.join(x.text.strip() for x in segs),'segments':[{'start':x.start,'end':x.end,'text':x.text,'words':[{'word':w.word,'start':w.start,'end':w.end,'probability':w.probability} for w in x.words]} for x in segs]})
 print(s['id'],report[-1]['heard'],flush=True)
(p/'audio-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
