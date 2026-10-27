"""Scans the plain text of Anthropic, PBC's S-1 (SEC EDGAR accession 0001628280-26-067168, anthropicpbc-sx1.htm,
downloaded 2026-10-27 and stripped of HTML tags) for the facts quoted on the page. Usage: python3 s1_scan.py <s1.txt>"""
import re, sys
t = open(sys.argv[1]).read()
def count(p): return len(re.findall(p, t, flags=re.I))
def ctx(p, w=220, n=1):
    for m in list(re.finditer(p, t))[:n]:
        print("   >", t[max(0, m.start()-w): m.end()+w].replace("\n", " "))
print("symbol ANT:", count(r"under the symbol .ANT"))
ctx(r"under the symbol")
print("price per share placeholder '$ and $':", count(r"between \$ and \$"))
print("terms with zero hits (directed share, reserved share, friends and family, retail investors, individual investors, online brokerage, directed share program):")
for term in ["directed share", "reserved share", "friends and family", "retail investor", "individual investor", "online brokerage", "retail allocation"]:
    print("  ", term, count(term))
print("lock-up mentions:", count("lock-up"), "| '180-day lock-up':", count("180-day lock-up"), "| '365-day':", count("365-day"))
print("revenue row:"); ctx(r"Revenue \$ 41", w=10, n=1)
for pat in [r"Loss from operations", r"Operating loss", r"Net loss", r"Income \(loss\) from operations", r"Total operating expenses"]:
    print(pat, count(pat)); ctx(pat, w=200)
print("Goldman Sachs & Co. LLC and Morgan Stanley & Co. LLC are the representatives:", count(r"Goldman Sachs & Co\. LLC and Morgan Stanley & Co\. LLC are the representatives"))
print("public benefit corporation:", count("public benefit corporation"))
print("selling stockholders offered:", count(r"offered by the selling stockholders"))
