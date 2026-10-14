// Result-driven "further reading" picks shown under a calculator's answer (tool-usage pass 2026-10-14).
// YMYL money tools carry books only (owner rule 2026-10-12). Each ASIN was returned by the Amazon
// Creators API (scripts/tool_usage/amazon_pick.py) for the exact title + author named here.
// No price, rating or stock is stored (Amazon's 24-hour rule); the button sends the reader to the live listing.

// This site's Amazon Associates tracking ID, from .claude/tool-usage.site.json `amazon_tag`.
export const AMAZON_TAG = "soulcircle01-20";

export function amazonProductLink(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

export interface Pick {
  asin: string;
  title: string;
  /** One line on why this book fits THIS result. */
  why: string;
}

// Book catalog shared by the calculators. Titles and authors as listed on Amazon for the pinned ASIN.
export const BOOKS = {
  iwtytbr: { asin: "1523505745", title: "I Will Teach You to Be Rich (2nd ed.) by Ramit Sethi" },
  ymoyl: { asin: "0143115766", title: "Your Money or Your Life by Vicki Robin and Joe Dominguez" },
  bogleheads: { asin: "1119847672", title: "The Bogleheads' Guide to Investing by Taylor Larimore, Mel Lindauer and Michael LeBoeuf" },
  littleBook: { asin: "1119404509", title: "The Little Book of Common Sense Investing by John C. Bogle" },
  ssMadeSimple: { asin: "1950967190", title: "Social Security Made Simple by Mike Piper" },
  getWhatsYours: { asin: "1501144766", title: "Get What's Yours (revised) by Laurence Kotlikoff, Philip Moeller and Paul Solman" },
  moneyLast: { asin: "1982115831", title: "How to Make Your Money Last by Jane Bryant Quinn" },
  pfauGuidebook: { asin: "1945640154", title: "Retirement Planning Guidebook by Wade Pfau" },
  workingForYourself: { asin: "141333217X", title: "Working for Yourself: Law & Taxes for Independent Contractors by Stephen Fishman (Nolo)" },
  deductIt: { asin: "1413333052", title: "Deduct It! Lower Your Small Business Taxes by Stephen Fishman (Nolo)" },
  taxSavvy: { asin: "1413332315", title: "Tax Savvy for Small Business: A Complete Tax Strategy Guide (Nolo)" },
  lasser2027: { asin: "1394461577", title: "J.K. Lasser's Your Income Tax 2027 (for preparing your 2026 return)" },
  fourPillars: { asin: "1264715919", title: "The Four Pillars of Investing (2nd ed.) by William Bernstein" },
  randomWalk: { asin: "1324035439", title: "A Random Walk Down Wall Street by Burton G. Malkiel" },
  totalMoneyMakeover: { asin: "140034252X", title: "The Total Money Makeover (updated) by Dave Ramsey" },
  noloFirstHome: { asin: "1413332420", title: "Nolo's Essential Guide to Buying Your First Home" },
  kidMoneyGenius: { asin: "1476766819", title: "Make Your Kid a Money Genius (Even If You're Not) by Beth Kobliner" },
  moneyForCouples: { asin: "1523523689", title: "Money for Couples by Ramit Sethi" },
} as const;

export function book(key: keyof typeof BOOKS, why: string): Pick {
  return { ...BOOKS[key], why };
}

export default function ToolPicks({ tool, heading, picks }: { tool: string; heading: string; picks: Pick[] }) {
  if (picks.length === 0) return null;
  return (
    <div data-tool-picks={tool} style={S.wrap}>
      <div style={S.heading}>{heading}</div>
      <ul style={S.list}>
        {picks.slice(0, 5).map((p) => (
          <li key={p.asin} style={S.item}>
            <div style={S.text}>
              <span style={S.title}>{p.title}</span>
              <span style={S.why}>{p.why}</span>
            </div>
            <a
              style={S.btn}
              href={amazonProductLink(p.asin)}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
            >
              Check price on Amazon
            </a>
          </li>
        ))}
      </ul>
      <p style={S.disclosure}>As an Amazon Associate we earn from qualifying purchases.</p>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { marginTop: 4, paddingTop: 12, borderTop: "1px solid #E6F0EC", display: "flex", flexDirection: "column", gap: 8 },
  heading: { fontSize: "0.82rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 },
  item: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "8px 10px", border: "1px solid #E6F0EC", borderRadius: 10, background: "#fff" },
  text: { display: "flex", flexDirection: "column", gap: 2, flex: "1 1 180px", minWidth: 0 },
  title: { fontSize: "0.88rem", fontWeight: 600, color: "#1A1A1A" },
  why: { fontSize: "0.8rem", color: "#555" },
  btn: { fontSize: "0.8rem", fontWeight: 600, color: "#0E7C66", border: "1px solid #0E7C66", borderRadius: 8, padding: "8px 10px", textDecoration: "none", whiteSpace: "nowrap", minHeight: 32, boxSizing: "border-box" },
  disclosure: { fontSize: "0.75rem", color: "#777", margin: 0 },
};
