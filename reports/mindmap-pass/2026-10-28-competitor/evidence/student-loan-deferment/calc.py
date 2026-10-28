# Amounts rounded half up to the nearest dollar.
# Illustrative scenario (hypothetical inputs, not a quote): interest that accrues during a deferment on an unsubsidized balance.
# Rule source: 34 CFR 685.204(a)(1)-(2): subsidized = interest not charged to borrower; unsubsidized = interest accrues.
for bal,rate in [(10000,0.065),(30000,0.065),(30000,0.0799),(60000,0.0799)]:
    for months in (6,12,36):
        i=bal*rate*months/12
        print(f"balance ${bal:,} rate {rate*100:.2f}% months {months}: accrued interest ${int(i+0.5):,}; balance if all capitalized ${int(bal+i+0.5):,}")
