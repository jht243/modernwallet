import json,sys,re
def walk(o,f):
    if isinstance(o,str): return f(o)
    if isinstance(o,list): return [walk(x,f) for x in o]
    if isinstance(o,dict): return {k:walk(v,f) for k,v in o.items()}
    return o
def apply(src,dst,pairs,extra=None):
    d=json.load(open(src)); miss=[]
    for a,b in pairs:
        cnt=[0]
        def f(s):
            if a in s: cnt[0]+=s.count(a); return s.replace(a,b)
            return s
        d=walk(d,f)
        if cnt[0]==0: miss.append(a[:90])
    d=walk(d,lambda s: re.sub(r'  +',' ',s).strip() if '\n' not in s else '\n'.join(re.sub(r'  +',' ',l).strip() for l in s.split('\n')))
    if extra: extra(d)
    json.dump(d,open(dst,'w'),indent=2,ensure_ascii=False)
    print('applied',len(pairs)-len(miss),'missed',len(miss)); [print('  MISS:',m) for m in miss]
