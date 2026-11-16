#!/usr/bin/env python3
"""Monthly list-price cost, QuickBooks Online vs FreshBooks, price-only model. Usage: model.py OUTPUT.json
Inputs (vendor pricing pages, checked 2026-11-16): freshbooks.com/pricing (verbatim capture), quickbooks.intuit.com/pricing
(summary capture, used only for list prices and user caps; corroborated by src/data/alternatives.json, 2026-11-13).
QuickBooks Online list price by user cap: Simple Start 1 user $38, Essentials 3 users $85, Plus 5 users $140, Advanced 25 users $340.
FreshBooks by billable-client cap: Lite 5 clients $23, Plus 50 clients $43, Premium unlimited $70; Team Members $11/mo per user
(assumed to apply to every user beyond the first). Select is quote-based and excluded. QuickBooks Free (1 user, 2 invoices/mo) is
treated separately. Promotions excluded. Features are not scored.
Grid: 7 user counts x 7 client counts = 49 combinations."""
import json, sys
QB = [(1, 38), (3, 85), (5, 140), (25, 340)]
FB = [(5, 23), (50, 43), (10**9, 70)]
USERS = (1, 2, 3, 4, 5, 10, 25)
CLIENTS = (3, 5, 6, 20, 50, 51, 100)

def qb(users):
    for cap, p in QB:
        if users <= cap:
            return p

def fb(clients, users):
    for cap, p in FB:
        if clients <= cap:
            base = p
            break
    return base + 11 * max(users - 1, 0)

rows = []
for u in USERS:
    for c in CLIENTS:
        q, f = qb(u), fb(c, u)
        rows.append({"users": u, "billable_clients": c, "quickbooks_usd": q, "freshbooks_usd": f,
                     "freshbooks_minus_quickbooks_usd": f - q,
                     "cheaper": "freshbooks" if f < q else ("quickbooks" if q < f else "tie")})
# flip points over every user count 1..25 and client counts around tier edges
flip = {}
for u in range(1, 26):
    flip[str(u)] = {str(c): ("freshbooks" if fb(c, u) < qb(u) else "quickbooks" if qb(u) < fb(c, u) else "tie")
                    for c in (1, 5, 6, 50, 51, 500)}
out = {"combinations": len(rows), "rows": rows, "cheaper_by_users_and_client_edges": flip,
       "claims": {
           "1_user_up_to_5_clients_freshbooks_cheaper": all(fb(c, 1) < qb(1) for c in range(1, 6)),
           "1_user_6_plus_clients_quickbooks_cheaper": all(qb(1) < fb(c, 1) for c in (6, 50, 51, 500)),
           "2_users_any_clients_freshbooks_cheaper": all(fb(c, 2) < qb(2) for c in (1, 5, 6, 50, 51, 500)),
           "3_users_up_to_50_clients_freshbooks_cheaper": all(fb(c, 3) < qb(3) for c in (1, 5, 6, 50)),
           "3_users_51_plus_clients_quickbooks_cheaper": all(qb(3) < fb(c, 3) for c in (51, 500)),
           "4_to_25_users_any_clients_freshbooks_cheaper": all(fb(c, u) < qb(u) for u in range(4, 26) for c in (1, 5, 6, 50, 51, 500))},
       "counterexample": {"users": 3, "billable_clients": 51, "quickbooks_usd": qb(3), "freshbooks_usd": fb(51, 3)}}
json.dump(out, open(sys.argv[1], "w"), indent=1)
print(json.dumps(out["claims"], indent=1), out["combinations"], out["counterexample"])
