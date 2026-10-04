"""Build review artifacts from browser QA; does not substitute for viewing frames/listening."""
from pathlib import Path
import json
from PIL import Image, ImageDraw
p=Path(__file__).resolve().parent.parent
q=json.loads((p/'snapshots/qa.json').read_text());tm=json.loads((p/'timings.json').read_text());score=json.loads((p/'score.json').read_text())
for a in range(0,24,8):
 sheet=Image.new('RGB',(1120,1060),'#ddd');draw=ImageDraw.Draw(sheet)
 for j in range(8):
  f=p/f'snapshots/scene-{a+j:02d}.png';im=Image.open(f);im.thumbnail((270,490));x=j%4*280;y=j//4*530;sheet.paste(im,(x,y+25));draw.text((x+5,y+5),f.stem,fill='black')
 sheet.save(p/f'snapshots/contact-{a//8}.jpg')
files=sorted((p/'snapshots').glob('op-*-mid.png'))
for a in range(0,len(files),12):
 sheet=Image.new('RGB',(1120,1575),'#ddd');draw=ImageDraw.Draw(sheet)
 for j,f in enumerate(files[a:a+12]):
  im=Image.open(f);im.thumbnail((270,480));x=j%4*280;y=j//4*525;sheet.paste(im,(x,y+25));draw.text((x+5,y+5),f.stem,fill='black')
 sheet.save(p/f'snapshots/operations-{a//12}.jpg')
reading={0:'Read the four language names while narrator poses the shared question.',1:'Narration first defines what a sensor does before the three jobs open.',3:'Read capacity and current count; distinction is more important than decorative motion.',4:'Read the bounds check while narration explains responsibility.',7:'Compare library and result before the tradeoff conclusion.',8:'Distinguish speed claim from actual cross-language call; never draw fake benchmark bars.',10:'Read definition of browser during its explicit explanation.',12:'Retain full pipeline while qualification says this is only one possible arrangement.',13:'Compare the two labeled languages and historical relation; no false type-inheritance diagram.',14:'Read class/state/behavior grouping before instances are created.',16:'Read the two named resource constraints; no invented resource usage gauge.',17:'Read kernel containment and its two responsibilities.',18:'Inspect the existing foundation while narrator explains replacement tradeoff.',21:'Inspect domain overlap and the MicroPython qualification.',22:'Read responsibility/takeaway following the data trace.',23:'Keep final rule visible during final explanation.'}
rows=[];start=0
for i,sec in enumerate(tm['sections']):
 end=start+sec['duration']+.5
 ops=[o for o in q['ops'] if o['start']<end and o['end']>start]
 disclosure=[r for r in q['reveals'] if start<=r['t']<end]
 times=sorted(set([start,end]+[r['t'] for r in disclosure]+[max(start,o['start']) for o in ops]+[min(end,o['end']) for o in ops]))
 gaps=[{'start':round(a,3),'end':round(b,3),'duration':round(b-a,3)} for a,b in zip(times,times[1:]) if b-a>3]
 rows.append({'section':sec['id'],'start':round(start,3),'end':round(end,3),'nativeOperations':ops,'contentDisclosures':disclosure,'gapsOver3Seconds':gaps,'readingReason':reading.get(i) if gaps else None})
 start=end
report={'duration':round(start,3),'narrationSections':len(rows),'renderer':'project-specific native DOM/SVG + GSAP','stockAuditLimitation':'script scenes have no stock events; stock motion-audit.json cannot assess custom renderer','operationCount':len(q['ops']),'emphasisCount':len(q['emphasis']),'emphasis':q['emphasis'],'sections':rows,'settledFrameMinContrast':min(r['minContrast'] for r in q['reports']),'overflowFindings':sum(len(r['overflow']) for r in q['reports']),'contrastFindings':sum(len(r['contrast']) for r in q['reports']),'revealFailures':q['revealFailures'],'reverseSeek':q['reverseSeek'],'audioReview':'All clips transcribed locally using faster-whisper small; matching word starts refine timing. ASR does not certify pronunciation or replace human listening.'}
(p/'custom-motion-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ('sections','emphasis')},ensure_ascii=False,indent=2))
