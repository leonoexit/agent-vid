#!/usr/bin/env python3
"""Pop asset library: immutable originals, searchable metadata, project-local copies."""
import argparse
from contextlib import contextmanager
from datetime import datetime, timezone
import hashlib
import html
import json
import os
from pathlib import Path
import re
import shutil
import sys
import tempfile
import time
import unicodedata
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_LIBRARY = ROOT / 'asset-library/pop'
CATEGORIES = ('object', 'paper', 'lettering', 'person')

def now(): return datetime.now(timezone.utc).isoformat()
def read(p, default=None): return json.loads(p.read_text()) if p.exists() else default
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p, data):
    p.parent.mkdir(parents=True, exist_ok=True)
    fd, name = tempfile.mkstemp(dir=p.parent, prefix='.'+p.name)
    try:
        with os.fdopen(fd, 'w') as f: json.dump(data, f, ensure_ascii=False, indent=2); f.write('\n')
        os.replace(name, p)
    finally:
        Path(name).unlink(missing_ok=True)
def norm(s):
    s=unicodedata.normalize('NFKD',s.lower()).replace('đ','d')
    return ' '.join(re.findall(r'[a-z0-9]+',''.join(c for c in s if not unicodedata.combining(c))))
def slug(s):
    if not isinstance(s,str) or not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,95}',s): raise ValueError('Invalid ID/family')
    return s
def inside(root, relative):
    p=(root/relative).resolve()
    if not p.is_relative_to(root.resolve()): raise ValueError('Path escapes its root')
    return p
def catalog(lib): return read(lib/'catalog.json',{'schema':1,'style':'pop-collage','assets':[]})
def get(lib, ident):
    slug(ident)
    a=read(lib/'items'/ident/'metadata.json')
    if not a: raise ValueError('Unknown asset: '+ident)
    return a
@contextmanager
def lock(lib):
    lib.mkdir(parents=True,exist_ok=True); p=lib/'.write.lock'; deadline=time.monotonic()+10
    while True:
        try:
            fd=os.open(p,os.O_CREAT|os.O_EXCL|os.O_WRONLY);os.write(fd,str(os.getpid()).encode());os.close(fd);break
        except FileExistsError:
            if time.monotonic()>deadline: raise ValueError('Library busy; retry. Inspect stale lock before removing.')
            time.sleep(.1)
    try: yield
    finally: p.unlink(missing_ok=True)
def metadata_check(a):
    slug(a.get('id'));slug(a.get('family'))
    if a.get('category') not in CATEGORIES: raise ValueError('Invalid category')
    for key in ['name','description']:
        if not isinstance(a.get(key),str) or not a[key].strip(): raise ValueError('Missing '+key)
    for key in ['tags','roles','states']:
        if not isinstance(a.get(key),list) or not a[key] or any(not isinstance(s,str) or not s.strip() for s in a[key]): raise ValueError('Missing list '+key)
    o=a.get('origin',{})
    if o.get('kind') not in ['generated','photo','unknown']: raise ValueError('Invalid origin kind')
    if o['kind']=='generated' and (not o.get('prompt') or not o.get('tool')): raise ValueError('Generated asset needs exact prompt and tool')
    if o['kind']=='photo' and any(not o.get(k) for k in ['source_url','author','license']): raise ValueError('Photo needs source, author and license')
    if not isinstance(a.get('rights'),dict) or not a['rights'].get('note'): raise ValueError('Record rights.note')
    if a.get('review',{}).get('status','unreviewed') not in ['unreviewed','usable','rejected']: raise ValueError('Invalid review status')
