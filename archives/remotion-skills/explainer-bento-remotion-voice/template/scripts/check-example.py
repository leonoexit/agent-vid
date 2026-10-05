"""Executable evidence for this concrete demo; replace with the model for a new topic."""
import json
from pathlib import Path
s=json.loads(Path('script.json').read_text());a=s['example']['values'];target=s['example']['target']
assert a==sorted(a)
lo,hi=0,len(a)-1;steps=[]
while lo<=hi:
 mid=(lo+hi)//2;steps.append({'left':lo,'right':hi,'mid':mid,'value':a[mid],'remaining':hi-lo+1})
 if a[mid]==target:break
 if a[mid]<target:lo=mid+1
 else:hi=mid-1
assert [step['value'] for step in steps]==[18,31,24]
assert [step['remaining'] for step in steps]==[8,4,1]
assert mid==4 and a[mid]==24
Path('example-results.json').write_text(json.dumps({'steps':steps,'index':mid,'ordinal':mid+1},indent=2)+'\n')
print('Verified: 18 → 31 → 24; 8 → 4 → 1 candidates; index 4, fifth cell.')
