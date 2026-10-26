import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { STATES } from "../data/states";
import { fmtUSD } from "../lib/format";
import {
  DEFAULT_PROFILE, PRESETS, QUESTIONS, ROUTES, SECTIONS, SOURCES, TITLES, USES_LOCATION, FIRST_APARTMENT, MOVE_IN_TIPS,
  buildChecklist, buildShopping, climateDefaults, roomsFor,
  type ChecklistId, type Profile, type Question,
} from "../lib/checklists";
import { PRIMARY, S } from "./calc-ui";

// Checklist island (mindmap-pass 2026-10-25). One component serves all eight /checklists/ pages: the
// reader answers a few questions, the rules in src/lib/checklists.ts drop the items that don't apply,
// ticks and notes persist in this browser, and "Print or save as PDF" prints a clean worksheet
// (a body-level portal, so the site header, page copy and controls never reach the paper).

interface Props {
  initialData?: { checklist?: ChecklistId; picker?: boolean } & Partial<Profile>;
  heading?: string;
  subheading?: string;
}

interface Saved {
  profile: Profile;
  checked: Record<string, boolean>;
  text: Record<string, string>; // condition-report cells + prices, keyed by cell id
}

const STORE = "mw-checklist-v1:";
function load(id: ChecklistId): Saved | null {
  try {
    const raw = window.localStorage.getItem(STORE + id);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}
function save(id: ChecklistId, data: Saved) {
  try {
    window.localStorage.setItem(STORE + id, JSON.stringify(data));
  } catch {
    /* private mode or storage blocked: the tool still works, it just won't remember */
  }
}

const ALL_IDS = Object.keys(TITLES) as ChecklistId[];

function libraryCount(id: ChecklistId): number {
  if (id === "first-apartment") return FIRST_APARTMENT.reduce((n, s) => n + s.items.length, 0);
  if (id === "move-in-move-out") return 0;
  return (SECTIONS[id] ?? []).reduce((n, s) => n + s.items.length, 0);
}

export default function ChecklistBuilder({ initialData, heading, subheading }: Props) {
  const { checklist: initialId = "home-buying", picker = false, ...overrides } = initialData ?? {};
  const [id, setId] = useState<ChecklistId>(initialId);
  const fresh = (cid: ChecklistId): Saved => ({ profile: { ...DEFAULT_PROFILE, ...PRESETS[cid], ...overrides }, checked: {}, text: {} });
  const [data, setData] = useState<Saved>(() => fresh(initialId));
  const [loaded, setLoaded] = useState(false);
  const [dayOneOnly, setDayOneOnly] = useState(false);
  const [printRoot, setPrintRoot] = useState<HTMLElement | null>(null);

  // Restore after mount (localStorage is client-only) and whenever the picker switches checklist.
  useEffect(() => {
    setData(load(id) ?? fresh(id));
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    if (loaded) save(id, data);
  }, [id, data, loaded]);
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "mwcl-print-root";
    document.body.appendChild(el);
    setPrintRoot(el);
    return () => el.remove();
  }, []);

  const p = data.profile;
  const setProfile = (patch: Partial<Profile>) => setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
  const toggle = (key: string) => setData((d) => ({ ...d, checked: { ...d.checked, [key]: !d.checked[key] } }));
  const setText = (key: string, v: string) => setData((d) => ({ ...d, text: { ...d.text, [key]: v } }));

  const mode: "list" | "condition" | "shopping" = id === "move-in-move-out" ? "condition" : id === "first-apartment" ? "shopping" : "list";
  const sections = useMemo(() => (mode === "list" ? buildChecklist(id, p) : []), [id, p, mode]);
  const rooms = useMemo(() => (mode === "condition" ? roomsFor(p) : []), [p, mode]);
  const tips = useMemo(() => MOVE_IN_TIPS.filter((t) => !t.when || t.when(p)), [p]);
  const shopping = useMemo(() => (mode === "shopping" ? buildShopping(p) : []), [p, mode]);

  const listItems = sections.flatMap((s) => s.items);
  const shopItems = shopping.flatMap((s) => s.items);
  const total = mode === "list" ? listItems.length : mode === "shopping" ? shopItems.length : rooms.reduce((n, r) => n + r.items.length, 0);
  const done = mode === "list" ? listItems.filter((i) => data.checked[i.id]).length : mode === "shopping" ? shopItems.filter((i) => data.checked[i.id]).length : 0;
  const lib = libraryCount(id);

  const price = (key: string) => {
    const n = parseFloat((data.text["$" + key] ?? "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };
  const shopTotal = shopItems.reduce((n, i) => n + price(i.id), 0);
  const dayOneTotal = shopItems.filter((i) => i.dayOne).reduce((n, i) => n + price(i.id), 0);
  const leftToBuy = shopItems.filter((i) => !data.checked[i.id]).reduce((n, i) => n + price(i.id), 0);

  const stateName = STATES.find((s) => s.usps === p.state)?.name ?? "";
  const place = [p.city.trim(), stateName].filter(Boolean).join(", ");

  const onState = (usps: string) => setProfile({ state: usps, ...(usps ? climateDefaults(usps) : {}) });
  const reset = () => {
    if (window.confirm("Clear your ticks, notes and prices for this checklist?")) setData((d) => ({ ...d, checked: {}, text: {} }));
  };

  return (
    <div style={S.wrap} className="mwcl">
      <style>{CSS}</style>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}

      <div className="mwcl-grid">
        <div style={S.inputs}>
          {picker && (
            <label style={S.field}>
              <span style={S.label}>Checklist</span>
              <select style={S.input} value={id} onChange={(e) => setId(e.target.value as ChecklistId)}>
                {ALL_IDS.map((c) => (
                  <option key={c} value={c}>{TITLES[c]}</option>
                ))}
              </select>
            </label>
          )}

          {USES_LOCATION[id] && (
            <>
              <div style={S.twoCol}>
                <label style={S.field}>
                  <span style={S.label}>State</span>
                  <select style={S.input} value={p.state} onChange={(e) => onState(e.target.value)}>
                    <option value="">Choose a state</option>
                    {STATES.map((s) => (
                      <option key={s.usps} value={s.usps}>{s.name}</option>
                    ))}
                  </select>
                </label>
                <label style={S.field}>
                  <span style={S.label}>City (for the printout)</span>
                  <input style={S.input} value={p.city} placeholder="Optional" onChange={(e) => setProfile({ city: e.target.value })} />
                </label>
              </div>
              <fieldset className="mwcl-fs">
                <legend style={S.label}>Local conditions</legend>
                <Toggle label="Winters reach freezing" on={p.freeze} set={(v) => setProfile({ freeze: v })} />
                <Toggle label="Hurricane-prone coast" on={p.hurricane} set={(v) => setProfile({ hurricane: v })} />
                <Toggle label="Wildfire area" on={p.wildfire} set={(v) => setProfile({ wildfire: v })} />
                <Toggle label="Earthquake area" on={p.earthquake} set={(v) => setProfile({ earthquake: v })} />
                <p style={S.hint}>Pre-set from your state. Change any of them to match your town.</p>
              </fieldset>
            </>
          )}

          {QUESTIONS[id].map((q) => (
            <QuestionField key={id + q.key} q={q} p={p} set={setProfile} />
          ))}

          {mode === "shopping" && <Toggle label="Show day-one items only" on={dayOneOnly} set={setDayOneOnly} />}
        </div>

        <div className="mwcl-out">
          <div className="mwcl-bar">
            <div>
              <div className="mwcl-count">
                {mode === "condition" ? `${rooms.length} rooms · ${total} items to record` : `${done} of ${total} done`}
              </div>
              {mode === "list" && lib > 0 && <div className="mwcl-sub">{total} of {lib} items apply to your answers</div>}
              {mode === "shopping" && <div className="mwcl-sub">Prices are yours to enter; nothing is pre-filled.</div>}
            </div>
            <div className="mwcl-actions">
              <button type="button" className="mwcl-btn" onClick={() => window.print()}>Print or save as PDF</button>
              <button type="button" className="mwcl-btn mwcl-ghost" onClick={reset}>Clear</button>
            </div>
          </div>

          {mode === "shopping" && (
            <div style={S.statRow} className="mwcl-totals">
              <div style={S.stat}><span style={S.statLabel}>Total of prices entered</span><span style={S.statValue}>{fmtUSD(shopTotal)}</span></div>
              <div style={S.stat}><span style={S.statLabel}>Day-one items</span><span style={S.statValue}>{fmtUSD(dayOneTotal)}</span></div>
              <div style={S.stat}><span style={S.statLabel}>Still to buy (unticked)</span><span style={S.statValue}>{fmtUSD(leftToBuy)}</span></div>
            </div>
          )}

          {mode === "list" &&
            sections.map((s) => (
              <div key={s.id} className="mwcl-sec">
                <h3>{s.title}</h3>
                <ul>
                  {s.items.map((it) => (
                    <li key={it.id}>
                      <label className="mwcl-item">
                        <input type="checkbox" checked={!!data.checked[it.id]} onChange={() => toggle(it.id)} />
                        <span>
                          <span className={data.checked[it.id] ? "mwcl-done" : ""}>{it.text}</span>
                          {it.note && <span className="mwcl-note">{it.note}</span>}
                          {(it.src || it.link) && (
                            <span className="mwcl-links">
                              {it.link && <a href={it.link.href}>{it.link.label}</a>}
                              {it.src && <a href={SOURCES[it.src].url} target="_blank" rel="noopener noreferrer">Source: {SOURCES[it.src].label.split(": ")[0]}</a>}
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          {mode === "condition" && (
            <>
              <ul className="mwcl-tips">
                {tips.map((t) => (
                  <li key={t.id}>{t.text}</li>
                ))}
              </ul>
              {rooms.map((r) => (
                <div key={r.id} className="mwcl-sec">
                  <h3>{r.title}</h3>
                  <div className="mwcl-table" role="table" aria-label={`${r.title} condition`}>
                    <div className="mwcl-row mwcl-th" role="row">
                      <span role="columnheader">Item</span><span role="columnheader">Move-in condition</span><span role="columnheader">Move-out condition</span>
                    </div>
                    {r.items.map((item) => {
                      const k = `${r.id}:${item}`;
                      return (
                        <div key={k} className="mwcl-row" role="row">
                          <span role="cell">{item}</span>
                          <input role="cell" aria-label={`${r.title}, ${item}, move-in`} value={data.text["in:" + k] ?? ""} onChange={(e) => setText("in:" + k, e.target.value)} placeholder="e.g. good, scuff by door" />
                          <input role="cell" aria-label={`${r.title}, ${item}, move-out`} value={data.text["out:" + k] ?? ""} onChange={(e) => setText("out:" + k, e.target.value)} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {mode === "shopping" &&
            shopping.map((s) => {
              const items = dayOneOnly ? s.items.filter((i) => i.dayOne) : s.items;
              if (!items.length) return null;
              return (
                <div key={s.id} className="mwcl-sec">
                  <h3>{s.title}</h3>
                  <ul>
                    {items.map((it) => (
                      <li key={it.id} className="mwcl-buy">
                        <label className="mwcl-item">
                          <input type="checkbox" checked={!!data.checked[it.id]} onChange={() => toggle(it.id)} />
                          <span className={data.checked[it.id] ? "mwcl-done" : ""}>
                            {it.text} {it.dayOne && <span className="mwcl-tag">Day one</span>}
                          </span>
                        </label>
                        <span className="mwcl-price">
                          <span>$</span>
                          <input inputMode="decimal" aria-label={`Price for ${it.text}`} value={data.text["$" + it.id] ?? ""} onChange={(e) => setText("$" + it.id, e.target.value)} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

          <div style={S.disclaimer}>
            A planning aid, not legal or professional advice. Rules on deposits, disclosures and notice differ by state and city; confirm anything legal with your state or a local attorney. Your ticks and notes are saved only in this browser.
          </div>
        </div>
      </div>

      {printRoot &&
        createPortal(
          <PrintSheet
            title={TITLES[id]}
            place={place}
            mode={mode}
            sections={sections}
            rooms={rooms}
            tips={tips.map((t) => t.text)}
            shopping={shopping.map((s) => ({ ...s, items: dayOneOnly ? s.items.filter((i) => i.dayOne) : s.items }))}
            data={data}
            totals={{ shopTotal: dayOneOnly ? dayOneTotal : shopTotal, dayOneTotal }}
            route={ROUTES[id]}
          />,
          printRoot,
        )}
    </div>
  );
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <label className="mwcl-toggle">
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function QuestionField({ q, p, set }: { q: Question; p: Profile; set: (patch: Partial<Profile>) => void }) {
  const value = p[q.key];
  if (q.type === "toggle") return <Toggle label={q.label} on={Boolean(value)} set={(v) => set({ [q.key]: v } as Partial<Profile>)} />;
  if (q.type === "number")
    return (
      <label style={S.field}>
        <span style={S.label}>{q.label}</span>
        <input
          style={S.input}
          type="number"
          min={q.min}
          max={q.max}
          value={Number(value)}
          onChange={(e) => {
            const n = Math.max(q.min, Math.min(q.max, Math.round(Number(e.target.value) || 0)));
            set({ [q.key]: n } as Partial<Profile>);
          }}
        />
      </label>
    );
  return (
    <label style={S.field}>
      <span style={S.label}>{q.label}</span>
      <select style={S.input} value={String(value)} onChange={(e) => set({ [q.key]: e.target.value } as Partial<Profile>)}>
        {q.options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

// ---- Print-only worksheet ---------------------------------------------------------------------------
function PrintSheet(props: {
  title: string;
  place: string;
  mode: "list" | "condition" | "shopping";
  sections: ReturnType<typeof buildChecklist>;
  rooms: ReturnType<typeof roomsFor>;
  tips: string[];
  shopping: ReturnType<typeof buildShopping>;
  data: Saved;
  totals: { shopTotal: number; dayOneTotal: number };
  route: string;
}) {
  const { title, place, mode, sections, rooms, tips, shopping, data, totals, route } = props;
  const box = (k: string) => (data.checked[k] ? "☑" : "☐");
  return (
    <div className="mwcl-sheet">
      <h1>{title}{place ? `: ${place}` : ""}</h1>
      <div className="mwcl-lines">
        <span>Name: ____________________________</span>
        <span>Date: ______________</span>
      </div>
      <div className="mwcl-lines">
        <span>Property address: ______________________________________________</span>
      </div>
      <p className="mwcl-dir">
        {mode === "condition"
          ? "Record the condition of each item at move-in and again at move-out. Both parties sign below."
          : mode === "shopping"
            ? "Tick each item as you buy it. Prices are your own estimates."
            : "Tick each item as you finish it. Items were chosen from your answers on the website."}
      </p>

      {mode === "list" &&
        sections.map((s) => (
          <section key={s.id}>
            <h2>{s.title}</h2>
            {s.items.map((it) => (
              <div key={it.id} className="mwcl-p-item">
                <span className="mwcl-p-box">{box(it.id)}</span>
                <span>{it.text}{it.note ? <em>. {it.note}</em> : null}</span>
              </div>
            ))}
          </section>
        ))}

      {mode === "condition" && (
        <>
          <ul>{tips.map((t) => <li key={t}>{t}</li>)}</ul>
          {rooms.map((r) => (
            <section key={r.id}>
              <h2>{r.title}</h2>
              <table>
                <thead><tr><th>Item</th><th>Move-in condition</th><th>Move-out condition</th></tr></thead>
                <tbody>
                  {r.items.map((item) => {
                    const k = `${r.id}:${item}`;
                    return (
                      <tr key={k}><td>{item}</td><td>{data.text["in:" + k] ?? ""}</td><td>{data.text["out:" + k] ?? ""}</td></tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ))}
          <div className="mwcl-sign">
            <span>Tenant signature: ______________________ Date: ________</span>
            <span>Landlord signature: ____________________ Date: ________</span>
          </div>
        </>
      )}

      {mode === "shopping" && (
        <>
          {shopping.map((s) =>
            s.items.length ? (
              <section key={s.id}>
                <h2>{s.title}</h2>
                {s.items.map((it) => (
                  <div key={it.id} className="mwcl-p-item mwcl-p-buy">
                    <span className="mwcl-p-box">{box(it.id)}</span>
                    <span>{it.text}{it.dayOne ? " (day one)" : ""}</span>
                    <span className="mwcl-p-price">{data.text["$" + it.id] ? `$${data.text["$" + it.id]}` : "$______"}</span>
                  </div>
                ))}
              </section>
            ) : null,
          )}
          <p className="mwcl-dir">Total entered: {fmtUSD(totals.shopTotal)} · Day-one items: {fmtUSD(totals.dayOneTotal)}</p>
        </>
      )}
      <p className="mwcl-foot">From themodernwallet.com{route}. A planning aid, not legal advice; rules differ by state.</p>
    </div>
  );
}

const CSS = `
.mwcl-grid{display:grid;grid-template-columns:minmax(240px,300px) 1fr;gap:24px}
@media (max-width:760px){.mwcl-grid{grid-template-columns:1fr}}
.mwcl-fs{border:1px solid #E0EBE7;border-radius:10px;padding:10px 12px;margin:0;display:flex;flex-direction:column;gap:6px}
.mwcl-toggle{display:flex;align-items:center;gap:8px;font-size:.92rem;color:#333;cursor:pointer}
.mwcl-toggle input{width:18px;height:18px;accent-color:${PRIMARY}}
.mwcl-out{min-width:0;background:#fff;border:1px solid #D8EEE6;border-radius:14px;padding:16px}
.mwcl-bar{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;padding-bottom:10px;border-bottom:1px solid #E6F0EC;margin-bottom:6px}
.mwcl-count{font-size:1.25rem;font-weight:800;color:${PRIMARY}}
.mwcl-sub{font-size:.8rem;color:#666}
.mwcl-actions{display:flex;gap:8px}
.mwcl-btn{background:${PRIMARY};color:#fff;border:0;border-radius:8px;padding:9px 14px;font-weight:600;font-size:.92rem;cursor:pointer}
.mwcl-ghost{background:#fff;color:${PRIMARY};border:1px solid #BFE6D7}
.mwcl-sec h3{font-size:1rem;margin:14px 0 6px}
.mwcl-sec ul,.mwcl-tips{list-style:none;margin:0;padding:0}
.mwcl-tips{margin:10px 0;padding:10px 12px;background:#F4FAF8;border-radius:10px;font-size:.88rem;line-height:1.5}
.mwcl-tips li{margin:2px 0}
.mwcl-item{display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid #F1F4F3;font-size:.95rem;line-height:1.45;cursor:pointer}
.mwcl-item input{width:18px;height:18px;margin-top:2px;flex:none;accent-color:${PRIMARY}}
.mwcl-done{text-decoration:line-through;color:#8a9a95}
.mwcl-note{display:block;font-size:.82rem;color:#666;margin-top:2px}
.mwcl-links{display:flex;flex-wrap:wrap;gap:10px;font-size:.78rem;margin-top:3px}
.mwcl-links a{color:#0B5E4E}
.mwcl-tag{display:inline-block;font-size:.7rem;font-weight:700;color:#0B5E4E;background:#E4F4EF;border-radius:999px;padding:1px 7px;margin-left:4px;vertical-align:middle}
.mwcl-buy{display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #F1F4F3}
.mwcl-buy .mwcl-item{border:0;flex:1}
.mwcl-price{display:flex;align-items:center;gap:3px;color:#888}
.mwcl-price input{width:84px;padding:6px 8px;border:1px solid #D0DAD6;border-radius:6px;font-size:.92rem}
.mwcl-totals{grid-template-columns:repeat(3,1fr);margin:10px 0}
.mwcl-table{display:flex;flex-direction:column}
.mwcl-row{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:6px;align-items:center;padding:4px 0;border-bottom:1px solid #F1F4F3;font-size:.88rem}
.mwcl-row input{width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #D0DAD6;border-radius:6px;font-size:.86rem}
.mwcl-th{font-weight:700;color:#444;font-size:.78rem;text-transform:uppercase;letter-spacing:.03em}
@media (max-width:520px){.mwcl-row{grid-template-columns:1fr 1fr}.mwcl-row>span:first-child{grid-column:1/-1}.mwcl-th>span:first-child{display:none}.mwcl-totals{grid-template-columns:1fr}}
#mwcl-print-root{display:none}
@media print{
  body>*:not(#mwcl-print-root){display:none!important}
  #mwcl-print-root{display:block!important}
  html,body{background:#fff!important}
  @page{margin:16mm}
  .mwcl-sheet{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#000;background:#fff;font-size:11pt}
  .mwcl-sheet h1{font-size:17pt;margin:0 0 8pt}
  .mwcl-sheet h2{font-size:12pt;margin:12pt 0 4pt;border-bottom:1px solid #999;padding-bottom:2pt;break-after:avoid}
  .mwcl-lines{display:flex;gap:24pt;margin:4pt 0}
  .mwcl-dir{font-style:italic;margin:6pt 0}
  .mwcl-p-item{display:flex;gap:8pt;padding:3pt 0;break-inside:avoid}
  .mwcl-p-box{font-size:13pt;line-height:1}
  .mwcl-p-item em{color:#444}
  .mwcl-p-buy .mwcl-p-price{margin-left:auto}
  .mwcl-sheet table{width:100%;border-collapse:collapse;break-inside:auto}
  .mwcl-sheet th,.mwcl-sheet td{border:1px solid #888;padding:5pt;text-align:left;vertical-align:top;font-size:10pt}
  .mwcl-sheet td{height:16pt}
  .mwcl-sheet td:first-child{width:36%}
  .mwcl-sheet tr{break-inside:avoid}
  .mwcl-sign{display:flex;flex-direction:column;gap:14pt;margin-top:18pt}
  .mwcl-foot{margin-top:14pt;font-size:8.5pt;color:#555}
}
`;
