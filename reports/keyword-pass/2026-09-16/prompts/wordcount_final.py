import sys
sys.path.insert(0, ".")
import subprocess, json

out = subprocess.run(
    ["npx", "--yes", "tsx", "-e", """
import { GUIDES } from './src/data/guides.ts';
const pick = (slug) => GUIDES.find(g => g.slug === slug);
const uk = pick('freelance-rate-calculator-uk-ir35-explained');
const rm = pick('dave-ramsey-12-percent-investment-return-explained');
function body(g) {
  return g.introText + ' ' + g.sections.map(s => s.body).join(' ') + ' ' + g.faqs.map(f => f.answer).join(' ');
}
console.log(JSON.stringify({ uk: body(uk), rm: body(rm) }));
"""],
    capture_output=True, text=True, cwd=".",
)
print(out.stderr[-2000:])
data = json.loads(out.stdout.strip().splitlines()[-1])
for k, v in data.items():
    print(k, len(v.split()))
