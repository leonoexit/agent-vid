import sys,pathlib,unittest
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[2]/'scripts'))
from motion_audit import audit_custom
class CustomMotion(unittest.TestCase):
 def plan(self):return {'sections':[{'id':'a','start':0,'dur':4},{'id':'b','start':4,'dur':4}]}
 def op(self,a,b,kind):return dict(id='object',start=a,end=b,kind=kind,job='fixture operation')
 def test_reframes_and_text_cannot_clear_stillness(self):
  r=audit_custom(self.plan(),[self.op(0,8,k) for k in ['chrome','disclosure','attention','reframe']])
  self.assertEqual(r['globalModelStillIntervals'],[[0,8]])
 def test_gap_crosses_scene_boundary(self):
  r=audit_custom(self.plan(),[self.op(0,2,'model'),self.op(6,8,'model')])
  self.assertEqual(r['globalModelStillIntervals'],[[2,6]])
  self.assertEqual(r['sections'][0]['modelStillIntervals'],[])
 def test_overlapping_and_cross_boundary_operations_merge(self):
  r=audit_custom(self.plan(),[self.op(1,5,'model'),self.op(4,7,'model')])
  self.assertEqual(r['globalModelStillIntervals'],[])
 def test_invalid_intervals_rejected(self):
  for a,b in [(3,2),(0,float('nan'))]:
   with self.assertRaises(ValueError):audit_custom(self.plan(),[self.op(a,b,'model')])
if __name__=='__main__':unittest.main()
