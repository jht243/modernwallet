import hashlib
import json
from pathlib import Path
from types import SimpleNamespace
from unittest import TestCase, main
from unittest.mock import patch
import tempfile
import scraper


class ResumeAccounting(TestCase):
    def test_record_rehydrates_an_absent_page_and_preserves_a_later_version(self):
        rows=[{'url':'https://fixture.invalid/'+key,'competitor':'fixture.invalid','content_hash':'old-'+key,
               'lastmod':'2026-11-09','title':key} for key in ('a','b')]
        newer={'status':'pending','last_seen':'2026-11-10','content_hash':'new-b'}
        ledger={'competitors':{'fixture.invalid':{'pages':{rows[1]['url']:newer}}}}
        results={r['url']:{'disposition':'skipped-duplicate'} for r in rows}
        for _ in range(2):
            self.assertEqual(scraper.record(ledger,results,'2026-11-10',{'generated':'2026-11-09','candidates':rows}),2)
        self.assertEqual(ledger['competitors']['fixture.invalid']['pages'][rows[0]['url']]['status'],'done')
        self.assertEqual((newer['status'],newer['content_hash']),('pending','new-b'))
        self.assertEqual(list(newer['prior_dispositions']),['old-b'])

    def test_baseline_reuses_only_the_matching_complete_harvest_domain(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            comp={'domain':'fixture.invalid','name':'Fixture'}
            raw=json.dumps({'date':'2026-11-09','domains':{'fixture.invalid':{'roster':comp,'urls':['https://fixture.invalid/ai-automation']}}}).encode()
            file=root/'observed.json';file.write_bytes(raw)
            helper=SimpleNamespace(active=lambda _:file,validate_source=lambda _:{'baselineObservation':{'path':file.name,'sha256':hashlib.sha256(raw).hexdigest()}},
                                   inside=lambda _,p:root/p,sha=lambda x:hashlib.sha256(x).hexdigest())
            args=SimpleNamespace(today='2026-11-09',only=None,out_json=None,out_md=None)
            with patch.object(scraper,'ROOT',root),patch.object(scraper,'LEDGER_FILE',root/'ledger.json'),patch.object(scraper,'load_roster',return_value=[comp,{'domain':'uncrawled.invalid'}]),patch.object(scraper,'configure_niche'),patch.object(scraper,'workflow_handoff',return_value=helper),patch.object(scraper,'collect_competitor_urls',return_value={}) as crawl:
                scraper.cmd_baseline(args)
                self.assertEqual(crawl.call_count,1)
                self.assertEqual(crawl.call_args.args[0]['domain'],'uncrawled.invalid')
                self.assertEqual(json.loads((root/'baseline-2026-11-09.json').read_bytes())['total_urls'],1)

if __name__=='__main__':main()
