import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { STATES } from "../data/states";
import {
  DEFAULT_PROFILE, PRESETS, QUESTIONS, SOURCES, buildChecklist, climateDefaults,
  type Profile,
} from "../lib/checklists";
import { PRIMARY, S } from "./calc-ui";

// House viewing island (mindmap-pass 2026-10-26). The short list for walking through a house the first
// time: about ten questions for the agent or seller and about ten things to check yourself, in order of
// how costly each is to miss (items live in src/lib/checklists.ts, "house-viewing"). The reader marks
// each item Good / Unsure / Problem for up to three houses, writes down the agent's answers, and gets a
// side-by-side count per house. No score is invented: the summary is the reader's own marks, counted.

type Mark = "good" | "unsure" | "bad";
interface House { name: string; marks: Record<string, Mark>; answers: Record<string, string>; notes: string }
interface Saved { profile: Profile; houses: House[] }

const STORE = "mw-viewing-v1";
const MAX_HOUSES = 3;
const newHouse = (n: number): House => ({ name: `House ${n}`, marks: {}, answers: {}, notes: "" });
const fresh = (): Saved => ({ profile: { ...DEFAULT_PROFILE, ...PRESETS["house-viewing"] }, houses: [newHouse(1)] });

function load(): Saved | null {
  try {
    const raw = window.localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}
function save(d: Saved) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(d));
  } catch {
    /* storage blocked: the tool still works for this visit */
  }
}

const MARKS: { v: Mark; label: string; sym: string }[] = [
  { v: "good", label: "Good", sym: "✓" },
  { v: "unsure", label: "Unsure", sym: "?" },
  { v: "bad", label: "Problem", sym: "✗" },
];

interface Props { initialData?: Partial<Profile>; heading?: string; subheading?: string }