def register(lib, image, metadata):
    a=json.loads(json.dumps(metadata));metadata_check(a)
    ext=image.suffix.lower()
    if ext not in ['.png','.jpg','.jpeg','.webp']: raise ValueError('Use PNG/JPEG/WebP raster')
    sha=digest(image)
    with Image.open(image) as im:
        im.load(); w,h=im.size; alpha=im.convert('RGBA').getchannel('A'); bbox=alpha.getbbox()
        if not bbox: raise ValueError('Image is entirely transparent')
        transparent=alpha.getextrema()[0]<255
        for key in ['safe_text_rect','visible_bounds']:
            if a.get(key):
                x,y,rw,rh=a[key]
                if min(x,y)<0 or min(rw,rh)<=0 or x+rw>w or y+rh>h: raise ValueError('Invalid '+key)
        thumb=im.convert('RGBA');thumb.thumbnail((480,480))
    with lock(lib):
        cat=catalog(lib)
        if any(x['id']==a['id'] for x in cat['assets']): raise ValueError('ID exists; register a new revision')
        duplicate=next((x['id'] for x in cat['assets'] if x['sha256']==sha),None)
        if duplicate: raise ValueError('Identical bytes already registered: '+duplicate)
        if a.get('variant_of'):
            parent=get(lib,a['variant_of'])
            if parent['family']!=a['family']: raise ValueError('Variant must keep parent family')
        a.update(file=f"items/{a['id']}/original{ext}",thumbnail=f"items/{a['id']}/thumbnail.png",sha256=sha,width=w,height=h,has_transparency=transparent,alpha_bounds=[bbox[0],bbox[1],bbox[2]-bbox[0],bbox[3]-bbox[1]],added_at=now())
        a.setdefault('review',{'status':'unreviewed','note':'Not an individual user approval.'})
        folder=lib/'items'/a['id']
        folder.mkdir(parents=True,exist_ok=False)
        try:
            shutil.copyfile(image,lib/a['file']);thumb.save(lib/a['thumbnail']);write(folder/'metadata.json',a)
            cat['assets'].append({k:v for k,v in a.items() if k!='origin'});write(lib/'catalog.json',cat)
        except Exception:
            shutil.rmtree(folder);raise
    return {'registered':a['id'],'file':str(lib/a['file'])}
def search(lib,query='',category=None,family=None,include_rejected=False):
    terms=set(norm(query).split()); out=[]; usage=read(lib/'usage.json',{'videos':[]})['videos']
    for a in catalog(lib)['assets']:
        if not include_rejected and a['review']['status']=='rejected':continue
        if category and a['category']!=category or family and a['family']!=family:continue
        corpus=norm(' '.join([a['id'],a['name'],a['description'],a['family'],*a['tags'],*a['roles'],*a['states']]))
        matches=[t for t in terms if t in corpus.split()]
        if terms and not matches:continue
        uses=[v['project'] for v in usage if any(x['id']==a['id'] for x in v['assets'])]
        out.append({'id':a['id'],'name':a['name'],'category':a['category'],'family':a['family'],'variant_of':a.get('variant_of'),'score':len(matches),'matched':matches,'file':str(lib/a['file']),'thumbnail':str(lib/a['thumbnail']),'review':a['review'],'used_in':uses})
    return sorted(out,key=lambda x:(-x['score'],x['id']))
def use(lib,ident,project,reason):
    project=project.resolve()
    if not project.is_dir():raise ValueError('Project does not exist')
    with lock(lib):
        a=get(lib,ident)
        if a['review']['status']=='rejected':raise ValueError('Rejected asset; choose another or explicitly re-review')
        if a['origin']['kind']=='unknown':raise ValueError('Resolve unknown provenance before reuse')
        src=inside(lib,a['file'])
        if digest(src)!=a['sha256']:raise ValueError('Original changed; do not silently reuse')
        rel=f"assets/library/{ident}-{a['sha256'][:10]}{src.suffix}"
        target=inside(project,rel)
        if target.exists() and digest(target)!=a['sha256']:raise ValueError('Project copy has changed; refusing overwrite')
        target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,target)
        # Snapshot full provenance, including license, prompt and registered text geometry.
        snapshot=target.with_suffix('.asset.json');write(snapshot,a)
        mf=project/'library-assets.json';data=read(mf,{'schema':1,'assets':[]})
        entry={'id':ident,'family':a['family'],'sha256':a['sha256'],'file':rel,'metadata':str(snapshot.relative_to(project)),'reason':reason}
        data['assets']=[x for x in data['assets'] if x['id']!=ident]+[entry];write(mf,data)
    return entry
def record(lib,project,render,ids):
    project=project.resolve();render=render.resolve()
    if not render.is_relative_to(project) or not render.is_file() or render.stat().st_size==0:raise ValueError('Provide a nonempty render inside project')
    mf=read(project/'library-assets.json',{'assets':[]});selected=[]
    if not ids:raise ValueError('Explicit IDs of assets actually used in this render are required')
    with lock(lib):
        for ident in sorted(set(ids)):
            entry=next((x for x in mf['assets'] if x['id']==ident),None)
            if not entry:raise ValueError('Asset not installed: '+ident)
            if digest(inside(project,entry['file']))!=entry['sha256']:raise ValueError('Project copy changed: '+ident)
            selected.append({'id':ident,'sha256':entry['sha256']})
        key=str(project.relative_to(ROOT)) if project.is_relative_to(ROOT) else str(project)
        data=read(lib/'usage.json',{'schema':1,'videos':[]});old=next((v for v in data['videos'] if v['project']==key),{})
        entry={'project':key,'render':str(render.relative_to(project)),'assets':selected,'first_recorded':old.get('first_recorded',now()),'updated_at':now(),'evidence':'Explicit author selection after render; not pixel detection or user approval.'}
        data['videos']=[v for v in data['videos'] if v['project']!=key]+[entry];write(lib/'usage.json',data)
    return entry
