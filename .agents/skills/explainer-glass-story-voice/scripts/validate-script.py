"""Validate story identities, motion cues, geometry and renderable content."""
import argparse,json,math,pathlib,re,sys,unicodedata
KINDS={'box','ticket','card','reader'}
ACTIONS={'show','hide','open','focus','spotlight','pulse','set','morph','move','transfer','write','connect','code'}
FIELDS={'label':25,'value':14,'detail':40,'address':20}
def tokens(s):return re.findall(r'[^\W_]+',unicodedata.normalize('NFC',str(s)).lower())
def validate(s):
 errors=[]
 def fail(path,reason):errors.append(f'{path}: {reason}')
 def string(v,path,limit,empty=False):
  if not isinstance(v,str) or (not empty and not v.strip()):fail(path,'expected text')
  elif len(v)>limit:fail(path,f'limit {limit} characters')
 def number(v,path,lo,hi):
  if not isinstance(v,(int,float)) or isinstance(v,bool) or not math.isfinite(v) or not lo<=v<=hi:fail(path,f'expected {lo}–{hi}')
 def listing(v,path,lo,hi):
  if not isinstance(v,list) or not lo<=len(v)<=hi:fail(path,f'expected {lo}–{hi} items');return []
  return v
 if s.get('language') not in ('vi','en','mixed'):fail('language','choose vi/en/mixed')
 string(s.get('title'),'title',60)
 nodes={};positions={}
 for i,n in enumerate(listing(s.get('entities'),'entities',1,6)):
  path=f'entity {i+1}'
  if not isinstance(n,dict):fail(path,'expected object');continue
  string(n.get('id'),path+'.id',30)
  if not isinstance(n.get('id'),str):continue
  if n['id'] in nodes:fail(path,'duplicate ID')
  nodes[n['id']]=n
  if not isinstance(n.get('kind'),str) or n['kind'] not in KINDS:fail(path,'unknown kind')
  for field,limit in FIELDS.items():
   if field in n or field in ('label','value'):string(n.get(field),path+'.'+field,limit,field in ('detail','address'))
  for field,limit in {'x':860,'y':570,'width':860,'height':570}.items():number(n.get(field),path+'.'+field,0 if field in ('x','y') else 120,limit)
  if all(isinstance(n.get(k),(int,float)) for k in ('x','y','width','height')):
   if n['x']+n['width']>860 or n['y']+n['height']>570:fail(path,'outside the 860×570 visual area')
   positions[n['id']]={'x':n['x'],'y':n['y'],'width':n['width'],'height':n['height']}
   if 'image' in n:
    string(n['image'],path+'.image',180)
    if isinstance(n['image'],str) and (not n['image'].startswith('assets/illustrations/') or '..' in pathlib.PurePosixPath(n['image']).parts or '\\' in n['image']):fail(path,'use a local assets/illustrations/ path')
 stickers=s.get('stickers',[])
 if not isinstance(stickers,list):
  fail('stickers','expected a list');stickers=[]
 elif len(stickers)>12:
  fail('stickers','expected 0–12 items')
 for i,st in enumerate(stickers):
  path=f'sticker {i+1}'
  if not isinstance(st,dict):fail(path,'expected object');continue
  string(st.get('id'),path+'.id',30)
  string(st.get('image'),path+'.image',180)
  string(st.get('alt'),path+'.alt',120)
  if isinstance(st.get('image'),str) and (not st['image'].startswith('assets/illustrations/') or '..' in pathlib.PurePosixPath(st['image']).parts or '\\' in st['image']):fail(path,'use a local assets/illustrations/ path')
  for field,limit in {'x':860,'y':570,'width':300,'height':300}.items():number(st.get(field),path+'.'+field,0 if field in ('x','y') else 24,limit)
  if all(isinstance(st.get(k),(int,float)) for k in ('x','y','width','height')) and (st['x']+st['width']>860 or st['y']+st['height']>570):fail(path,'outside the 860×570 visual area')
  if 'rotation' in st:number(st['rotation'],path+'.rotation',-30,30)
  if 'scenes' in st:
   scenes=st['scenes']
   if not isinstance(scenes,list) or not 1<=len(scenes)<=12 or any(not isinstance(n,int) or isinstance(n,bool) or not 1<=n<=12 for n in scenes):fail(path+'.scenes','use unique 1-based scene numbers')
   elif len(set(scenes))!=len(scenes):fail(path+'.scenes','use unique 1-based scene numbers')
 for key in ('intro','outro'):
  content=s.get(key)
  if not isinstance(content,dict):fail(key,'expected object');continue
  for field,limit in {'title':45,'subtitle':90,'note':120,'vo':1200}.items():string(content.get(field),key+'.'+field,limit)
  for j,t in enumerate(listing(content.get('tiles'),key+'.tiles',2,2)):
   if not isinstance(t,dict):fail(key+'.tiles','expected object');continue
   string(t.get('value'),f'{key}.tiles[{j}].value',8);string(t.get('label'),f'{key}.tiles[{j}].label',24)
  if 'hold' in content:number(content['hold'],key+'.hold',0,6)
 for i,sc in enumerate(listing(s.get('scenes'),'scenes',1,12)):
  path=f'scene {i+1}'
  if not isinstance(sc,dict):fail(path,'expected object');continue
  for field,limit in {'title':52,'subtitle':100,'vo':1500,'after':100}.items():
   if field in sc or field in ('title','vo'):string(sc.get(field),path+'.'+field,limit)
  if 'hold' in sc:number(sc['hold'],path+'.hold',0,6)
  def anchor(e,ep):
   if ('on' in e)==('at' in e):fail(ep,'choose exactly one of on/at');return
   if 'at' in e:number(e['at'],ep+'.at',0,120);return
   string(e['on'],ep+'.on',120)
   n=e.get('occurrence',1)
   if not isinstance(n,int) or isinstance(n,bool) or n<1:fail(ep,'occurrence must be a positive integer');return
   target,vo=tokens(e['on']),tokens(sc.get('vo',''))
   if not target or sum(vo[j:j+len(target)]==target for j in range(len(vo)-len(target)+1))<n:fail(ep,'spoken phrase/occurrence missing from vo')
  if 'afterOn' in sc:anchor({'on':sc['afterOn']},path+'.afterOn')
  for j,e in enumerate(listing(sc.get('events',[]),path+'.events',0,12)):
   ep=f'{path}.events[{j}]'
   if not isinstance(e,dict):fail(ep,'expected object');continue
   anchor(e,ep);kind=e.get('type')
   if not isinstance(kind,str) or kind not in ACTIONS:fail(ep,'unknown action');continue
   keys=['target'] if kind in {'show','hide','open','set','morph','move','pulse'} else ['from','to'] if kind in {'transfer','connect'} else ['to'] if kind=='write' else []
   for key in keys:
    if not isinstance(e.get(key),str) or e[key] not in nodes:fail(ep,'unknown '+key+' entity')
   if kind=='open' and isinstance(e.get('target'),str) and nodes.get(e['target'],{}).get('kind')!='box':fail(ep,'open requires a box')
   if kind=='focus':
    for target in listing(e.get('targets'),ep+'.targets',0,6):
     if not isinstance(target,str) or target not in nodes:fail(ep,'unknown focus entity')
   if kind=='spotlight':
    for target in listing(e.get('targets'),ep+'.targets',1,6):
     if not isinstance(target,str) or target not in nodes:fail(ep,'unknown spotlight entity')
    if 'dim' in e:number(e['dim'],ep+'.dim',.1,.8)
   if kind=='pulse':
    if 'scale' in e:number(e['scale'],ep+'.scale',1.01,1.2)
    if 'duration' in e:number(e['duration'],ep+'.duration',.2,1.2)
   if kind in {'set','morph'}:
    for field,limit in FIELDS.items():
     if field in e:string(e[field],ep+'.'+field,limit,field in ('detail','address'))
   if kind in {'transfer','write'}:
    string(e.get('value'),ep+'.value',14)
    if 'duration' in e:number(e['duration'],ep+'.duration',.4,2.5)
    if e.get('field','value') not in ('value','address'):fail(ep,'field must be value or address')
    if not isinstance(e.get('commitField','value'),str) or e.get('commitField','value') not in FIELDS:fail(ep,'invalid commitField')
   if kind=='code':
    lines=listing(e.get('lines'),ep+'.lines',1,3)
    for line in lines:string(line,ep+'.line',40)
    if 'active' in e:
     if not isinstance(e['active'],int) or isinstance(e['active'],bool) or not 0<=e['active']<len(lines):fail(ep,'active must be an existing integer line index')
   if kind=='move':
    number(e.get('x'),ep+'.x',0,860);number(e.get('y'),ep+'.y',0,570)
    pos=positions.get(e.get('target')) if isinstance(e.get('target'),str) else None
    if pos and all(isinstance(e.get(k),(int,float)) for k in ('x','y')):
     if e['x']+pos['width']>860 or e['y']+pos['height']>570:fail(ep,'move leaves visual area')
 return errors

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--project',required=True,type=pathlib.Path);a=p.parse_args()
 try:s=json.loads((a.project/'script.json').read_text(encoding='utf-8-sig'))
 except (ValueError,OSError) as e:p.exit(1,str(e)+'\n')
 if not isinstance(s,dict):p.exit(1,'script.json must be an object\n')
 errors=validate(s)
 for n in s.get('entities',[]) if isinstance(s.get('entities'),list) else []:
  if isinstance(n,dict) and isinstance(n.get('image'),str) and not (a.project/n['image']).is_file():errors.append('Missing illustration: '+n['image'])
 for st in s.get('stickers',[]) if isinstance(s.get('stickers'),list) else []:
  if isinstance(st,dict) and isinstance(st.get('image'),str) and not (a.project/st['image']).is_file():errors.append('Missing sticker: '+st['image'])
 for e in errors:print('x',e)
 print('OK' if not errors else f'{len(errors)} problem(s)');sys.exit(bool(errors))
if __name__=='__main__':main()
