import importlib.util
import json
from pathlib import Path
import tempfile
import subprocess
import sys
import unittest
from PIL import Image
spec=importlib.util.spec_from_file_location('pa',Path(__file__).resolve().parents[1]/'pop-assets.py')
pa=importlib.util.module_from_spec(spec);spec.loader.exec_module(pa)
class LibraryTest(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);self.lib=self.root/'library';self.im=self.root/'input.png';Image.new('RGBA',(64,48),(80,40,160,100)).save(self.im)
  self.meta={'id':'test-computer','name':'Máy tính','family':'computer','category':'object','description':'Máy nhận tệp','tags':['máy tính','computer'],'roles':['lưu trữ'],'states':['blank-screen'],'origin':{'kind':'generated','tool':'test','prompt':'exact test prompt'},'rights':{'note':'test fixture'}}
 def tearDown(self):self.tmp.cleanup()
 def register(self):return pa.register(self.lib,self.im,self.meta)
 def test_search_accents_roles_and_original_bytes(self):
  self.register();self.assertEqual(pa.search(self.lib,'may tinh')[0]['id'],'test-computer');self.assertEqual(len(pa.search(self.lib,'lưu trữ')),1);self.assertEqual(pa.digest(self.im),pa.get(self.lib,'test-computer')['sha256']);self.assertTrue(pa.validate(self.lib)['valid'])
 def test_no_overwrite_or_duplicate(self):
  self.register()
  with self.assertRaises(ValueError):self.register()
  self.meta['id']='duplicate'
  with self.assertRaisesRegex(ValueError,'Identical bytes'):self.register()
  self.assertEqual(len(pa.catalog(self.lib)['assets']),1)
 def test_variant_must_exist_and_share_family(self):
  self.register();Image.new('RGBA',(64,48),(255,0,0,80)).save(self.im);self.meta.update(id='variant',variant_of='test-computer',family='other')
  with self.assertRaises(ValueError):self.register()
  self.meta['family']='computer';self.register();self.assertEqual(pa.get(self.lib,'variant')['variant_of'],'test-computer')
 def test_project_copy_is_independent_and_provenance_kept(self):
  self.register();project=self.root/'project';project.mkdir();e=pa.use(self.lib,'test-computer',project,'test');copy=project/e['file'];self.assertEqual(pa.digest(copy),pa.digest(self.im));self.assertEqual(json.loads((project/e['metadata']).read_text())['origin']['prompt'],'exact test prompt')
  copy.write_bytes(b'changed')
  with self.assertRaisesRegex(ValueError,'overwrite'):pa.use(self.lib,'test-computer',project,'test')
  self.assertTrue(pa.validate(self.lib)['valid'])
 def test_rejected_is_not_reused(self):
  self.register();pa.review(self.lib,'test-computer','rejected','explicit fixture');self.assertEqual(pa.search(self.lib,'computer'),[]);p=self.root/'p';p.mkdir()
  with self.assertRaises(ValueError):pa.use(self.lib,'test-computer',p,'test')
 def test_record_idempotent_and_requires_actual_selection(self):
  self.register();p=self.root/'p';p.mkdir();pa.use(self.lib,'test-computer',p,'test');render=p/'final.mp4';render.write_bytes(b'fixture')
  with self.assertRaises(ValueError):pa.record(self.lib,p,render,[])
  with self.assertRaises(ValueError):pa.record(self.lib,p,render,['missing'])
  pa.record(self.lib,p,render,['test-computer']);pa.record(self.lib,p,render,['test-computer']);self.assertEqual(len(pa.read(self.lib/'usage.json')['videos']),1)
 def test_source_and_safe_geometry_validation(self):
  self.meta['origin']={'kind':'photo','source_url':'https://example.com'}
  with self.assertRaises(ValueError):self.register()
  self.meta['origin']={'kind':'generated','tool':'test','prompt':'exact'};self.meta['safe_text_rect']=[30,0,50,10]
  with self.assertRaises(ValueError):self.register()
 def test_tamper_and_path_escape(self):
  self.register();a=pa.get(self.lib,'test-computer');(self.lib/a['file']).write_bytes(b'bad')
  with self.assertRaises(ValueError):pa.validate(self.lib)
  with self.assertRaises(ValueError):pa.inside(self.lib,'../elsewhere')
 def test_parallel_registration_keeps_both_records(self):
  meta1=self.root/'one.json';meta1.write_text(json.dumps(self.meta));second={**self.meta,'id':'second'};meta2=self.root/'two.json';meta2.write_text(json.dumps(second));im2=self.root/'second.png';Image.new('RGBA',(32,32),(1,2,3,100)).save(im2)
  cli=str(Path(pa.__file__));jobs=[subprocess.Popen([sys.executable,cli,'--library',str(self.lib),'register','--image',str(im),'--metadata',str(meta)],stdout=subprocess.PIPE,stderr=subprocess.PIPE) for im,meta in [(self.im,meta1),(im2,meta2)]]
  for job in jobs:
   out,err=job.communicate(timeout=15);self.assertEqual(job.returncode,0,err.decode())
  self.assertEqual(len(pa.catalog(self.lib)['assets']),2);self.assertTrue(pa.validate(self.lib)['valid'])
 def test_gallery_embeds_safe_data(self):
  self.meta['description']='</script><script>alert(1)</script>';self.register();pa.gallery(self.lib);s=(self.lib/'index.html').read_text();self.assertNotIn(self.meta['description'],s);self.assertIn('\\u003c/script>',s)
if __name__=='__main__':unittest.main()
