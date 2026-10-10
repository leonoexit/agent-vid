"""Validate Mint Bento voice sections and exact phrase anchors; not arbitrary project JS semantics."""
import argparse,json,pathlib,re,unicodedata,math

def tokens(s):return re.findall(r'[^\W_]+',unicodedata.normalize('NFC',str(s)).lower())
def validate(s):
 errors=[]
 def text(value,path):
  if not isinstance(value,str) or not value.strip():errors.append(path+': expected nonempty text')
 if not isinstance(s,dict):return ['script must be an object']
 if s.get('language') not in ('vi','en'):errors.append('language: choose vi/en')
 for key in ('title','audience'):text(s.get(key),key)
 brief=s.get('story',{})
 if not isinstance(brief,dict):errors.append('story must be an object')
 else:
  for key in ('question','example','takeaway'):text(brief.get(key),'story.'+key)
 scenes=s.get('scenes')
 if not isinstance(scenes,list) or not scenes:errors.append('scenes must be a nonempty list');scenes=[]
 for name,c in [('intro',s.get('intro'))]+[(f'scene-{i+1}',c) for i,c in enumerate(scenes)]+[('outro',s.get('outro'))]:
  if not isinstance(c,dict):errors.append(name+': expected object');continue
  for key in ('title','vo'):text(c.get(key),name+'.'+key)
  if 'hold' in c and (isinstance(c['hold'],bool) or not isinstance(c['hold'],(int,float)) or not math.isfinite(c['hold']) or not 0<=c['hold']<=6):errors.append(name+'.hold: expected seconds 0–6')
  cues=c.get('cues',{})
  if not isinstance(cues,dict):errors.append(name+'.cues: expected object');continue
  source=tokens(c.get('vo',''))
  for key,q in cues.items():
   if isinstance(q,str):q={'on':q}
   if not isinstance(q,dict):errors.append(name+'.cues.'+key+': expected phrase or object');continue
   needle=tokens(q.get('on',''));occ=q.get('occurrence',1)
   if not isinstance(q.get('on'),str) or not needle or not isinstance(occ,int) or isinstance(occ,bool) or occ<1 or sum(source[i:i+len(needle)]==needle for i in range(len(source)-len(needle)+1))<occ:errors.append(name+'.cues.'+key+': spoken phrase/occurrence missing')
 return errors

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--project',required=True,type=pathlib.Path);a=p.parse_args();errors=validate(json.loads((a.project/'script.json').read_text()))
 print('\n'.join(errors) if errors else 'OK: sections and spoken cues');raise SystemExit(bool(errors))
if __name__=='__main__':main()
