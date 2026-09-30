# compose <slug>: prompts/<slug>.head.md + facts/<fact>.md -> prompts/<slug>.prompt.md + prompts/<slug>.allowed-urls.txt
import sys,re
R="reports/mindmap-pass/2026-09-30-robinhood"
slug=sys.argv[1]; facts=sys.argv[2:] or [slug]
head=open(f"{R}/prompts/{slug}.head.md").read()
urls=[]; body=[]
for f in facts:
    t=open(f"{R}/facts/{f}.md").read()
    body.append(t)
    m=t.split("# CLOSED URL LIST",1)
    if len(m)>1: urls+= [u.strip() for u in m[1].splitlines() if u.strip().startswith("http")]
urls=list(dict.fromkeys(urls))
out=head.rstrip()+"\n\n"+"\n\n".join(body)+"\n\nAnything not on this list, you do not know. Never invent a price, limit, rate, date, or URL; say it is unpublished and tell the reader to verify at the vendor page. Facts under 'Contested / unverified' must be presented as varying or unconfirmed; items under 'DO NOT STATE' must not appear.\n"
open(f"{R}/prompts/{slug}.prompt.md","w").write(out)
open(f"{R}/prompts/{slug}.allowed-urls.txt","w").write("\n".join(urls)+"\n")
print(slug, len(out), "chars,", len(urls), "urls")
