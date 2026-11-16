#!/usr/bin/env python3
"""Monthly list-price cost: QuickBooks Online vs FreshBooks. Prices from vendor pricing pages (2026-11-16; QB corroborated by 2026-11-13 capture).
QB tiers by users: Simple Start 1 user $38, Essentials 3 users $85, Plus 5 users $140, Advanced 25 users $340.
FB tiers by billable clients: Lite 5 $23, Plus 50 $43, Premium unlimited $70; each extra team member $11/mo (add-on, FB seats beyond the owner).
Promos excluded. Feature differences ignored: this is a price-only model. QB Free plan ($0, 1 user, 2 invoices/mo) noted separately."""
import json, sys
QB=[(1,38),(3,85),(5,140),(25,340)]
FB=[(5,23),(50,43),(10**9,70)]
def qb(users):
    for cap,p in QB:
        if users<=cap: return p
def fb(clients, users):
    for cap,p in FB:
        if clients<=cap: base=p;break
    return base + 11*max(users-1,0)
rows=[]
for users in (1,2,3,4,5,10,25):
    for clients in (3,5,6,20,50,51,100):
        rows.append({"users":users,"billable_clients":clients,"quickbooks":qb(users),"freshbooks":fb(clients,users),"freshbooks_minus_quickbooks":fb(clients,users)-qb(users)})
json.dump(rows,open(sys.argv[1],"w"),indent=1)
for r in rows: print(r)
