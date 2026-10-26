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
            <p className="mwvc-hint">Your state sets the local conditions as a starting point; tap to change them for the town.</p>
          </>
        )}
      </section>

      <section className="mwvc-card mwvc-out" aria-label="Viewing checklist">
        <div className="mwvc-bar">
          <div className="mwvc-houses" role="tablist" aria-label="Houses">
            {data.houses.map((h, i) => (
              <div key={i} className={`mwvc-house${active === i ? " mwvc-houseon" : ""}`}>
                <button type="button" role="tab" aria-selected={active === i} className="mwvc-housetab" onClick={() => setActive(i)}>{i + 1}</button>
                <input aria-label={`Name for house ${i + 1}`} value={h.name} onChange={(e) => setHouse(i, { name: e.target.value })} onFocus={() => setActive(i)} />
                {data.houses.length > 1 && <button type="button" className="mwvc-x" aria-label={`Remove ${h.name || `House ${i + 1}`}`} onClick={() => removeHouse(i)}>×</button>}
              </div>
            ))}
            {data.houses.length < MAX_HOUSES && <button type="button" className="mwvc-add" onClick={addHouse}>+ Add a house<span className="mwvc-addlong"> to compare</span></button>}
          </div>
          <div className="mwvc-actions">
            <button type="button" className="mwvc-btn" onClick={() => window.print()}>Print or save as PDF</button>
            <button type="button" className="mwvc-btn mwvc-ghost" onClick={reset}>Clear</button>
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
                {pr.length > 0 && (
                  <div className="mwvc-tprob">Problems: {pr.slice(0, 3).map((it) => it.short ?? it.text.split(/[:?]/)[0]).join("; ")}{pr.length > 3 ? `; +${pr.length - 3} more` : ""}</div>
                )}
              </div>
            );
          })}
        </div>

        {sections.map((s) => (
          <div key={s.id} className="mwvc-sec">
            <h3>{s.title}</h3>
            <ol className="mwvc-items">
              {s.items.map((it) => (
                <li key={it.id} className={`mwvc-item mwvc-n${data.houses.length}`}>
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
                        {data.houses.length > 1 && <span className="mwvc-cellname">{h.name || `House ${i + 1}`}</span>}
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

        <div className="mwvc-notes">
          {data.houses.map((h, i) => (
            <label key={i} className={`mwvc-notecell${active === i ? " mwvc-cellon" : ""}`}>
              <span style={S.label}>Notes on {h.name || `House ${i + 1}`}</span>
              <textarea rows={3} value={h.notes} onFocus={() => setActive(i)} onChange={(e) => setHouse(i, { notes: e.target.value })} placeholder="Price, layout, what you liked, what to ask next" />
            </label>
          ))}
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
.mwvc-hint{font-size:.82rem;color:#666;margin:6px 0 0}
.mwvc-out{padding-top:0}
.mwvc-bar{position:sticky;top:60px;z-index:5;background:#fff;margin:0 -16px;padding:12px 16px 10px;border-bottom:1px solid #E6F0EC;border-radius:14px 14px 0 0;display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center}
.mwvc-houses{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.mwvc-house{display:flex;align-items:center;gap:4px;border:1px solid #D8E6E1;border-radius:10px;padding:3px 6px 3px 3px;background:#F7FBF9}
.mwvc-houseon{border-color:${PRIMARY};background:#E9F6F1}
.mwvc-housetab{width:24px;height:24px;border-radius:7px;border:0;background:${PRIMARY};color:#fff;font-weight:700;font-size:.8rem;cursor:pointer}
.mwvc-house input{border:0;background:transparent;font-size:.9rem;font-weight:600;width:110px;padding:4px 2px;color:#1A1A1A}
.mwvc-x{border:0;background:none;color:#8a9a95;font-size:1.1rem;cursor:pointer;line-height:1;padding:0 2px}
.mwvc-add{border:1px dashed #BFE6D7;background:#fff;color:${PRIMARY};border-radius:10px;padding:7px 12px;font-weight:600;font-size:.88rem;cursor:pointer}
.mwvc-actions{display:flex;gap:8px}
.mwvc-btn{background:${PRIMARY};color:#fff;border:0;border-radius:8px;padding:9px 14px;font-weight:600;font-size:.92rem;cursor:pointer}
.mwvc-ghost{background:#fff;color:${PRIMARY};border:1px solid #BFE6D7}
.mwvc-tally{display:grid;gap:10px;margin:14px 0 4px}
.mwvc-tally.mwvc-n2{grid-template-columns:1fr 1fr}.mwvc-tally.mwvc-n3{grid-template-columns:1fr 1fr 1fr}
.mwvc-tcard{border:1px solid #E0EBE7;border-radius:12px;padding:10px 12px;background:#FBFDFC}
.mwvc-tcardon{border-color:#9FD4C2}
.mwvc-tname{font-weight:700;font-size:.95rem;margin-bottom:4px}
.mwvc-tcounts{display:flex;flex-wrap:wrap;gap:6px 12px;font-size:.88rem;font-weight:600}
.mwvc-good{color:#0B7A55}.mwvc-unsure{color:#8A6A10}.mwvc-bad{color:#B3261E}
.mwvc-tsub{font-size:.78rem;color:#666;margin-top:2px}
.mwvc-tprob{font-size:.8rem;color:#7A2A24;margin-top:6px;line-height:1.4}
.mwvc-sec h3{font-size:1.05rem;margin:18px 0 6px}
.mwvc-items{list-style:none;margin:0;padding:0;counter-reset:vi}
.mwvc-item{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:10px 18px;align-items:start;padding:10px 0;border-bottom:1px solid #F1F4F3;counter-increment:vi}
.mwvc-item.mwvc-n2,.mwvc-item.mwvc-n3{grid-template-columns:minmax(0,1fr)}
.mwvc-text{display:flex;flex-direction:column;gap:2px;font-size:.95rem;line-height:1.45}
.mwvc-text>span:first-child::before{content:counter(vi) ". ";font-weight:700;color:#2A6A58}
.mwvc-note{font-size:.82rem;color:#666}
.mwvc-links{display:flex;flex-wrap:wrap;gap:10px;font-size:.78rem}
.mwvc-links a{color:#0B5E4E}
.mwvc-cells{display:grid;gap:8px}
.mwvc-n2 .mwvc-cells{grid-template-columns:1fr 1fr}.mwvc-n3 .mwvc-cells{grid-template-columns:1fr 1fr 1fr}
.mwvc-cell{display:flex;flex-direction:column;gap:5px;min-width:0}
.mwvc-cellname{font-size:.72rem;font-weight:700;color:#5b6e68;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mwvc-marks{display:flex;gap:4px}
.mwvc-mark{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;border:1px solid #D6E2DE;background:#fff;border-radius:8px;padding:6px 4px;font-size:.82rem;cursor:pointer;color:#444;min-width:0}
.mwvc-mark span:first-child{font-weight:800}
.mwvc-n3 .mwvc-marklabel{display:none}
.mwvc-good.mwvc-markon{background:#E3F5EC;border-color:#5DBB8F;color:#0B6B49}
.mwvc-unsure.mwvc-markon{background:#FBF2DC;border-color:#E2C06A;color:#7A5A12}
.mwvc-bad.mwvc-markon{background:#FBE7E5;border-color:#E39A93;color:#9E2A21}
.mwvc-answer{width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #D0DAD6;border-radius:6px;font-size:.86rem}
.mwvc-notes{display:grid;gap:10px;margin:16px 0 10px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.mwvc-notecell{display:flex;flex-direction:column;gap:5px}
.mwvc-notecell textarea{width:100%;box-sizing:border-box;border:1px solid #D0DAD6;border-radius:8px;padding:8px;font:inherit;font-size:.9rem;resize:vertical}
@media (max-width:640px){
  .mwvc-bar{top:56px;padding:8px 16px}
  .mwvc-house:not(.mwvc-houseon) input,.mwvc-house:not(.mwvc-houseon) .mwvc-x{display:none}
  .mwvc-house:not(.mwvc-houseon){padding:3px}
  .mwvc-houses{flex-wrap:nowrap;gap:6px}
  .mwvc-add{padding:5px 9px;font-size:.8rem;white-space:nowrap}
  .mwvc-actions .mwvc-btn{padding:7px 10px;font-size:.84rem}
  .mwvc-tally.mwvc-n2,.mwvc-tally.mwvc-n3{grid-template-columns:1fr}
  .mwvc-tcard:not(.mwvc-tcardon){display:none}
  .mwvc-n2 .mwvc-cells,.mwvc-n3 .mwvc-cells{grid-template-columns:1fr}
  .mwvc-cell:not(.mwvc-cellon){display:none}
  .mwvc-n3 .mwvc-marklabel{display:inline}
  .mwvc-cellname{display:none}
  .mwvc-notecell:not(.mwvc-cellon){display:none}
  .mwvc-house input{width:96px}
  .mwvc-addlong{display:none}
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
