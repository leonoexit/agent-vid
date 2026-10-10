"""Report content disclosure separately from model changes. This is a script heuristic, not visual certification."""
import argparse
import json
import pathlib
import re
import unicodedata


def tokens(value):
    return re.findall(r'[^\W_]+', unicodedata.normalize('NFC',str(value)).lower())


def resolve(event, section, vo):
    if 'at' in event:
        return section['start'] + event['at']
    words = [(token,w['t0']) for w in section.get('words',[]) for token in tokens(w['w'])]
    if not words:
        parts=tokens(vo)
        words=[(w,section['start']+.65+(section['dur']-2)*i/len(parts)) for i,w in enumerate(parts)]
    needle=tokens(event['on']);occurrence=event.get('occurrence',1)
    for i in range(len(words)-len(needle)+1):
        if [w for w,t in words[i:i+len(needle)]]==needle:
            occurrence-=1
            if not occurrence:return words[i][1]
    raise ValueError(f"{section['id']}: missing phrase {event['on']!r}")


def audit(script,plan,threshold=3.0):
    report={'timingBasis':'word estimates' if any(s.get('words') for s in plan['sections']) else 'text-position preview',
            'thresholdSeconds':threshold,'sections':[],'warnings':[],
            'visualReviewRequired':True,
            'limitations':'Custom SVG, composition and camera changes require visual review; event counts cannot prove dynamism.'}
    content=[script['intro'],*script['scenes'],script['outro']]
    for c,s in zip(content,plan['sections']):
        start,end=s['start'],s['start']+s['dur']
        spans=[(start,start+.9,'heading')]
        model_spans=[];attention=0
        def add(at,duration,kind):spans.append((at,min(end,at+duration),kind))
        for key in ('subtitleOn','afterOn','noteOn','connectorOn'):
            if c.get(key):add(resolve({'on':c[key]},s,c['vo']),.55,key)
        for tile in c.get('tiles',[]):
            if tile.get('on'):add(resolve(tile,s,c['vo']),.55,'tile')
        for e in c.get('events',[]):
            at=resolve(e,s,c['vo']);kind=e['type']
            # Attention and text may help reading, but do not alter the explanatory model.
            if kind in ('focus','spotlight','code-focus','pulse'):attention+=1
            if kind in ('sticker','pulse'):continue
            duration=e.get('duration',1.05) if kind in ('transfer','write') else .85 if kind in ('move','morph','connect') else .45
            add(at,duration,kind)
            model_change=(kind in ('show','hide','open','move','morph','connect','transfer','write')
                or kind=='set' and any(k in e for k in ('value','address'))
                or kind=='reveal' and any(k in e.get('fields',['value']) for k in ('value','address')))
            if model_change:model_spans.append((at,min(end,at+duration),kind))
            if at+duration>end-.1:report['warnings'].append(f"{s['id']}: {kind} finishes at/past the boundary; move its cue earlier.")
            for cue in e.get('lineCues',[]):
                if cue:add(resolve({'on':cue},s,c['vo']),.4,'code-line')
        spans.sort();cursor=start;gaps=[]
        for a,b,kind in spans:
            if a-cursor>threshold:gaps.append([round(cursor,3),round(a,3)])
            cursor=max(cursor,b)
        if end-cursor>threshold:gaps.append([round(cursor,3),round(end,3)])
        if gaps:report['warnings'].append(f"{s['id']}: {len(gaps)} interval(s) over {threshold:g}s without a content disclosure"+(' — reading task: '+c['readTask'] if c.get('readTask') else '.'))
        if s['dur']>8:report['warnings'].append(f"{s['id']}: {s['dur']:.1f}s; consider another shot or staged disclosure.")
        cursor=start;model_gaps=[]
        for a,b,_ in sorted(model_spans):
            if a-cursor>threshold:model_gaps.append([round(cursor,3),round(a,3)])
            cursor=max(cursor,b)
        if end-cursor>threshold:model_gaps.append([round(cursor,3),round(end,3)])
        report['sections'].append({'id':s['id'],'duration':s['dur'],
          'semanticBeats':len(spans), # legacy name; counts content disclosures, not proof of model motion
          'contentBeats':len(spans),'modelChanges':len(model_spans),'attentionCues':attention,
          'modelStillIntervals':model_gaps,'stillIntervals':gaps,
          'sampleTimes':sorted(set(round(min(end-.05,max(start,a)),3) for a,b,k in spans for a in (a-.08,(a+b)/2,b+.08))),
          'readTask':c.get('readTask')})
    run=[]
    for sec in report['sections'][1:-1]+[None]:
        if sec is not None and sec['modelChanges']==0:
            run.append(sec['id']);continue
        if len(run)>=3:
            report['warnings'].append('Text/attention-only run: '+', '.join(run)+
                '. No model operation is declared. Inspect custom visuals or recompose; subtitle/code reveals alone do not establish motion.')
        run=[]
    return report



def uncovered(spans, start, end, threshold):
    cursor = start
    gaps = []
    for a, b in sorted(spans):
        a, b = max(start, a), min(end, b)
        if b < start or a > end:
            continue
        if a - cursor > threshold:
            gaps.append([round(cursor, 3), round(a, 3)])
        cursor = max(cursor, b)
    if end - cursor > threshold:
        gaps.append([round(cursor, 3), round(end, 3)])
    return gaps


def audit_custom(plan, operations, threshold=3.0):
    """Use measured custom timeline spans; a model label still requires visual review."""
    import math
    allowed = {'model', 'reframe', 'disclosure', 'attention', 'chrome'}
    for op in operations:
        if op.get('kind') not in allowed or not op.get('job') or not op.get('id'):
            raise ValueError('Custom operation needs id, kind, and concrete job')
        a, b = op['start'], op['end']
        if not all(isinstance(t, (int, float)) and math.isfinite(t) for t in (a, b)) or b < a:
            raise ValueError('Invalid custom operation interval')
    models = [(o['start'], o['end']) for o in operations if o['kind'] == 'model']
    start = plan['sections'][0]['start']
    end = max(s['start'] + s['dur'] for s in plan['sections'])
    gaps = uncovered(models, start, end, threshold)
    return {
        'timingBasis': 'custom rendered timeline export',
        'thresholdSeconds': threshold,
        'globalModelStillIntervals': gaps,
        'sections': [dict(id=s['id'], modelStillIntervals=uncovered(models, s['start'], s['start']+s['dur'], threshold)) for s in plan['sections']],
        'warnings': [f'{a:.2f}–{b:.2f}s: no declared model operation for {b-a:.2f}s; inspect the spoken clause, reading task and actual pixels.' for a,b in gaps],
        'visualReviewRequired': True,
        'limitations': 'Self-declared model spans are not visual certification. Reframes, title/label writes, fades, captions and focus do not clear gaps. Review grouping/transfer/state changes against the actual model; inspect reading intervals rather than padding operations.'
    }

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--project',required=True,type=pathlib.Path);p.add_argument('--custom-operations',type=pathlib.Path,help='Browser-exported JSON with ops: [{id,start,end,kind,job}]');a=p.parse_args()
    script=json.loads((a.project/'script.json').read_text())
    data=(a.project/'project-data.js').read_text()
    plan=json.loads(re.search(r'window.PLAN = (\{.*\});',data,re.S)[1])
    report=audit_custom(plan,json.loads(a.custom_operations.read_text())['ops']) if a.custom_operations else audit(script,plan)
    (a.project/'motion-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    for warning in report['warnings']:print('REVIEW:',warning)
    print('Wrote motion-audit.json; warnings require visual judgment, not extra decorative motion.')

if __name__=='__main__':main()
