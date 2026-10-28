# Source: Federal Reserve, "Changes in U.S. Family Finances from 2022 to 2025" (SCF), Box 2 Table A, dated October 2026.
# Mean retirement savings among families with an IRA or DC plan, thousands of dollars. Families with head aged 64 or younger.
t={"Under 35":(43.8,38.3,53.8,48.4),"35-44":(135.2,167.5,154.8,182.4),"45-54":(291.3,323.1,342.7,415.8),"55-64":(504.8,518.2,588.5,670.2)}
print("group,2022,2025,change_pct,ratio_to_prev_group_2025")
prev=None
for g,(a,b,c,d) in t.items():
    r=f"{d/prev:.2f}" if prev else "-"
    print(f"{g},{c},{d},{(d/c-1)*100:.1f},{r}")
    prev=d
# All families with retirement accounts (Fed main table): median 95.2->106.0, mean 365.7->451.1 (thousands)
print("all conditional median change %",round((106.0/95.2-1)*100,1),"mean change %",round((451.1/365.7-1)*100,1))
print("mean/median gap 2025:",round(451.1/106.0,2),"x")
print("2022 mean/median ratio:",round(365.7/95.2,2))
for g,(a,b,c,d) in t.items(): print(g,"dollar change 2022->2025 (thousands):",round(d-c,1))
