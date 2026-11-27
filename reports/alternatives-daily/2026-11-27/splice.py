import json,sys,re
D="reports/alternatives-daily/2026-11-27"
alts=json.load(open("src/data/alternatives.json")); reg=json.load(open("data/alternatives-pages.json"))
hosts={"upstart":("upstart.com",["www.upstart.com"])}
for s in sys.argv[1:]:
    p=json.load(open(f"{D}/drafts/{s}.json"))
    p["published"]="2026-11-27"; p["updated"]="2026-11-27"
    alts=[a for a in alts if a["slug"]!=s]+[p]
    route=f"/alternatives/{s}/"
    reg["pages"]=[r for r in reg["pages"] if r["route"]!=route]+[{"route":route,"vendorHost":hosts[s][0],"officialHosts":hosts[s][1]}]
    print(s,p["title"],len(p["title"]),p["officialUrl"],len(p["rows"]),len(p["faqs"]))
json.dump(alts,open("src/data/alternatives.json","w"),indent=2,ensure_ascii=False); open("src/data/alternatives.json","a").write("\n")
json.dump(reg,open("data/alternatives-pages.json","w"),indent=2,ensure_ascii=False); open("data/alternatives-pages.json","a").write("\n")