def review(lib,ident,status,note):
    with lock(lib):
        a=get(lib,ident);a['review']={'status':status,'note':note,'updated_at':now()};write(lib/'items'/ident/'metadata.json',a)
        c=catalog(lib);c['assets']=[({**x,'review':a['review']} if x['id']==ident else x) for x in c['assets']];write(lib/'catalog.json',c)
    return a['review']
def validate(lib):
    errors=[];c=catalog(lib);seen=set();hashes=set()
    for a in c['assets']:
        try:
            m=get(lib,a['id']);metadata_check(m)
            if a!={k:v for k,v in m.items() if k!='origin'}:raise ValueError('Catalog disagrees with metadata')
            if m['id'] in seen or m['sha256'] in hashes:raise ValueError('Duplicate ID/bytes')
            seen.add(m['id']);hashes.add(m['sha256'])
            if digest(inside(lib,m['file']))!=m['sha256']:raise ValueError('Original hash mismatch')
            if not inside(lib,m['thumbnail']).is_file():raise ValueError('Missing thumbnail')
            if m.get('variant_of') and get(lib,m['variant_of'])['family']!=m['family']:raise ValueError('Variant family mismatch')
        except (ValueError,OSError,KeyError) as e:errors.append({'id':a.get('id'),'error':str(e)})
    if errors:raise ValueError(json.dumps(errors,ensure_ascii=False))
    return {'assets':len(c['assets']),'valid':True}
def gallery(lib):
    # Inline data enables file:// use; escaped JSON prevents embedded metadata from injecting markup.
    with lock(lib):
        assets=[get(lib,x['id']) for x in catalog(lib)['assets']]
        data=json.dumps({'assets':assets,'usage':read(lib/'usage.json',{'videos':[]})['videos']},ensure_ascii=False).replace('<','\\u003c')
        template=(ROOT/'scripts/pop-assets-gallery.html').read_text()
        (lib/'index.html').write_text(template.replace('/*LIBRARY_DATA*/',data))
    return {'gallery':str(lib/'index.html'),'assets':len(assets)}
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--library',type=Path,default=DEFAULT_LIBRARY);sub=p.add_subparsers(dest='command',required=True)
    r=sub.add_parser('register');r.add_argument('--image',type=Path,required=True);r.add_argument('--metadata',type=Path,required=True)
    s=sub.add_parser('search');s.add_argument('query',nargs='?',default='');s.add_argument('--category',choices=CATEGORIES);s.add_argument('--family');s.add_argument('--include-rejected',action='store_true');s.add_argument('--limit',type=int,default=12)
    s=sub.add_parser('show');s.add_argument('id')
    s=sub.add_parser('use');s.add_argument('id');s.add_argument('--project',type=Path,required=True);s.add_argument('--reason',required=True)
    s=sub.add_parser('record');s.add_argument('--project',type=Path,required=True);s.add_argument('--render',type=Path,required=True);s.add_argument('--asset',action='append',required=True)
    s=sub.add_parser('review');s.add_argument('id');s.add_argument('--status',choices=['unreviewed','usable','rejected'],required=True);s.add_argument('--note',required=True)
    sub.add_parser('validate');sub.add_parser('gallery');a=p.parse_args();lib=a.library.resolve()
    if a.command=='register':out=register(lib,a.image,read(a.metadata))
    elif a.command=='search':out={'candidates':search(lib,a.query,a.category,a.family,a.include_rejected)[:a.limit],'note':'Keyword retrieval, not visual or semantic validation. Inspect actual image before use.'}
    elif a.command=='show':out=get(lib,a.id)
    elif a.command=='use':out=use(lib,a.id,a.project,a.reason)
    elif a.command=='record':out=record(lib,a.project,a.render,a.asset)
    elif a.command=='review':out=review(lib,a.id,a.status,a.note)
    elif a.command=='gallery':out=gallery(lib)
    else:out=validate(lib)
    print(json.dumps(out,ensure_ascii=False,indent=2))
if __name__=='__main__':
    try:main()
    except (ValueError,OSError,KeyError) as e:print(str(e),file=sys.stderr);sys.exit(1)
