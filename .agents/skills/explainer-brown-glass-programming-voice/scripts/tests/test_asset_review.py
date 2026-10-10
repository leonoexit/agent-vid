import importlib.util,pathlib,types,unittest
from unittest.mock import patch
ROOT=pathlib.Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('asset_review',ROOT/'scripts/asset-library.py');a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)
class AssetReview(unittest.TestCase):
 def test_rejected_asset_cannot_be_recommended(self):
  asset=dict(id='rejected',review={'status':'rejected'})
  args=types.SimpleNamespace(project=None,query='robot',role='sticker',state='curious',action=[],subject=None,importance='support',limit=5)
  with patch.object(a,'catalogue',return_value={'assets':[asset]}),patch.object(a,'read_json',return_value={'videos':[]}),patch.object(a,'emit') as emit:
   a.select(args)
  self.assertEqual(emit.call_args[0][0]['candidates'],[])
 def test_direct_install_cannot_bypass_rejection(self):
  asset=dict(id='rejected',review={'status':'rejected'})
  with patch.object(a,'catalogue',return_value={'assets':[asset]}):
   for fn in (a.install,a.install_sticker):
    with self.subTest(fn=fn.__name__),self.assertRaisesRegex(ValueError,'rejected by user'):
     fn(types.SimpleNamespace(asset='rejected'))
 def test_variant_request_cannot_recycle_rejected_parent(self):
  args=types.SimpleNamespace(project=ROOT,variant_of='rejected')
  with patch.object(a,'catalogue',return_value={'assets':[dict(id='rejected',review={'status':'rejected'})]}),self.assertRaisesRegex(ValueError,'rejected by user'):
   a.request(args)
 def test_unreviewed_assets_do_not_require_approval(self):a.ensure_eligible({'id':'new'})
if __name__=='__main__':unittest.main()
