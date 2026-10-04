import importlib.util,json,pathlib,tempfile,types,unittest,zlib,struct,hashlib
from unittest.mock import patch
ROOT=pathlib.Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('plates',ROOT/'scripts/asset-library.py');a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)
def png(alpha=False):
 def chunk(k,d):return struct.pack('>I',len(d))+k+d+struct.pack('>I',zlib.crc32(k+d))
 return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',1,1,8,6 if alpha else 2,0,0,0))+chunk(b'IDAT',zlib.compress(b'\0'+(b'\xff\0\0\0' if alpha else b'\xff\0\0')))+chunk(b'IEND',b'')
class Plates(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.base=pathlib.Path(self.tmp.name);self.lib=self.base/'library';self.project=self.base/'project';self.project.mkdir();self.script={'title':'Test','entities':[],'scenes':[]};(self.project/'script.json').write_text(json.dumps(self.script));self.patch=patch.object(a,'LIBRARY',self.lib);self.patch.start();self.output=patch.object(a,'emit');self.output.start()
 def tearDown(self):self.output.stop();self.patch.stop();self.tmp.cleanup()
 def register(self,alpha=False,background='opaque'):
  meta={'id':'sample','family':'sample','style':a.STYLE['id'],'role':'plate','subjects':['chip'],'states':['still'],'capabilities':['crop'],'tags':['compiler'],'description':'Compiler analogy','background':background,'origin':{'kind':'imagegen','tool':'built-in image_gen','prompt':'Exact original prompt'}}
  self.image=self.base/'image.png';self.image.write_bytes(png(alpha));m=self.base/'meta.json';m.write_text(json.dumps(meta));a.register(types.SimpleNamespace(image=self.image,metadata=m))
 def install(self):a.install_plate(types.SimpleNamespace(project=self.project,asset='sample',plate_id='hero',reason='opening'))
 def test_opaque_roundtrip_is_portable_and_preserves_prompt(self):
  self.register();before=(self.project/'script.json').read_bytes();self.install();self.assertEqual(before,(self.project/'script.json').read_bytes());m=json.loads((self.project/'asset-manifest.json').read_text());self.assertEqual(m['assets'][0]['origin']['prompt'],'Exact original prompt');p=json.loads((self.project/'plates.json').read_text())['plates'][0];self.assertFalse(pathlib.Path(p['image']).is_absolute());self.assertEqual((self.project/p['image']).read_bytes(),self.image.read_bytes())
 def test_new_request_is_background_and_keeps_provenance(self):
  args=types.SimpleNamespace(project=self.project,id='quiet-paper',family=None,subject='compiler lesson',role='plate',state='quiet',operation='reserve center for native diagram',tag=[],background='opaque',variant_of=None,change='')
  a.request(args)
  spec=json.loads((self.project/'asset-requests/quiet-paper.json').read_text())
  self.assertEqual(spec['usage'],'abstract-background')
  self.assertEqual(spec['subjects'],['compiler lesson'])
  self.assertIn(a.STYLE['prompt'],spec['origin']['prompt'])
  self.assertIn(args.operation,spec['origin']['prompt'])
 def test_legacy_plate_does_not_get_reclassified(self):
  self.register();self.install()
  p=json.loads((self.project/'plates.json').read_text())['plates'][0]
  self.assertEqual(p['usage'],'legacy-unspecified')
 def test_selection_skips_legacy_unless_explicitly_requested(self):
  self.register()
  args=types.SimpleNamespace(project=self.project,query='',role='plate',state='still',action=[],subject=None,importance='support',limit=5,include_legacy=False)
  a.select(args);self.assertEqual(a.emit.call_args[0][0]['candidates'],[])
  args.include_legacy=True;a.select(args)
  self.assertEqual([c['id'] for c in a.emit.call_args[0][0]['candidates']],['sample'])
 def test_duplicate_plate_does_not_change_manifest(self):
  self.register();self.install();before=(self.project/'asset-manifest.json').read_bytes()
  with self.assertRaisesRegex(ValueError,'already installed'):self.install()
  self.assertEqual(before,(self.project/'asset-manifest.json').read_bytes())
 def test_corrupt_library_rejected(self):
  self.register();(self.lib/'sample/image.png').write_bytes(b'broken')
  with self.assertRaisesRegex(ValueError,'hash'):self.install()
 def test_transparent_request_requires_alpha(self):
  with self.assertRaisesRegex(ValueError,'alpha'):self.register(False,'transparent')
 def test_transparent_roundtrip_preserves_alpha(self):
  self.register(True,'transparent');self.install();meta=json.loads((self.lib/'sample/metadata.json').read_text());self.assertTrue(meta['alpha_channel']);self.assertEqual(meta['background'],'transparent')
 def test_unshown_plate_does_not_count_as_used(self):
  self.register();self.install()
  with self.assertRaisesRegex(ValueError,'No installed'):a.record(types.SimpleNamespace(project=self.project))
  (self.project/'plate-usage.json').write_text('{"plates":["hero"]}');a.record(types.SimpleNamespace(project=self.project));history=json.loads((self.lib/'usage.json').read_text());self.assertEqual(history['videos'][0]['asset_ids'],['sample'])
  a.record(types.SimpleNamespace(project=self.project));self.assertEqual(len(json.loads((self.lib/'usage.json').read_text())['videos']),1)
if __name__=='__main__':unittest.main()
