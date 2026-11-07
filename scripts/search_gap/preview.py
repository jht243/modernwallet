#!/usr/bin/env python3
"""Search-only candidate preview. No production DB connection or admin credentials."""
import argparse
import datetime as dt
import functools
import hashlib
import json
import os
from pathlib import Path
import sys

from job_worker import Store, require


def convert_rows(table, rows):
    from sqlalchemy import Date, DateTime
    result = []
    for row in rows:
        values = {key:value for key,value in row.items() if key in table.c}
        for key,value in list(values.items()):
            if value is None: continue
            kind = table.c[key].type
            if isinstance(kind, DateTime): values[key] = dt.datetime.fromisoformat(value.replace('Z','+00:00'))
            elif isinstance(kind, Date): values[key] = dt.date.fromisoformat(value)
        result.append(values)
    return result


def lawfare(folder, port, candidate_patch=None):
    store = Store()
    fixture = store.request('rpc/search_gap_lawfare_fixture','POST',{})
    require(fixture['site']=='lawfareclaims.org', 'Wrong preview fixture')
    folder = folder.resolve(); folder.mkdir(parents=True,exist_ok=True)
    snapshot = folder/'public-data.json'; snapshot.write_text(json.dumps(fixture,ensure_ascii=False,indent=2))
    database = folder/'preview.sqlite'
    require(not database.exists(), 'Choose a fresh preview directory; do not reuse a mutated fixture')
    # Override BEFORE importing app configuration. No .env production connection can win.
    os.environ['DATABASE_URL']='sqlite:///'+str(database)
    sys.path.insert(0,str(Path.cwd()))
    from src import models
    require(models.engine.url.get_backend_name()=='sqlite', 'Preview must not connect to production')
    models.init_db()
    tables = {table.name:table for table in models.Base.metadata.sorted_tables}
    allowed={'tracker_opportunities','tracker_published_pages','blog_posts','landing_pages'}
    with models.engine.begin() as connection:
        for name in ['tracker_opportunities','tracker_published_pages','blog_posts','landing_pages']:
            rows=convert_rows(tables[name],fixture['tables'][name])
            for row in rows: connection.execute(tables[name].insert().values(**row))
        if candidate_patch:
            patches=json.loads(Path(candidate_patch).read_text())
            for patch in patches:
                require(patch['table'] in allowed,'Candidate patch outside public preview data')
                table=tables[patch['table']]; require(isinstance(patch['id'],int),'Candidate row ID required')
                require(not set(patch['values']) & {'id','opportunity_id'},'Do not change fixture identities')
                values=convert_rows(table,[patch['values']])[0]
                changed=connection.execute(table.update().where(table.c.id==patch['id']).values(**values))
                require(changed.rowcount==1,'Candidate row missing')
    from src import page_renderer
    @functools.lru_cache(maxsize=1024)
    def sign(title, section):
        signature=store.request('rpc/search_gap_lawfare_sign','POST',{'p_title':title,'p_section':section})
        require(isinstance(signature,str) and len(signature)==20,'Invalid signing response')
        return signature
    page_renderer.og_card_sig=sign
    # Load actual candidate app AFTER safe database setup and authentic signing provider.
    import server
    receipt={'site':'lawfareclaims.org','fixtureSha256':hashlib.sha256(snapshot.read_bytes()).hexdigest(),
        'capturedAt':fixture['capturedAt'],'database':'isolated SQLite fixture; production never connected',
        'signing':'service-only RPC; genuine algorithm; raw signing/admin key never returned',
        'candidatePatchSha256':hashlib.sha256(Path(candidate_patch).read_bytes()).hexdigest() if candidate_patch else None,
        'port':port,'source':'actual candidate checkout; public data snapshot; no rendered HTML substitution'}
    (folder/'preview-method.json').write_text(json.dumps(receipt,indent=2))
    server.app.run(host='127.0.0.1',port=port)


def main():
    parser=argparse.ArgumentParser();parser.add_argument('profile',choices=['lawfare']);parser.add_argument('--out',required=True);parser.add_argument('--port',type=int,default=15059);parser.add_argument('--candidate-patch')
    args=parser.parse_args();lawfare(Path(args.out),args.port,args.candidate_patch)

if __name__=='__main__':main()
