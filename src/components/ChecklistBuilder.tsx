import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { STATES } from "../data/states";
import { fmtUSD } from "../lib/format";
import {
  DEFAULT_PROFILE, PRESETS, QUESTIONS, ROUTES, SECTIONS, SOURCES, TITLES, USES_LOCATION, FIRST_APARTMENT, MOVE_IN_TIPS,
  STATE_LABEL,
  addedBy, buildChecklist, buildShopping, climateDefaults, roomsFor, stageDates, stageLate,
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
  const [answersOpen, setAnswersOpen] = useState(true);
  const [hideDone, setHideDone] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [phase, setPhase] = useState<"in" | "out">("in"); // condition form on phones: which column to fill
  const [activeSec, setActiveSec] = useState("");
  const chipsRef = useRef<HTMLDivElement>(null);
  const miniRef = useRef<HTMLDivElement>(null);

  // Restore after mount (localStorage is client-only) and whenever the picker switches checklist.
  // A returning reader who has already ticked items lands on their list, not on the questions.
  useEffect(() => {
    const saved = load(id);
    setData(saved ? { ...saved, profile: { ...fresh(id).profile, ...saved.profile } } : fresh(id));
    if (saved && Object.values(saved.checked).some(Boolean)) setAnswersOpen(false);
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

  // Navigation model shared by all three modes: one entry per section/room with its progress.
  const navSecs =
    mode === "list"
      ? sections.map((s) => ({ id: s.id, title: s.title, total: s.items.length, done: s.items.filter((i) => data.checked[i.id]).length }))
      : mode === "shopping"
        ? shopping.map((s) => ({ id: s.id, title: s.title, total: s.items.length, done: s.items.filter((i) => data.checked[i.id]).length }))
        : rooms.map((r) => ({ id: r.id, title: r.title, total: r.items.length, done: r.items.filter((it) => (data.text[`${phase}:${r.id}:${it}`] ?? "").trim()).length }));
  const isOpen = (sid: string) => !collapsed[sid];
  const toggleSec = (sid: string) => setCollapsed((c) => ({ ...c, [sid]: !c[sid] }));
  const allOpen = navSecs.every((s) => isOpen(s.id));
  const setAll = (open: boolean) => setCollapsed(Object.fromEntries(navSecs.map((s) => [s.id, !open])));
  const jump = (sid: string) => {
    setCollapsed((c) => ({ ...c, [sid]: false }));
    requestAnimationFrame(() => document.getElementById(`mwcl-sec-${sid}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const pct = total ? Math.round((done / total) * 100) : 0;

  // Highlight the section being read (the last one whose header has passed under the sticky bar)
  // in the jump bar, and keep its chip in view.
  const navKey = navSecs.map((s) => s.id).join("|");
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerWidth <= 640 ? 140 : 240;
      let cur = navSecs[0]?.id ?? "";
      for (const s of navSecs) {
        const el = document.getElementById(`mwcl-sec-${s.id}`);
        if (el && el.getBoundingClientRect().top <= line) cur = s.id;
      }
      setActiveSec(cur);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navKey]);
  useEffect(() => {
    for (const box of [chipsRef.current, miniRef.current]) {
      const chip = box?.querySelector<HTMLElement>(`[data-sec="${activeSec}"]`);
      if (box && chip && box.scrollWidth > box.clientWidth) {
        const left = chip.getBoundingClientRect().left - box.getBoundingClientRect().left + box.scrollLeft - 8;
        box.scrollTo({ left, behavior: "smooth" });
      }
    }
  }, [activeSec]);

  // One-line summary of the answers, shown when the answers panel is collapsed.
  const summary = [
    picker ? TITLES[id] : "",
    stateName,
    ...QUESTIONS[id].map((q) => {
      const v = p[q.key];
      if (q.type === "toggle") return v ? q.label : "";
      if (q.type === "number") return `${q.label.replace(/ \(.*\)$/, "")}: ${v}`;
      if (q.type === "date") return v ? `Moving ${new Date(String(v) + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "";
      return q.options.find((o) => o.value === String(v))?.label ?? "";
    }),
    ...(USES_LOCATION[id] ? [p.freeze && "Freezing winters", p.hurricane && "Hurricane coast", p.wildfire && "Wildfire area", p.earthquake && "Earthquake area"] : []),
  ].filter(Boolean).join(" · ");

  const secHead = (s: { id: string; title: string; done: number; total: number }, unit = "done", window?: [number, number]) => {
    const dates = stageDates(window, p.moveDate);
    const late = dates && s.done < s.total && stageLate(window, p.moveDate);
    return (
      <button type="button" className="mwcl-sechead" aria-expanded={isOpen(s.id)} onClick={() => toggleSec(s.id)}>
        <svg className={`mwcl-chev${isOpen(s.id) ? " mwcl-chevopen" : ""}`} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="mwcl-sectitle">
          {s.title}
          {dates && <span className="mwcl-secdate">{dates}{late && <span className="mwcl-late">Catch up now</span>}</span>}
        </span>
        <span className={`mwcl-secprog${s.done === s.total && s.total ? " mwcl-secdone" : ""}`}>{s.done}/{s.total} {unit}</span>
      </button>
    );
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

      <section className="mwcl-answers" aria-label="Your answers">
        <div className="mwcl-ahead">
          <div>
            <div className="mwcl-alabel">Your answers</div>
            {!answersOpen && <div className="mwcl-summary">{summary || "Nothing chosen yet"}</div>}
          </div>
          <button type="button" className="mwcl-link" aria-expanded={answersOpen} onClick={() => setAnswersOpen((o) => !o)}>
            {answersOpen ? "Hide answers" : "Edit answers"}
          </button>
        </div>

        {answersOpen && (
          <>
            <div className="mwcl-qgrid">
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
                  <label style={S.field}>
                    <span style={S.label}>{STATE_LABEL[id] ?? "State"}</span>
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
                </>
              )}
              {QUESTIONS[id].filter((q) => q.type !== "toggle").map((q) => (
                <QuestionField key={id + q.key} q={q} p={p} set={setProfile} />
              ))}
            </div>

            {(QUESTIONS[id].some((q) => q.type === "toggle") || mode === "shopping") && (
              <div className="mwcl-chiprow">
                {QUESTIONS[id].filter((q) => q.type === "toggle").map((q) => (
                  <Chip key={id + q.key} label={q.label} on={Boolean(p[q.key])} adds={addedBy(id, p, q.key)} set={(v) => setProfile({ [q.key]: v } as Partial<Profile>)} />
                ))}
                {mode === "shopping" && <Chip label="Show day-one items only" on={dayOneOnly} set={setDayOneOnly} />}
              </div>
            )}

            {USES_LOCATION[id] && (
              <div className="mwcl-climate">
                <span style={S.label}>Local conditions</span>
                <div className="mwcl-chiprow">
                  <Chip label="Winters reach freezing" on={p.freeze} adds={addedBy(id, p, "freeze")} set={(v) => setProfile({ freeze: v })} />
                  <Chip label="Hurricane-prone coast" on={p.hurricane} adds={addedBy(id, p, "hurricane")} set={(v) => setProfile({ hurricane: v })} />
                  <Chip label="Wildfire area" on={p.wildfire} adds={addedBy(id, p, "wildfire")} set={(v) => setProfile({ wildfire: v })} />
                  <Chip label="Earthquake area" on={p.earthquake} adds={addedBy(id, p, "earthquake")} set={(v) => setProfile({ earthquake: v })} />
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <div className="mwcl-out">
        <div className="mwcl-bar">
          <div className="mwcl-barrow">
            <div>
              <div className="mwcl-count">
                {mode === "condition" ? `${rooms.length} rooms · ${total} items to record` : `${done} of ${total} done`}
              </div>
              {mode === "list" && lib > 0 && <div className="mwcl-sub">{total} of {lib} items apply to your answers</div>}
              {mode === "shopping" && <div className="mwcl-sub">Prices are yours to enter; nothing is pre-filled.</div>}
            </div>
            <div className="mwcl-actions">
              {mode !== "condition" && <Chip label="Hide done" on={hideDone} set={setHideDone} small />}
              <button type="button" className="mwcl-link mwcl-collapse" onClick={() => setAll(!allOpen)}>{allOpen ? "Collapse all" : "Expand all"}</button>
              <button type="button" className="mwcl-btn mwcl-print" onClick={() => window.print()}>Print or save as PDF</button>
              <button type="button" className="mwcl-btn mwcl-ghost mwcl-clear" onClick={reset}>Clear</button>
            </div>
          </div>
          {mode !== "condition" && (
            <div className="mwcl-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Checklist progress">
              <span style={{ width: `${pct}%` }} />
            </div>
          )}
          <div className="mwcl-navrow">
            <nav className="mwcl-chips" aria-label="Jump to section" ref={chipsRef}>
              {navSecs.map((s) => (
                <button key={s.id} type="button" data-sec={s.id} aria-current={activeSec === s.id ? "true" : undefined} className={`mwcl-jump${s.done === s.total && s.total ? " mwcl-jumpdone" : ""}${activeSec === s.id ? " mwcl-jumpon" : ""}`} onClick={() => jump(s.id)}>
                  {s.title.replace(/^\d+\.\s*/, "")} <b>{s.done}/{s.total}</b>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mwcl-mini" aria-hidden="true">
          <span className="mwcl-minicount">{mode === "condition" ? `${rooms.length} rooms` : mode === "shopping" && leftToBuy > 0 ? `${done}/${total} · ${fmtUSD(leftToBuy)} left` : `${done}/${total}`}</span>
          <div className="mwcl-minichips" ref={miniRef}>
            {navSecs.map((s) => (
              <button key={s.id} type="button" tabIndex={-1} data-sec={s.id} className={`mwcl-jump${s.done === s.total && s.total ? " mwcl-jumpdone" : ""}${activeSec === s.id ? " mwcl-jumpon" : ""}`} onClick={() => jump(s.id)}>
                {s.title.replace(/^\d+\.\s*/, "")} <b>{s.done}/{s.total}</b>
              </button>
            ))}
          </div>
        </div>

        {mode === "shopping" && (
          <div style={S.statRow} className="mwcl-totals">
            <div style={S.stat}><span style={S.statLabel}>Total entered</span><span style={S.statValue}>{fmtUSD(shopTotal)}</span></div>
            <div style={S.stat}><span style={S.statLabel}>Day one</span><span style={S.statValue}>{fmtUSD(dayOneTotal)}</span></div>
            <div style={S.stat}><span style={S.statLabel}>Still to buy</span><span style={S.statValue}>{fmtUSD(leftToBuy)}</span></div>
          </div>
        )}

        {mode === "list" &&
          sections.map((s, i) => {
            const items = hideDone ? s.items.filter((it) => !data.checked[it.id]) : s.items;
            return (
              <div key={s.id} id={`mwcl-sec-${s.id}`} className="mwcl-sec">
                {secHead(navSecs[i], "done", s.window)}
                {isOpen(s.id) && (items.length ? (
                  <ul className="mwcl-items">
                    {items.map((it) => (
                      <li key={it.id}>
                        <label className="mwcl-item">
                          <input type="checkbox" checked={!!data.checked[it.id]} onChange={() => toggle(it.id)} />
                          <span>
                            <span className={data.checked[it.id] ? "mwcl-done" : ""}>{it.text}</span>
                            {it.note && <span className="mwcl-note">{it.note}</span>}
                            {(it.src || it.link) && (
                              <span className="mwcl-links">
                                {it.link && <a href={it.link.href}>{it.link.label}</a>}
                                {it.src && <a href={SOURCES[it.src].url} target="_blank" rel="noopener noreferrer">{it.cta ?? `Source: ${SOURCES[it.src].label.split(": ")[0]}`}</a>}
                              </span>
                            )}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mwcl-alldone">All done in this section.</p>)}
              </div>
            );
          })}

        {mode === "condition" && (
          <>
            <ul className="mwcl-tips">
              {tips.map((t) => (
                <li key={t.id}>{t.text}</li>
              ))}
            </ul>
            <div className="mwcl-phase" role="group" aria-label="Which column you're filling in">
              <span className="mwcl-phaselabel">Filling in</span>
              <button type="button" aria-pressed={phase === "in"} className={phase === "in" ? "mwcl-phaseon" : ""} onClick={() => setPhase("in")}>Move-in</button>
              <button type="button" aria-pressed={phase === "out"} className={phase === "out" ? "mwcl-phaseon" : ""} onClick={() => setPhase("out")}>Move-out</button>
            </div>
            {rooms.map((r, i) => (
              <div key={r.id} id={`mwcl-sec-${r.id}`} className="mwcl-sec">
                {secHead(navSecs[i], "recorded")}
                {isOpen(r.id) && (
                  <div className={`mwcl-table mwcl-show-${phase}`} role="table" aria-label={`${r.title} condition`}>
                    <div className="mwcl-row mwcl-th" role="row">
                      <span role="columnheader">Item</span><span role="columnheader" className="mwcl-cin">Move-in condition</span><span role="columnheader" className="mwcl-cout">Move-out condition</span>
                    </div>
                    {r.items.map((item) => {
                      const k = `${r.id}:${item}`;
                      return (
                        <div key={k} className="mwcl-row" role="row">
                          <span role="cell">
                            {item}
                            {phase === "out" && (data.text["in:" + k] ?? "").trim() && <span className="mwcl-was">At move-in: {data.text["in:" + k]}</span>}
                          </span>
                          <input role="cell" className="mwcl-cin" aria-label={`${r.title}, ${item}, move-in`} value={data.text["in:" + k] ?? ""} onChange={(e) => setText("in:" + k, e.target.value)} placeholder="e.g. good, scuff by door" />
                          <input role="cell" className="mwcl-cout" aria-label={`${r.title}, ${item}, move-out`} value={data.text["out:" + k] ?? ""} onChange={(e) => setText("out:" + k, e.target.value)} placeholder="Condition at move-out" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {mode === "shopping" &&
          shopping.map((s, i) => {
            let items = dayOneOnly ? s.items.filter((it) => it.dayOne) : s.items;
            if (hideDone) items = items.filter((it) => !data.checked[it.id]);
            if (dayOneOnly && !s.items.some((it) => it.dayOne)) return null;
            return (
              <div key={s.id} id={`mwcl-sec-${s.id}`} className="mwcl-sec">
                {secHead(navSecs[i])}
                {isOpen(s.id) && (items.length ? (
                  <ul className="mwcl-items">
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
                ) : <p className="mwcl-alldone">All done in this section.</p>)}
              </div>
            );
          })}

        <div style={S.disclaimer}>
          A planning aid, not legal or professional advice. Rules on deposits, disclosures and notice differ by state and city; confirm anything legal with your state or a local attorney. Your ticks and notes are saved only in this browser.
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

function Chip({ label, on, set, small, adds }: { label: string; on: boolean; set: (v: boolean) => void; small?: boolean; adds?: number }) {
  return (
    <button type="button" className={`mwcl-chip${on ? " mwcl-chipon" : ""}${small ? " mwcl-chipsm" : ""}`} aria-pressed={on} onClick={() => set(!on)}>
      <span aria-hidden="true">{on ? "✓" : "+"}</span> {label}
      {adds ? <em className="mwcl-adds" title={`${adds} ${adds === 1 ? "item" : "items"}`}>+{adds}</em> : null}
    </button>
  );
}

function QuestionField({ q, p, set }: { q: Question; p: Profile; set: (patch: Partial<Profile>) => void }) {
  const value = p[q.key];
  if (q.type === "toggle") return <Toggle label={q.label} on={Boolean(value)} set={(v) => set({ [q.key]: v } as Partial<Profile>)} />;
  if (q.type === "date")
    return (
      <label style={S.field}>
        <span style={S.label}>{q.label}</span>
        <input style={S.input} type="date" value={String(value ?? "")} onChange={(e) => set({ [q.key]: e.target.value } as Partial<Profile>)} />
      </label>
    );
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
  const moveDate = data.profile.moveDate ?? "";
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
            <h2>{s.title}{stageDates(s.window, moveDate) ? ` (${stageDates(s.window, moveDate)})` : ""}</h2>
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
.mwcl-answers{background:#fff;border:1px solid #D8EEE6;border-radius:14px;padding:14px 16px;margin-bottom:16px}
.mwcl-ahead{display:flex;justify-content:space-between;align-items:center;gap:12px}
.mwcl-alabel{font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#2A6A58}
.mwcl-summary{font-size:.92rem;color:#333;margin-top:3px;line-height:1.45}
.mwcl-link{background:none;border:0;padding:4px 2px;color:${PRIMARY};font-weight:600;font-size:.9rem;cursor:pointer;white-space:nowrap;text-decoration:underline;text-underline-offset:3px}
.mwcl-qgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px 16px;margin-top:12px}
.mwcl-chiprow{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.mwcl-climate{margin-top:14px;padding-top:12px;border-top:1px solid #EEF2F0}
.mwcl-climate .mwcl-chiprow{margin-top:6px}
.mwcl-climate p{margin-top:6px}
.mwcl-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid #CFE3DC;background:#fff;color:#2c2c2c;border-radius:999px;padding:7px 13px;font-size:.88rem;cursor:pointer;line-height:1.2}
.mwcl-chip span{font-weight:700;color:#8aa39b;width:12px;text-align:center}
.mwcl-adds{font-style:normal;font-size:.74rem;font-weight:700;color:#2A6A58;background:#EEF6F3;border-radius:999px;padding:1px 7px;margin-left:2px}
.mwcl-chipon .mwcl-adds{background:#fff}
.mwcl-hint{font-size:.85rem;color:#555;line-height:1.5;margin:10px 0 0}
.mwcl-chipon{background:#E4F4EF;border-color:${PRIMARY};color:#0B5E4E;font-weight:600}
.mwcl-chipon span{color:${PRIMARY}}
.mwcl-chipsm{padding:5px 11px;font-size:.82rem}
.mwcl-toggle{display:flex;align-items:center;gap:8px;font-size:.92rem;color:#333;cursor:pointer}
.mwcl-toggle input{width:18px;height:18px;accent-color:${PRIMARY}}
.mwcl-out{min-width:0;background:#fff;border:1px solid #D8EEE6;border-radius:14px;padding:0 16px 16px}
.mwcl-bar{position:sticky;top:60px;z-index:5;background:#fff;margin:0 -16px;padding:12px 16px 8px;border-bottom:1px solid #E6F0EC;border-radius:14px 14px 0 0}
.mwcl-barrow{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px}
.mwcl-count{font-size:1.25rem;font-weight:800;color:${PRIMARY}}
.mwcl-sub{font-size:.8rem;color:#666}
.mwcl-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px}
.mwcl-btn{background:${PRIMARY};color:#fff;border:0;border-radius:8px;padding:9px 14px;font-weight:600;font-size:.92rem;cursor:pointer}
.mwcl-ghost{background:#fff;color:${PRIMARY};border:1px solid #BFE6D7}
.mwcl-progress{height:6px;background:#EEF4F1;border-radius:999px;overflow:hidden;margin:10px 0 2px}
.mwcl-progress span{display:block;height:100%;background:${PRIMARY};transition:width .25s}
.mwcl-navrow{display:flex;align-items:center;gap:10px;margin-top:8px}
.mwcl-chips{display:flex;gap:6px;flex:1;min-width:0;padding-bottom:4px;overflow-x:auto;scrollbar-width:none}
.mwcl-chips::-webkit-scrollbar,.mwcl-minichips::-webkit-scrollbar{display:none}
.mwcl-jump{flex:none;border:1px solid #E0EBE7;background:#F7FBF9;color:#333;border-radius:999px;padding:5px 11px;font-size:.8rem;cursor:pointer;white-space:nowrap}
.mwcl-jump b{color:#2A6A58;font-weight:700;margin-left:2px}
.mwcl-jumpdone{background:#E4F4EF;border-color:#BFE6D7}
.mwcl-jumpon{border-color:${PRIMARY};box-shadow:inset 0 0 0 1px ${PRIMARY};color:#0B5E4E;font-weight:600}
.mwcl-tools{display:flex;align-items:center;gap:8px;flex:none}
.mwcl-mini{display:none}
.mwcl-sec{scroll-margin-top:170px;border-bottom:1px solid #E3ECE8;padding-bottom:8px}
.mwcl-sec:last-of-type{border-bottom:0}
.mwcl-sechead{display:flex;align-items:center;gap:12px;width:100%;background:none;border:0;padding:22px 0 12px;cursor:pointer;text-align:left;font:inherit;color:inherit;min-height:44px}
.mwcl-chev{flex:none;color:#2A6A58;transition:transform .15s}
.mwcl-chevopen{transform:rotate(90deg)}
.mwcl-sectitle{font-size:1.08rem;font-weight:700;flex:1;line-height:1.3}
.mwcl-secdate{display:block;font-size:.84rem;font-weight:500;color:#2A6A58;margin-top:3px}
.mwcl-late{display:inline-block;margin-left:8px;font-size:.72rem;font-weight:700;color:#8A4B00;background:#FFF1DC;border-radius:999px;padding:1px 8px}
.mwcl-secprog{font-size:.8rem;color:#666;background:#F4F7F6;border-radius:999px;padding:2px 9px;white-space:nowrap}
.mwcl-secdone{background:#E4F4EF;color:#0B5E4E;font-weight:600}
.mwcl-items{list-style:none;margin:0 0 8px;padding:0 0 0 28px;columns:2 330px;column-gap:32px}
.mwcl-items>li{break-inside:avoid}
.mwcl-alldone{font-size:.88rem;color:#666;margin:0 0 12px 24px}
.mwcl-tips{list-style:disc;margin:14px 0;padding:12px 14px 12px 32px;background:#F4FAF8;border-radius:10px;font-size:.9rem;line-height:1.5}
.mwcl-tips li{margin:4px 0}
.mwcl-phase{display:none}
.mwcl-was{display:none}
.mwcl-item{display:flex;gap:12px;align-items:flex-start;padding:12px 0 14px;border-bottom:1px solid #EEF2F0;font-size:.97rem;line-height:1.5;cursor:pointer;height:100%;box-sizing:border-box}
.mwcl-item input{width:22px;height:22px;margin:0;flex:none;accent-color:${PRIMARY}}
.mwcl-done{text-decoration:line-through;color:#8a9a95}
.mwcl-note{display:block;font-size:.85rem;color:#5c6763;margin-top:4px;line-height:1.45}
.mwcl-links{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.82rem;margin-top:8px}
.mwcl-links a{padding:2px 0}
.mwcl-links a{color:#0B5E4E}
.mwcl-tag{display:inline-block;font-size:.7rem;font-weight:700;color:#0B5E4E;background:#E4F4EF;border-radius:999px;padding:1px 7px;margin-left:4px;vertical-align:middle}
.mwcl-buy{display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #F1F4F3}
.mwcl-buy .mwcl-item{border:0;flex:1}
.mwcl-price{display:flex;align-items:center;gap:3px;color:#888}
.mwcl-price input{width:84px;padding:6px 8px;border:1px solid #D0DAD6;border-radius:6px;font-size:.92rem}
.mwcl-totals{grid-template-columns:repeat(3,1fr);margin:12px 0 4px}
.mwcl-table{display:flex;flex-direction:column;margin-bottom:12px}
.mwcl-row{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:8px;align-items:center;padding:4px 0;border-bottom:1px solid #F1F4F3;font-size:.88rem}
.mwcl-row input{width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #D0DAD6;border-radius:6px;font-size:.86rem}
.mwcl-th{font-weight:700;color:#444;font-size:.78rem;text-transform:uppercase;letter-spacing:.03em}
@media (max-width:640px){
  .mwcl-qgrid{grid-template-columns:1fr 1fr}
  .mwcl-bar{position:static;border-radius:14px 14px 0 0}
  .mwcl-navrow{display:none}
  .mwcl-actions{width:100%;display:grid;grid-template-columns:auto auto 1fr;align-items:center;gap:10px 14px}
  .mwcl-print{grid-column:1/-1;order:-1;width:100%;padding:12px 14px;font-size:1rem}
  .mwcl-clear{justify-self:end;background:none;border:0;color:#666;text-decoration:underline;text-underline-offset:3px;padding:4px 2px;font-weight:600}
  .mwcl-items{padding-left:0;columns:1}
  .mwcl-sechead{padding:18px 0 10px}
  .mwcl-phase{display:flex;align-items:stretch;gap:0;margin:0 0 6px;border:1px solid #CFE3DC;border-radius:10px;overflow:hidden}
  .mwcl-phaselabel{display:flex;align-items:center;padding:0 12px;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#2A6A58;background:#F4FAF8}
  .mwcl-phase button{flex:1;background:#fff;border:0;padding:10px 8px;font:inherit;font-size:.9rem;color:#2c2c2c;cursor:pointer}
  .mwcl-phase .mwcl-phaseon{background:#E4F4EF;color:#0B5E4E;font-weight:700}
  .mwcl-mini{display:flex;align-items:center;gap:8px;position:sticky;top:56px;z-index:5;background:#fff;margin:0 -16px;padding:8px 16px;border-bottom:1px solid #E6F0EC}
  .mwcl-minicount{flex:none;font-weight:800;color:${PRIMARY};font-size:.95rem}
  .mwcl-minichips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
  .mwcl-sec{scroll-margin-top:110px}
}
@media (max-width:420px){.mwcl-qgrid{grid-template-columns:1fr}}
@media (max-width:640px){
  .mwcl-row{grid-template-columns:1fr;gap:6px;padding:10px 0}
  .mwcl-row input{padding:10px 12px;font-size:1rem}
  .mwcl-th{display:none}
  .mwcl-show-in .mwcl-cout,.mwcl-show-out .mwcl-cin{display:none}
  .mwcl-show-out .mwcl-was{display:block;font-size:.82rem;color:#5c6763;margin-top:2px}
  .mwcl-totals{grid-template-columns:repeat(3,1fr);gap:8px}
  .mwcl-totals>div{padding:10px!important}
}
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
