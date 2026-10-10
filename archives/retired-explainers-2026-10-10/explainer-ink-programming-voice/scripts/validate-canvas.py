"""Validate Ink's persistent-paper contract; runtime also checks resolved cue times."""
import math,re

def validate_canvas(C,sections,cue,image_path):
 errors=[]
 def fail(p,m):errors.append(f'canvas.{p}: {m}')
 def number(v):return not isinstance(v,bool) and isinstance(v,(int,float)) and math.isfinite(v)
 def text(v):return isinstance(v,str) and bool(v.strip())
 if not isinstance(C,dict):return ['canvas: expected object']
 for k in ('width','height'):
  if not number(C.get(k)) or not 1080<=C[k]<=10000:fail(k,'expected finite world size 1080–10000')
 items=C.get('items');ids={}
 if not isinstance(items,list) or not items:return errors+['canvas.items: expected nonempty list']
 for i,n in enumerate(items):
  p=f'items[{i}]'
  if not isinstance(n,dict):fail(p,'expected object');continue
  ident=n.get('id')
  if not text(ident) or not re.fullmatch('[a-z][a-z0-9-]*',ident) or ident in ids:fail(p+'.id','expected unique identifier');continue
  ids[ident]=n
  if n.get('type') not in ('card','text','image'):fail(p+'.type','choose card/text/image')
  for k in ('x','y','w','h'):
   if not number(n.get(k)) or n[k]<(1 if k in ('w','h') else 0):fail(p+'.'+k,'invalid geometry')
  if all(number(n.get(k)) for k in ('x','y','w','h')) and number(C.get('width')) and number(C.get('height')):
   if n['x']+n['w']>C['width'] or n['y']+n['h']>C['height']:fail(p,'item outside world')
  for k in (('label','value') if n.get('type')=='card' else ('text',) if n.get('type')=='text' else ('alt',)):
   if not text(n.get(k)):fail(p+'.'+k,'expected nonempty text')
  if n.get('type')=='image':image_path(n.get('src'),'canvas.'+p+'.src')
  if 'fontSize' in n and (not number(n['fontSize']) or not 28<=n['fontSize']<=180):fail(p+'.fontSize','expected 28–180')
 links=C.get('links',[])
 if not isinstance(links,list):fail('links','expected list');links=[]
 for i,n in enumerate(links):
  p=f'links[{i}]'
  if not isinstance(n,dict):fail(p,'expected object');continue
  ident=n.get('id')
  if not text(ident) or ident in ids:fail(p+'.id','expected unique identifier');continue
  for k in ('from','to'):
   if not isinstance(n.get(k),str) or n[k] not in ids or ids[n[k]].get('type') not in ('card','text','image'):fail(p+'.'+k,'unknown item')
  if n.get('from')==n.get('to'):fail(p,'self-link unsupported')
  ids[ident]={'type':'link'}
 for group in ('events','camera'):
  entries=C.get(group)
  if not isinstance(entries,list) or not entries:fail(group,'expected nonempty list');continue
  for i,e in enumerate(entries):
   p=f'{group}[{i}]'
   if not isinstance(e,dict):fail(p,'expected object');continue
   section=e.get('section')
   if not isinstance(section,str) or section not in sections:fail(p+'.section','unknown section')
   else:cue(e,'canvas.'+p,sections[section]['vo'])
   if group=='camera':
    for k in ('cx','cy','scale','duration'):
     if k=='duration' and k not in e:continue
     if not number(e.get(k)):fail(p+'.'+k,'expected finite number')
    if number(e.get('scale')) and not .2<=e['scale']<=2:fail(p+'.scale','expected .2–2')
    if number(e.get('duration')) and not 0<=e['duration']<=3:fail(p+'.duration','expected 0–3')
   else:
    target=e.get('target');node=ids.get(target) if isinstance(target,str) else None;action=e.get('action')
    if not node:fail(p+'.target','unknown target');continue
    if action not in ('reveal','write','update','focus','draw','circle','clear','dim'):fail(p+'.action','unsupported action')
    if action in ('draw','dim') and node['type']!='link':fail(p,'draw needs a link')
    if action in ('focus','update') and node['type']!='card':fail(p,'focus/update needs a card')
    if action=='write' and node['type'] not in ('text','card'):fail(p,'write needs text or card label')
    if action in ('circle','reveal') and node['type']=='link':fail(p,'expected an item')
    if action=='update' and not text(e.get('value')):fail(p+'.value','expected nonempty text')
    if 'handwrite' in e and not isinstance(e['handwrite'],bool):fail(p+'.handwrite','expected boolean')
    if 'hand' in e and not isinstance(e['hand'],bool):fail(p+'.hand','expected boolean')
    if 'duration' in e and (not number(e['duration']) or not .18<=e['duration']<=2.4):fail(p+'.duration','expected .18–2.4')
 camera=C.get('camera')
 if isinstance(camera,list) and camera and isinstance(camera[0],dict):
  if camera[0].get('section')!='intro' or camera[0].get('at')!=0:fail('camera[0]','first key must use intro at 0')
 return errors