export default function ViewingChecklist({ heading, subheading }: Props) {
  const [data, setData] = useState<Saved>(fresh);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(0); // which house the phone layout is filling
  const [answersOpen, setAnswersOpen] = useState(true);
  const [printRoot, setPrintRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const s = load();
    if (s) {
      setData({ profile: { ...fresh().profile, ...s.profile }, houses: s.houses?.length ? s.houses.slice(0, MAX_HOUSES).map((h, i) => ({ ...newHouse(i + 1), ...h, marks: h.marks ?? {}, answers: h.answers ?? {} })) : [newHouse(1)] });
      if (s.houses?.some((h) => Object.keys(h.marks ?? {}).length)) setAnswersOpen(false);
    }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) save(data); }, [data, loaded]);
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "mwvc-print-root";
    document.body.appendChild(el);
    setPrintRoot(el);
    return () => el.remove();
  }, []);

  const p = data.profile;
  const setProfile = (patch: Partial<Profile>) => setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
  const setHouse = (i: number, patch: Partial<House>) => setData((d) => ({ ...d, houses: d.houses.map((h, k) => (k === i ? { ...h, ...patch } : h)) }));
  const setMark = (i: number, id: string, m: Mark) =>
    setData((d) => ({ ...d, houses: d.houses.map((h, k) => {
      if (k !== i) return h;
      const marks = { ...h.marks };
      if (marks[id] === m) delete marks[id]; else marks[id] = m;
      return { ...h, marks };
    }) }));
  const setAnswer = (i: number, id: string, v: string) => setData((d) => ({ ...d, houses: d.houses.map((h, k) => (k === i ? { ...h, answers: { ...h.answers, [id]: v } } : h)) }));
  const addHouse = () => setData((d) => (d.houses.length >= MAX_HOUSES ? d : { ...d, houses: [...d.houses, newHouse(d.houses.length + 1)] }));
  const removeHouse = (i: number) => {
    if (!window.confirm(`Remove ${data.houses[i].name || `House ${i + 1}`} and its marks?`)) return;
    setData((d) => ({ ...d, houses: d.houses.filter((_, k) => k !== i) }));
    setActive(0);
  };
  const reset = () => {
    if (!window.confirm("Clear every house's marks, answers and notes?")) return;
    setData((d) => ({ ...d, houses: [newHouse(1)] }));
    setActive(0);
  };

  const sections = useMemo(() => buildChecklist("house-viewing", p), [p]);
  const items = sections.flatMap((s) => s.items);
  const rank = (id: string) => items.findIndex((it) => it.id === id);
  const stateName = STATES.find((s) => s.usps === p.state)?.name ?? "";
  const typeQ = QUESTIONS["house-viewing"][0];
  const eraQ = QUESTIONS["house-viewing"][1];
  const optLabel = (q: typeof typeQ, v: string) => (q.type === "select" ? q.options.find((o) => o.value === v)?.label ?? "" : "");
  const summaryLine = [optLabel(typeQ, p.propertyType), optLabel(eraQ, p.era) !== "Not sure" ? `built ${optLabel(eraQ, p.era).toLowerCase()}` : "", stateName,
    p.freeze && "Freezing winters", p.hurricane && "Hurricane coast", p.wildfire && "Wildfire area", p.earthquake && "Earthquake area"].filter(Boolean).join(" · ");

  const tally = (h: House) => {
    const t = { good: 0, unsure: 0, bad: 0, open: 0 };
    for (const it of items) { const m = h.marks[it.id]; if (m) t[m]++; else t.open++; }
    return t;
  };
  const problems = (h: House) => items.filter((it) => h.marks[it.id] === "bad").sort((a, b) => rank(a.id) - rank(b.id));

  return (
    <div style={S.wrap} className="mwvc">
      <style>{CSS}</style>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}

      <section className="mwvc-card" aria-label="About the house">
        <div className="mwvc-ahead">
          <div>
            <div className="mwvc-alabel">About the house</div>
            {!answersOpen && <div className="mwvc-summary">{summaryLine}</div>}
          </div>
          <button type="button" className="mwvc-link" aria-expanded={answersOpen} onClick={() => setAnswersOpen((o) => !o)}>{answersOpen ? "Hide" : "Edit"}</button>
        </div>
        {answersOpen && (
          <>
            <div className="mwvc-qgrid">
              {[typeQ, eraQ].map((q) => q.type === "select" && (
                <label key={q.key} style={S.field}>
                  <span style={S.label}>{q.label}</span>
                  <select style={S.input} value={String(p[q.key])} onChange={(e) => setProfile({ [q.key]: e.target.value } as Partial<Profile>)}>
                    {q.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>
              ))}
              <label style={S.field}>
                <span style={S.label}>State</span>
                <select style={S.input} value={p.state} onChange={(e) => setProfile({ state: e.target.value, ...(e.target.value ? climateDefaults(e.target.value) : {}) })}>
                  <option value="">Choose a state</option>
                  {STATES.map((s) => <option key={s.usps} value={s.usps}>{s.name}</option>)}
                </select>
              </label>
            </div>
            <div className="mwvc-chiprow">
              {([["freeze", "Winters reach freezing"], ["hurricane", "Hurricane-prone coast"], ["wildfire", "Wildfire area"], ["earthquake", "Earthquake area"]] as const).map(([k, label]) => (
                <button key={k} type="button" className={`mwvc-chip${p[k] ? " mwvc-chipon" : ""}`} aria-pressed={p[k]} onClick={() => setProfile({ [k]: !p[k] } as Partial<Profile>)}>
                  <span aria-hidden="true">{p[k] ? "✓" : "+"}</span> {label}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="mwvc-card mwvc-out" aria-label="Viewing checklist">
        <div className="mwvc-bar">
          <div className="mwvc-houses" role="tablist" aria-label="Houses">
            {data.houses.map((h, i) => (
              <div key={i} className={`mwvc-house${active === i ? " mwvc-houseon" : ""}`}>
                <button type="button" role="tab" aria-selected={active === i} className="mwvc-housetab" onClick={() => setActive(i)}>{i + 1}</button>
                <input aria-label={`Name for house ${i + 1}`} placeholder="Name or address" value={h.name} onChange={(e) => setHouse(i, { name: e.target.value })} onFocus={() => setActive(i)} />
                {data.houses.length > 1 && <button type="button" className="mwvc-x" aria-label={`Remove ${h.name || `House ${i + 1}`}`} onClick={() => removeHouse(i)}>×</button>}
              </div>
            ))}
            {data.houses.length < MAX_HOUSES && <button type="button" className="mwvc-add" onClick={addHouse} aria-label="Add a house to compare"><span className="mwvc-long">+ Add a house to compare</span><span className="mwvc-short">+ House</span></button>}
          </div>
          <div className="mwvc-actions">
            <button type="button" className="mwvc-btn" onClick={() => window.print()} aria-label="Print or save as PDF"><span className="mwvc-long">Print or save as PDF</span><span className="mwvc-short">Print</span></button>
          </div>
        </div>

        <div className={`mwvc-tally mwvc-n${data.houses.length}`}>
          {data.houses.map((h, i) => {
            const t = tally(h);
            const pr = problems(h);
            return (
              <div key={i} className={`mwvc-tcard${active === i ? " mwvc-tcardon" : ""}`}>
                <div className="mwvc-tname">{h.name || `House ${i + 1}`}</div>
                <div className="mwvc-tcounts">
                  <span className="mwvc-good">✓ {t.good} good</span>
                  <span className="mwvc-unsure">? {t.unsure} unsure</span>
                  <span className="mwvc-bad">✗ {t.bad} problem{t.bad === 1 ? "" : "s"}</span>
                </div>
                <div className="mwvc-tsub">{t.open ? `${t.open} of ${items.length} not marked yet` : "Every item marked"}</div>
                <div className="mwvc-tprob">
                  {pr.length > 0
                    ? <>Problems: {pr.slice(0, 3).map((it) => it.short ?? it.text.split(/[:?]/)[0]).join("; ")}{pr.length > 3 ? `; +${pr.length - 3} more` : ""}</>
                    : <span className="mwvc-tnone">No problems marked</span>}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mwvc-legend">
          For each house, mark how the answer or check looks: <span className="mwvc-lg mwvc-lgood">✓ Good</span> <span className="mwvc-lg mwvc-lunsure">? Unsure</span> <span className="mwvc-lg mwvc-lbad">✗ Problem</span>. Tap a mark again to clear it.
        </p>

        <div className={`mwvc-list mwvc-n${data.houses.length}`}>
        {sections.map((s) => (
          <div key={s.id} className="mwvc-sec">
            <h3>{s.title}</h3>
            {(
              <div className="mwvc-colhead" aria-hidden="true">
                <span />
                <div className="mwvc-cells">
                  {data.houses.map((h, i) => <span key={i} className={`mwvc-colname${active === i ? " mwvc-colon" : ""}`}>{h.name || `House ${i + 1}`}</span>)}
                </div>
              </div>
            )}
            <ol className="mwvc-items">
              {s.items.map((it) => (
                <li key={it.id} className="mwvc-item">
                  <div className="mwvc-text">
                    <span>{it.text}</span>
                    {it.note && <span className="mwvc-note">{it.note}</span>}
                    {(it.src || it.link) && (
                      <span className="mwvc-links">
                        {it.link && <a href={it.link.href}>{it.link.label}</a>}
                        {it.src && <a href={SOURCES[it.src].url} target="_blank" rel="noopener noreferrer">Source: {SOURCES[it.src].label.split(": ")[0]}</a>}
                      </span>
                    )}
                  </div>
                  <div className="mwvc-cells">
                    {data.houses.map((h, i) => (
                      <div key={i} className={`mwvc-cell${active === i ? " mwvc-cellon" : ""}`}>
                        <div className="mwvc-marks" role="group" aria-label={`${h.name || `House ${i + 1}`}: ${it.text}`}>
                          {MARKS.map((m) => (
                            <button key={m.v} type="button" aria-pressed={h.marks[it.id] === m.v} title={m.label}
                              className={`mwvc-mark mwvc-${m.v}${h.marks[it.id] === m.v ? " mwvc-markon" : ""}`} onClick={() => { setActive(i); setMark(i, it.id, m.v); }}>
                              <span aria-hidden="true">{m.sym}</span><span className="mwvc-marklabel">{m.label}</span>
                            </button>
                          ))}
                        </div>
                        {s.id === "ask" && (
                          <input className="mwvc-answer" aria-label={`${h.name || `House ${i + 1}`}: answer to ${it.text}`} placeholder="Their answer" value={h.answers[it.id] ?? ""} onFocus={() => setActive(i)} onChange={(e) => setAnswer(i, it.id, e.target.value)} />
                        )}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
        </div>

        <div className="mwvc-notes">
          {data.houses.map((h, i) => (
            <label key={i} className={`mwvc-notecell${active === i ? " mwvc-cellon" : ""}`}>
              <span style={S.label}>Notes on {h.name || `House ${i + 1}`}</span>
              <textarea rows={3} value={h.notes} onFocus={() => setActive(i)} onChange={(e) => setHouse(i, { notes: e.target.value })} placeholder="Price, layout, what you liked, what to ask next" />
            </label>
          ))}
        </div>

        <div className="mwvc-footrow">
          <button type="button" className="mwvc-btn mwvc-ghost" onClick={reset}>Clear</button>
        </div>

        <div style={S.disclaimer}>
          A viewing checklist, not a home inspection. A licensed inspector checks the systems in detail after you make an offer. Your marks and notes are saved only in this browser.
        </div>
      </section>

      {printRoot && createPortal(<PrintSheet houses={data.houses} sections={sections} summary={summaryLine} />, printRoot)}
    </div>
  );
}

function PrintSheet({ houses, sections, summary }: { houses: House[]; sections: ReturnType<typeof buildChecklist>; summary: string }) {
  // Always three house columns on paper, so a blank sheet works for a weekend of open houses.
  const cols = Array.from({ length: MAX_HOUSES }, (_, i) => houses[i]);
  const sym = (m?: Mark) => (m === "good" ? "✓" : m === "unsure" ? "?" : m === "bad" ? "✗" : "");
  return (
    <div className="mwvc-sheet">
      <h1>House Viewing Checklist</h1>
      <p className="mwvc-pname">Name: ____________________ Date: ______________</p>
      {summary && <p className="mwvc-psum">{summary}</p>}
      <p className="mwvc-pdir">Mark each item ✓ good, ? unsure or ✗ problem for each house you see.</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            {cols.map((h, i) => <th key={i}>{h?.name || `House ${i + 1}`}<div className="mwvc-paddr">Address: ____________</div></th>)}
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => [
            <tr key={s.id} className="mwvc-psec"><td colSpan={MAX_HOUSES + 1}>{s.title}</td></tr>,
            ...s.items.map((it) => (
              <tr key={it.id}>
                <td>{it.text}</td>
                {cols.map((h, i) => (
                  <td key={i}><span className="mwvc-pbox">{sym(h?.marks[it.id])}</span>{s.id === "ask" && h?.answers[it.id] ? <span className="mwvc-pans">{h.answers[it.id]}</span> : null}</td>
                ))}
              </tr>
            )),
          ])}
        </tbody>
      </table>
      <div className="mwvc-pnotes">
        {cols.map((h, i) => <div key={i}><b>Notes, {h?.name || `House ${i + 1}`}:</b> {h?.notes || ""}<div className="mwvc-plines" /></div>)}
      </div>
      <p className="mwvc-pfoot">From themodernwallet.com/checklists/house-viewing-checklist/. A viewing checklist, not a home inspection.</p>
    </div>
  );
}

const CSS = `
.mwvc-card{background:#fff;border:1px solid #D8EEE6;border-radius:14px;padding:14px 16px;margin-bottom:16px}
.mwvc-ahead{display:flex;justify-content:space-between;align-items:center;gap:12px}
.mwvc-alabel{font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2A6A58}
.mwvc-summary{font-size:.92rem;color:#333;margin-top:3px}
.mwvc-link{background:none;border:0;color:${PRIMARY};font-weight:600;font-size:.9rem;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.mwvc-qgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px 16px;margin-top:12px}
.mwvc-chiprow{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.mwvc-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid #CFE3DC;background:#fff;color:#2c2c2c;border-radius:999px;padding:7px 13px;font-size:.88rem;cursor:pointer}
.mwvc-chip span{font-weight:700;color:#8aa39b}
.mwvc-chipon{background:#E4F4EF;border-color:${PRIMARY};color:#0B5E4E;font-weight:600}
.mwvc-chipon span{color:${PRIMARY}}
.mwvc-out{padding-top:0}
.mwvc-bar{position:sticky;top:60px;z-index:5;background:#fff;margin:0 -16px;padding:12px 16px 10px;border-bottom:1px solid #E6F0EC;border-radius:14px 14px 0 0;display:flex;flex-wrap:nowrap;gap:10px;justify-content:space-between;align-items:center}
.mwvc-footrow{display:flex;justify-content:flex-end;margin:4px 0 10px}
.mwvc-short{display:none}
.mwvc-houses{display:flex;flex-wrap:nowrap;gap:8px;align-items:center;min-width:0}
.mwvc-house{display:flex;align-items:center;gap:4px;border:1px solid #D8E6E1;border-radius:10px;padding:3px 6px 3px 3px;background:#F7FBF9}
.mwvc-houseon{border-color:${PRIMARY};background:#E9F6F1}
.mwvc-housetab{width:24px;height:24px;border-radius:7px;border:0;background:${PRIMARY};color:#fff;font-weight:700;font-size:.8rem;cursor:pointer}
.mwvc-house input{border:0;border-bottom:1px dashed #9FBFB4;background:transparent;font-size:.9rem;font-weight:600;width:112px;padding:3px 2px;color:#1A1A1A;border-radius:0}
.mwvc-house input:focus{outline:none;border-bottom:2px solid ${PRIMARY}}
.mwvc-x{border:0;background:none;color:#8a9a95;font-size:1.1rem;cursor:pointer;line-height:1;padding:0 2px}
.mwvc-add{border:1px dashed #BFE6D7;background:#fff;color:${PRIMARY};border-radius:10px;padding:7px 12px;font-weight:600;font-size:.88rem;cursor:pointer;white-space:nowrap}
.mwvc-actions{display:flex;gap:8px}
.mwvc-btn{background:${PRIMARY};color:#fff;border:0;border-radius:8px;padding:9px 14px;font-weight:600;font-size:.92rem;cursor:pointer;white-space:nowrap}
.mwvc-ghost{background:#fff;color:${PRIMARY};border:1px solid #BFE6D7}
.mwvc-tally{display:grid;gap:10px;margin:14px 0 4px}
.mwvc-tally.mwvc-n2{grid-template-columns:1fr 1fr}.mwvc-tally.mwvc-n3{grid-template-columns:1fr 1fr 1fr}
.mwvc-tcard{border:1px solid #E0EBE7;border-radius:12px;padding:10px 12px;background:#FBFDFC;box-sizing:border-box}
@media (min-width:641px){.mwvc-tcard{min-height:142px}}
.mwvc-tcardon{border-color:#9FD4C2}
.mwvc-tname{font-weight:700;font-size:.95rem;margin-bottom:4px}
.mwvc-tcounts{display:flex;flex-wrap:wrap;gap:6px 12px;font-size:.88rem;font-weight:600}
.mwvc-good{color:#0B7A55}.mwvc-unsure{color:#8A6A10}.mwvc-bad{color:#B3261E}
.mwvc-tsub{font-size:.78rem;color:#666;margin-top:2px}
.mwvc-tprob{font-size:.8rem;color:#7A2A24;margin-top:6px;line-height:1.4;min-height:2.8em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mwvc-tnone{color:#8a9a95}
.mwvc-legend{font-size:.86rem;color:#4a5753;margin:14px 0 0;line-height:1.7}
.mwvc-lg{display:inline-block;font-weight:700;border-radius:6px;padding:0 7px;color:#fff;font-size:.8rem;margin:0 2px}
.mwvc-lgood{background:#1F8A5B}.mwvc-lunsure{background:#E0A526;color:#2b2000}.mwvc-lbad{background:#C8382D}
.mwvc-sec h3{font-size:1.05rem;margin:18px 0 6px}
.mwvc-items{list-style:none;margin:0;padding:0;counter-reset:vi}
.mwvc-list{--cw:450px;--n:1}
.mwvc-list.mwvc-n2{--n:2}.mwvc-list.mwvc-n3{--n:3}
.mwvc-item,.mwvc-colhead{display:grid;grid-template-columns:minmax(0,1fr) var(--cw);gap:8px 20px;align-items:start}
.mwvc-item{padding:10px 0;border-bottom:1px solid #F1F4F3;counter-increment:vi}
.mwvc-colhead{padding:0 0 4px;border-bottom:1px solid #E6F0EC}
.mwvc-colname{font-size:.75rem;font-weight:700;color:#5b6e68;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center;padding:2px 4px;border-radius:6px}
.mwvc-colon{background:#E9F6F1;color:#0B5E4E}
.mwvc-text{display:flex;flex-direction:column;gap:2px;font-size:.95rem;line-height:1.45}
.mwvc-text>span:first-child::before{content:counter(vi) ". ";font-weight:700;color:#2A6A58}
.mwvc-note{font-size:.82rem;color:#666}
.mwvc-links{display:flex;flex-wrap:wrap;gap:10px;font-size:.78rem}
.mwvc-links a{color:#0B5E4E}
.mwvc-cells{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:8px}
.mwvc-cell{display:flex;flex-direction:column;gap:6px;min-width:0}
.mwvc-marks{display:flex;gap:4px}
.mwvc-mark{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:5px;height:38px;border:1px solid #D3DFDB;background:#fff;border-radius:8px;padding:0 4px;font-size:.88rem;cursor:pointer;color:#3a3a3a;min-width:0;transition:background .12s,border-color .12s}
.mwvc-mark span:first-child{font-weight:800}
.mwvc-good span:first-child{color:#1F8A5B}.mwvc-unsure span:first-child{color:#B07F12}.mwvc-bad span:first-child{color:#C8382D}
.mwvc-mark:hover{border-color:#9FBFB4}
.mwvc-n2 .mwvc-marklabel,.mwvc-n3 .mwvc-marklabel{display:none}
.mwvc-n2 .mwvc-mark span:first-child,.mwvc-n3 .mwvc-mark span:first-child{font-size:1rem}
.mwvc-good.mwvc-markon{background:#1F8A5B;border-color:#1F8A5B;color:#fff}
.mwvc-unsure.mwvc-markon{background:#E0A526;border-color:#E0A526;color:#2b2000}
.mwvc-bad.mwvc-markon{background:#C8382D;border-color:#C8382D;color:#fff}
.mwvc-markon span:first-child{color:inherit}
.mwvc-answer{width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #D0DAD6;border-radius:6px;font-size:.86rem}
.mwvc-notes{display:grid;gap:10px;margin:16px 0 10px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.mwvc-notecell{display:flex;flex-direction:column;gap:5px}
.mwvc-notecell textarea{width:100%;box-sizing:border-box;border:1px solid #D0DAD6;border-radius:8px;padding:8px;font:inherit;font-size:.9rem;resize:vertical}
@media (max-width:860px){
  .mwvc-item,.mwvc-colhead{grid-template-columns:minmax(0,1fr)}
  .mwvc-colhead>span:first-child{display:none}
}
@media (max-width:640px){
  .mwvc-bar{top:56px;padding:8px 16px}
  .mwvc-house:not(.mwvc-houseon) input,.mwvc-house:not(.mwvc-houseon) .mwvc-x{display:none}
  .mwvc-house:not(.mwvc-houseon){padding:3px}
  .mwvc-houses{flex-wrap:nowrap;gap:6px}
  .mwvc-add{padding:5px 9px;font-size:.8rem;white-space:nowrap}
  .mwvc-actions .mwvc-btn{padding:7px 10px;font-size:.84rem}
  .mwvc-tally.mwvc-n2,.mwvc-tally.mwvc-n3{grid-template-columns:1fr}
  .mwvc-tcard:not(.mwvc-tcardon){display:none}
  .mwvc-item{grid-template-columns:minmax(0,1fr)}
  .mwvc-colhead{display:none}
  .mwvc-cells{grid-template-columns:1fr!important}
  .mwvc-cell:not(.mwvc-cellon){display:none}
  .mwvc-n2 .mwvc-marklabel,.mwvc-n3 .mwvc-marklabel{display:inline}
  .mwvc-notecell:not(.mwvc-cellon){display:none}
  .mwvc-house input{width:72px}
  .mwvc-long{display:none}
  .mwvc-short{display:inline}
  .mwvc-bar{gap:6px}
  .mwvc-houses{overflow-x:auto;scrollbar-width:none}
  .mwvc-house input{width:72px}
}
#mwvc-print-root{display:none}
@media print{
  html,body{background:#fff!important}
  body>*:not(#mwvc-print-root){display:none!important}
  #mwvc-print-root{display:block!important}
  @page{margin:10mm}
  .mwvc-sheet{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#000;font-size:8.6pt;line-height:1.25}
  .mwvc-sheet h1{font-size:13pt;margin:0 0 2pt}
  .mwvc-psum,.mwvc-pdir,.mwvc-pname{margin:0 0 4pt}
  .mwvc-pdir{font-style:italic}
  .mwvc-sheet table{width:100%;border-collapse:collapse}
  .mwvc-sheet th,.mwvc-sheet td{border:1px solid #888;padding:2pt 4pt;text-align:left;vertical-align:top}
  .mwvc-sheet td:first-child{width:46%}
  .mwvc-sheet th:not(:first-child),.mwvc-sheet td:not(:first-child){width:18%}
  .mwvc-paddr{font-weight:400;font-size:8pt;margin-top:2pt}
  .mwvc-psec td{background:#EEE;font-weight:700}
  .mwvc-pbox{display:inline-block;min-width:12pt;font-weight:800}
  .mwvc-pans{display:block;font-size:8pt}
  .mwvc-sheet tr{break-inside:avoid}
  .mwvc-pnotes{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8pt;margin-top:8pt}
  .mwvc-plines{border-bottom:1px solid #999;height:12pt;margin-top:8pt;box-shadow:0 16pt 0 -15pt #999}
  .mwvc-pfoot{font-size:7.5pt;color:#555;margin-top:6pt}
}
`;
