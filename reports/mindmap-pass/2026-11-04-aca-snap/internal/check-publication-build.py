from pathlib import Path
import json,importlib.util,urllib.parse,xml.etree.ElementTree as ET
repo=Path.cwd();run=repo/'reports/mindmap-pass/2026-11-04-aca-snap';info=json.loads((run/'internal/publication-paths.json').read_text());base=Path(info['baseline'])/'dist';candidate=Path(info['root'])/'candidate/dist';manifest=json.loads((run/'render-manifest.json').read_text());spec=importlib.util.spec_from_file_location('rendered',repo/'.claude/tools/rendered-audit.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
new=['/budget/snap-benefits-calculator/','/budget/aca-subsidy-calculator/','/compare/snap-vs-wic/','/compare/aca-vs-medicaid/','/guides/how-to-apply-for-food-stamps/'];direct=['/budget/household-budget-calculator/','/guides/how-to-budget-with-irregular-income/','/guides/how-to-make-a-budget/'];fail=[];link_count=0;inbound={p:[] for p in new}
for row in manifest['routes']:
 file=candidate/row['path'].lstrip('/')/'index.html';html=file.read_text();parsed=mod.Page();parsed.feed(html)
 for href in parsed.links:
  target=urllib.parse.urlsplit(href)
  if target.netloc and target.netloc!='www.themodernwallet.com':continue
  if target.scheme not in ['', 'https','http']:continue
  url=urllib.parse.urlsplit(urllib.parse.urljoin('https://www.themodernwallet.com'+row['path'],href));path=url.path;dest=candidate/path.lstrip('/')
  if path.endswith('/') or not dest.suffix:dest=dest/'index.html'
  if not dest.is_file():fail.append([row['path'],href,'missing internal destination'])
  link_count+=1
  normalized=path.rstrip('/')+'/'
  if normalized in inbound and normalized!=row['path']:inbound[normalized].append(row['path'])
# Sitemap equality and link-only date preservation.
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
def sitemap(root):
 out={}
 for p in root.glob('sitemap-*.xml'):
  if p.name=='sitemap-index.xml':continue
  for entry in ET.parse(p).getroot().findall('s:url',ns):
   u=entry.findtext('s:loc',namespaces=ns);assert u not in out,'duplicate sitemap URL';out[u]=entry.findtext('s:lastmod',namespaces=ns)
 return out
b=sitemap(base);c=sitemap(candidate)
for p in new:
 u='https://www.themodernwallet.com'+p
 if u not in c or not (c[u] or '').startswith('2026-11-04'):fail.append([p,'new sitemap date missing'])
for p in direct:
 u='https://www.themodernwallet.com'+p
 if b.get(u)!=c.get(u):fail.append([p,'link-only sitemap date changed'])
# Native search index must add exactly these five records without removing existing paths.
bsearch={r['u']:r for r in json.loads((base/'search-index.json').read_text())};csearch={r['u']:r for r in json.loads((candidate/'search-index.json').read_text())}
if set(csearch)-set(bsearch)!={p.rstrip('/') for p in new}:fail.append(['search-index','unexpected additions'])
if set(bsearch)-set(csearch):fail.append(['search-index','removed existing records'])
for p,rows in inbound.items():
 if len(set(rows))<2:fail.append([p,'fewer than two relevant inbound source routes'])
result={'status':'PASS' if not fail else 'FAIL','internalLinksInspected':link_count,'inboundRoutes':{p:sorted(set(v)) for p,v in inbound.items()},'sitemapNewDates':{p:c.get('https://www.themodernwallet.com'+p) for p in new},'linkOnlySitemapDatesPreserved':direct,'nativeSearchNewRecords':sorted(set(csearch)-set(bsearch)),'failures':fail};(run/'internal/publication-build-checks.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2));assert not fail
