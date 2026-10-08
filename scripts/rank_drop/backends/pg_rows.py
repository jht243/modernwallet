"""Backend: pages are rows in a Postgres table (rankandpay.org / jht243/vet_tools: `landing_pages`).

Git stays the record; the database is where the page lives. Every edit is computed in Python from a
snapshot of the row, then written as a dated, idempotent SQLAlchemy script under scripts/ (the same
shape the site's other routines use) plus an equivalent guarded .sql for the Supabase MCP. The
script is what changes the live row; the commit that adds it is the audit trail.

site.json "pg" block (defaults = rankandpay):
  server_file        "server.py"                      Flask app; routes are resolved from its AST
  table              "landing_pages"
  snapshot_dir       "reports/rank-drop/pg-snapshots" before/after/cached row snapshots
  script_dir         "scripts"                         where rank_drop_<YYYYMMDD>_<slug>.py goes
  field_limits       "scripts/seo_field_limits.py"     TITLE/SUMMARY/SUBTITLE limits + checker
  database_url_env   "DATABASE_URL"                    env var holding the DSN (never .env)
  bust_cache         false                             POST /admin/regen-report (ADMIN_TOKEN) after a live write
Top-level "trailing_slash": true (rankandpay URLs end in "/").

Fields (templates/landing.html.j2 + src/page_renderer.py):
  meta title       = title    (renderer clips at 70 on a word boundary; used VERBATIM, brand included)
  meta description = summary  (clipped at 160) — ALSO the visible hero paragraph
  H1               = subtitle or title
  body             = body_html (<h2>/<p>, no ids); a body FAQ <h2> is stripped when faq_json is set
  FAQ              = faq_json [{question, answer}] (plain text, autoescaped)
  Key takeaways    = sections_json [str]
  date             = updated_at ("Last updated", sitemap, JSON-LD) — set explicitly: raw SQL has no ORM onupdate

Locating is offline: server.py's @app.route functions are parsed (AST) into (route pattern -> page_key
template + allowlist guards), e.g. /explainers/<slug>/ -> explainer:{slug} if slug in EXPLAINER_SLUGS.
The row (`native`) comes from a read-only SELECT when $DATABASE_URL is set, else from the cached
snapshot <snapshot_dir>/<safe page_key>.json (":" in page_key -> "__"). With neither, locate() returns
None (prepare_pages records "page source not found") — save one with save_snapshot() from a Supabase
MCP `SELECT` (snapshot_select_sql()) to work offline.

Writes: apply() never touches the DB itself. Dry run writes the script (+ .sql + preview diff) only.
Real run executes the script in a subprocess with $DATABASE_URL; without it returns
ok=False 'DATABASE_URL missing — apply via Supabase MCP' and leaves the guarded .sql to run there.
Live pages are cached per gunicorn worker for up to 1h (_PAGE_CACHE) + 15 min (_RESP_CACHE).
"""

from __future__ import annotations

import ast
import base64
import difflib
import hashlib
import html
import importlib.util
import json
import os
import pprint
import re
import subprocess
import sys
from datetime import date, datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

from .base import Backend, Page, Result, Unsupported, substantive

EDIT_COLS = ("title", "subtitle", "summary", "body_html", "faq_json", "sections_json")
JSON_COLS = ("faq_json", "sections_json")
ROW_COLS = ("page_key", "page_type", "canonical_path", *EDIT_COLS, "updated_at", "last_generated_at")
MISSING_DB = "DATABASE_URL missing — apply via Supabase MCP"

# mirrors server.py _FAQ_SECTION_RE: the body FAQ section the renderer strips when faq_json is set
_FAQ_SECTION_RE = re.compile(
    r'<h2[^>]*id=["\']?faq["\']?[^>]*>.*?(?=<h2[ >]|\Z)'
    r'|<h2[^>]*>(?:(?!</h2>).)*?Frequently Asked Questions(?:(?!</h2>).)*?</h2>.*?(?=<h2[ >]|\Z)',
    re.DOTALL | re.IGNORECASE,
)
_H2_RE = re.compile(r"<h2\b[^>]*>(.*?)</h2\s*>", re.S | re.I)
_MD_LINK = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")
_FALLBACK_LIMITS = {"TITLE_MIN": 50, "TITLE_MAX": 65, "SUMMARY_MIN": 140, "SUMMARY_MAX": 155, "SUBTITLE_MAX": 115}
_RENDER_CLIP = {"title": 70, "summary": 160, "subtitle": 115}


# ---- small text helpers ------------------------------------------------------------------------
def _plain(fragment: str) -> str:
    """Inner HTML -> the text a reader sees (tags stripped, entities decoded, whitespace collapsed)."""
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", fragment or ""))).strip()


def _slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def _safe_key(page_key: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "__", page_key)


def _jsonable(v):
    if isinstance(v, (datetime, date)):
        return v.isoformat()
    return v


def _norm_row(row: dict) -> dict:
    return {k: _jsonable(row.get(k)) for k in ROW_COLS}


class _TextOut(HTMLParser):
    """body_html -> reading text: '## h2', '### h3', paragraphs, '- li', table rows as 'a | b'."""

    BLOCK = {"p", "div", "li", "tr", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "table", "ul", "ol", "section"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lines, self.cur, self.skip, self.cells = [], [], 0, None

    def _flush(self):
        t = re.sub(r"\s+", " ", "".join(self.cur)).strip()
        if t and t not in ("##", "###", "-"):
            self.lines.append(t)
        self.cur = []

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip += 1
        elif tag in self.BLOCK:
            self._flush()
            self.cur.append({"h2": "## ", "h3": "### ", "h4": "#### ", "li": "- "}.get(tag, ""))
        elif tag in ("td", "th"):
            if self.cur and "".join(self.cur).strip():
                self.cur.append(" | ")
        elif tag == "br":
            self.cur.append(" ")

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)
        elif tag in self.BLOCK:
            self._flush()

    def handle_data(self, data):
        if not self.skip:
            self.cur.append(data)

    def text(self) -> str:
        self._flush()
        out = ""
        for i, ln in enumerate(self.lines):
            prev = self.lines[i - 1] if i else ""
            tight = (ln.startswith("- ") and prev.startswith("- ")) or (" | " in ln and " | " in prev)
            out += ("" if not i else "\n" if tight else "\n\n") + ln
        return out


def html_to_text(body: str) -> str:
    p = _TextOut()
    p.feed(body or "")
    p.close()
    return re.sub(r"\n{3,}", "\n\n", p.text()).strip()


# ---- route resolution (server.py AST, no DB) ---------------------------------------------------
class _Route:
    def __init__(self, pattern: str, fn: str):
        self.pattern, self.fn = pattern, fn
        self.key_tmpl: str | None = None       # "explainer:{slug}" | None (not a landing page)
        self.fallback = False                  # page_key looked up with a fallback (va_conditions)
        self.guards: list[tuple[str, set | None]] = []     # (var, allowed or None=unknown)
        self.redirects: list[tuple[str, set | None]] = []  # (var, names that 301 elsewhere)
        conv = 0
        rx = "^"
        for part in re.split(r"(<[^>]+>)", pattern):
            if part.startswith("<") and part.endswith(">"):
                conv += 1
                kind, _, name = part[1:-1].rpartition(":")
                rx += f"(?P<{name}>{'.+' if kind == 'path' else '[^/]+'})"
            else:
                rx += re.escape(part)
        self.rx = re.compile(rx + "$")
        self.n_conv = conv
        self.static_len = len(re.sub(r"<[^>]+>", "", pattern))


def _key_template(node) -> str | None:
    if isinstance(node, ast.Constant) and isinstance(node.value, str):
        return node.value.replace("{", "{{").replace("}", "}}")
    if isinstance(node, ast.JoinedStr):
        out = ""
        for v in node.values:
            if isinstance(v, ast.Constant):
                out += str(v.value).replace("{", "{{").replace("}", "}}")
            elif isinstance(v, ast.FormattedValue) and isinstance(v.value, ast.Name) and v.format_spec is None:
                out += "{" + v.value.id + "}"
            else:
                return None
        return out
    return None


def _module_sets(tree: ast.Module) -> dict[str, set | None]:
    """Module-level literal collections (set/dict keys/list) by name; None = not a literal / mutated."""
    out: dict[str, set | None] = {}
    for node in tree.body:
        targets, value = [], None
        if isinstance(node, ast.Assign):
            targets, value = [t for t in node.targets if isinstance(t, ast.Name)], node.value
        elif isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name) and node.value is not None:
            targets, value = [node.target], node.value
        for t in targets:
            try:
                v = ast.literal_eval(value)
                out[t.id] = set(v.keys()) if isinstance(v, dict) else set(v) if isinstance(v, (set, list, tuple, frozenset)) else None
            except Exception:  # noqa: BLE001 — comprehension, call, list of dicts…: unknown, permissive
                out[t.id] = None
    for node in ast.walk(tree):  # a later .add()/.update()/|= makes the literal incomplete
        if isinstance(node, ast.AugAssign) and isinstance(node.target, ast.Name) and node.target.id in out:
            out[node.target.id] = None
        elif (isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute)
              and isinstance(node.func.value, ast.Name) and node.func.value.id in out
              and node.func.attr in ("add", "update", "extend", "append", "setdefault", "__setitem__")):
            out[node.func.value.id] = None
        elif (isinstance(node, ast.Assign) and any(isinstance(t, ast.Subscript) and isinstance(t.value, ast.Name)
                                                     and t.value.id in out for t in node.targets)):
            for t in node.targets:
                if isinstance(t, ast.Subscript) and isinstance(t.value, ast.Name):
                    out[t.value.id] = None
    return out


def _collection(node, sets: dict) -> set | None:
    if isinstance(node, ast.Name):
        return sets.get(node.id)
    try:
        v = ast.literal_eval(node)
        return set(v.keys()) if isinstance(v, dict) else set(v)
    except Exception:  # noqa: BLE001
        return None


def _calls(stmts, name: str):
    for st in stmts:
        for n in ast.walk(st):
            if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == name:
                yield n


def parse_routes(src: str) -> list[_Route]:
    tree = ast.parse(src)
    sets = _module_sets(tree)
    routes = []
    for fn in tree.body:
        if not isinstance(fn, ast.FunctionDef):
            continue
        pats = []
        for d in fn.decorator_list:
            if (isinstance(d, ast.Call) and isinstance(d.func, ast.Attribute) and d.func.attr == "route"
                    and d.args and isinstance(d.args[0], ast.Constant)):
                methods = next((k.value for k in d.keywords if k.arg == "methods"), None)
                if methods is not None:
                    try:
                        if "GET" not in ast.literal_eval(methods):
                            continue
                    except Exception:  # noqa: BLE001
                        pass
                pats.append(d.args[0].value)
        if not pats:
            continue
        key, fallback = None, False
        for c in _calls(fn.body, "_serve_landing_page"):
            if c.args:
                key = _key_template(c.args[0])
                break
        if key is None:  # va-disability/<condition>/: LandingPage.page_key == f"condition:{x}" else va_conditions
            for n in ast.walk(fn):
                if (isinstance(n, ast.Compare) and isinstance(n.left, ast.Attribute) and n.left.attr == "page_key"
                        and len(n.comparators) == 1):
                    key, fallback = _key_template(n.comparators[0]), True
                    if key:
                        break
        guards, redirects = [], []
        for n in ast.walk(fn):
            if not (isinstance(n, ast.If) and isinstance(n.test, ast.Compare) and isinstance(n.test.left, ast.Name)
                    and len(n.test.ops) == 1):
                continue
            var, op, coll = n.test.left.id, n.test.ops[0], n.test.comparators[0]
            body_calls = {c.func.id for st in n.body for c in ast.walk(st)
                          if isinstance(c, ast.Call) and isinstance(c.func, ast.Name)}
            if isinstance(op, ast.NotIn) and "abort" in body_calls:
                guards.append((var, _collection(coll, sets)))
            elif isinstance(op, ast.In) and "redirect" in body_calls:
                redirects.append((var, _collection(coll, sets)))
        for p in pats:
            r = _Route(p, fn.name)
            r.key_tmpl, r.fallback, r.guards, r.redirects = key, fallback, guards, redirects
            routes.append(r)
    # Werkzeug-ish precedence: static rules first, then more static characters
    routes.sort(key=lambda r: (r.n_conv, -r.static_len))
    return routes


# ---- markdown (engine paragraphs) -> site HTML ---------------------------------------------------
def _esc_inline(t: str) -> str:
    e = html.escape(t, quote=False)
    return re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", e)


def md_plain(s: str) -> str:
    return re.sub(r"\*\*(.+?)\*\*", r"\1", _MD_LINK.sub(lambda m: m.group(1), s or ""))


class _Md:
    def __init__(self, trailing_slash: bool):
        self.ts = trailing_slash

    def href(self, h: str) -> str:
        if self.ts and h.startswith("/") and not re.search(r"[?#]|\.[a-z0-9]{2,5}$", h) and not h.endswith("/"):
            h += "/"
        return h

    def inline(self, s: str) -> str:
        out, i = [], 0
        for m in _MD_LINK.finditer(s):
            out.append(_esc_inline(s[i:m.start()]))
            h = self.href(m.group(2))
            ext = ' target="_blank" rel="noopener noreferrer"' if h.startswith("http") else ""
            out.append(f'<a href="{html.escape(h, quote=True)}"{ext}>{_esc_inline(m.group(1))}</a>')
            i = m.end()
        out.append(_esc_inline(s[i:]))
        return "".join(out)

    def _items(self, tag: str, lines: list[str], marker: str) -> str:
        return f"<{tag}>" + "".join("<li>" + self.inline(re.sub(marker, "", ln)) + "</li>" for ln in lines) + f"</{tag}>"

    def block(self, para: str) -> str:
        lines = [ln.strip() for ln in para.strip().splitlines() if ln.strip()]
        if lines and all(re.match(r"[-*]\s+", ln) for ln in lines):
            return self._items("ul", lines, r"^[-*]\s+")
        if lines and all(re.match(r"\d+[.)]\s+", ln) for ln in lines):
            return self._items("ol", lines, r"^\d+[.)]\s+")
        if lines and lines[0].startswith("### "):
            return f"<h3>{self.inline(lines[0][4:])}</h3>" + ("\n" + self.block("\n".join(lines[1:])) if lines[1:] else "")
        return f"<p>{self.inline(' '.join(lines))}</p>"

    def section(self, heading: str, paras: list[str]) -> str:
        return f"<h2>{html.escape(heading, quote=False)}</h2>\n" + "\n".join(self.block(p) for p in paras if p.strip()) + "\n"


# ---- the backend -------------------------------------------------------------------------------
class PgRows(Backend):
    def __init__(self, root, cfg):
        super().__init__(Path(root), cfg)
        p = cfg.get("pg", {})
        self.server_file = p.get("server_file", "server.py")
        self.table = p.get("table", "landing_pages")
        if not re.fullmatch(r"[a-z_][a-z0-9_]*", self.table):
            raise ValueError(f"bad table name {self.table!r}")
        self.snap_dir = p.get("snapshot_dir", "reports/rank-drop/pg-snapshots")
        self.script_dir = p.get("script_dir", "scripts")
        self.limits_file = p.get("field_limits", "scripts/seo_field_limits.py")
        self.env_var = p.get("database_url_env", "DATABASE_URL")
        # "mcp": no DSN in the cloud (HTTPS-only egress can't reach the pooler) — queue the guarded .sql
        # for the orchestrator to run through the Supabase MCP (scripts/rank_drop/pg_mcp.py), commit as usual
        self.apply_mode = p.get("apply_mode", "dsn")
        self.bust_cache = bool(p.get("bust_cache", False))
        self.trailing_slash = cfg.get("trailing_slash", True)
        self.md = _Md(self.trailing_slash)
        self._routes: list[_Route] | None = None
        self._engine = None

    # ---- DB (read-only) ------------------------------------------------------------------
    def _dsn(self) -> str | None:
        u = os.environ.get(self.env_var) or None
        if u and u.startswith("postgres://"):
            u = "postgresql://" + u[len("postgres://"):]
        return u

    def _select(self, sql: str, params: dict) -> list[dict] | None:
        """Read-only query (SET TRANSACTION READ ONLY, always rolled back). None when no DSN."""
        if not re.match(r"\s*select\b", sql, re.I):
            raise ValueError("backend reads are SELECT only")
        dsn = self._dsn()
        if not dsn:
            return None
        from sqlalchemy import create_engine, text  # lazy: offline runs need no driver
        from sqlalchemy.pool import NullPool
        if self._engine is None:
            self._engine = create_engine(dsn, poolclass=NullPool)
        with self._engine.connect() as c:
            c.execute(text("SET TRANSACTION READ ONLY"))
            rows = [dict(r) for r in c.execute(text(sql), params).mappings().all()]
            c.rollback()
        return rows

    def _fetch_row(self, page_key: str) -> dict | None:
        rows = self._select(f"select {', '.join(ROW_COLS)} from {self.table} where page_key = :k", {"k": page_key})
        if rows is None:
            raise LookupError("no DSN")
        return _norm_row(rows[0]) if rows else None

    # ---- snapshots ------------------------------------------------------------------------
    def _snap_path(self, page_key: str, suffix: str = "") -> Path:
        return self.root / self.snap_dir / f"{_safe_key(page_key)}{suffix}.json"

    def _queue(self, sql_rel: str, page: Page, kind: str):
        q = self.root / self.snap_dir / "pending.jsonl"
        q.parent.mkdir(parents=True, exist_ok=True)
        with open(q, "a") as fh:
            fh.write(json.dumps({"sql": sql_rel, "page_key": page.key, "path": page.path, "kind": kind}) + "\n")

    def snapshot_select_sql(self, page_key: str) -> str:
        """The SELECT to run through the Supabase MCP; feed the row to save_snapshot()."""
        return f"select {', '.join(ROW_COLS)} from {self.table} where page_key = '{page_key.replace(chr(39), chr(39) * 2)}';"

    def save_snapshot(self, row: dict, source: str = "mcp") -> Path:
        row = _norm_row(row)
        f = self._snap_path(row["page_key"])
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps({"page_key": row["page_key"], "source": source,
                                 "captured_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                                 "row": row}, indent=1, ensure_ascii=False) + "\n")
        return f

    @staticmethod
    def _load_snap(f: Path) -> dict | None:
        if not f.exists():
            return None
        d = json.loads(f.read_text())
        return _norm_row(d["row"] if "row" in d else d)

    def _history(self, page_key: str, kind: str) -> list[tuple[str, int, Path, dict]]:
        out = []
        for f in (self.root / self.snap_dir).glob(f"{_safe_key(page_key)}.*.{kind}.json"):
            m = re.search(r"\.(\d{8})\.(\d+)\." + kind + r"\.json$", f.name)
            if m:
                out.append((m.group(1), int(m.group(2)), f, json.loads(f.read_text())))
        return sorted(out, key=lambda t: (t[0], t[1]))

    # ---- locating -------------------------------------------------------------------------
    def _norm_path(self, path: str) -> str:
        p = re.sub(r"^[a-z]+://[^/]+", "", path.strip(), flags=re.I).split("#", 1)[0].split("?", 1)[0] or "/"
        if not p.startswith("/"):
            p = "/" + p
        p = re.sub(r"/{2,}", "/", p)
        if self.trailing_slash and not p.endswith("/"):
            p += "/"
        return p

    def routes(self) -> list[_Route]:
        if self._routes is None:
            self._routes = parse_routes((self.root / self.server_file).read_text())
        return self._routes

    def resolve(self, path: str) -> tuple[str, str, dict] | None:
        """URL path -> (canonical_path, page_key, info) from server.py alone (no DB). None when the
        winning route is not a landing page, a guard 404s, or the slug 301s elsewhere."""
        p = self._norm_path(path)
        for r in self.routes():
            m = r.rx.match(p)
            if not m:
                continue
            if not r.key_tmpl:
                return None  # served by something other than landing_pages
            vals = m.groupdict()
            for var, allowed in r.redirects:
                if allowed is not None and vals.get(var) in allowed:
                    return None
            unchecked = []
            for var, allowed in r.guards:
                if allowed is None:
                    unchecked.append(var)
                elif vals.get(var) not in allowed:
                    return None
            try:
                key = r.key_tmpl.format(**vals)
            except (KeyError, IndexError):
                return None
            return p, key, {"route": r.pattern, "fn": r.fn, "fallback": r.fallback, "unchecked_guards": unchecked}
        return None

    def script_rel(self, path: str, today: str, seq: int = 1, restore: bool = False) -> str:
        sid = re.sub(r"[^a-z0-9]+", "_", path.strip("/").lower()).strip("_")[:80] or "home"
        d = today.replace("-", "")
        return f"{self.script_dir}/rank_drop_{d}_{sid}{'_restore' if restore else ''}{'' if seq == 1 else f'_{seq}'}.py"

    def locate(self, path: str) -> Page | None:
        hit = self.resolve(path)
        if not hit:
            return None
        canon, key, info = hit
        source, row = "db", None
        try:
            row = self._fetch_row(key)
            if row is None:
                return None  # route exists but no landing_pages row (404 / va_conditions fallback)
        except LookupError:
            source, row = "snapshot", self._load_snap(self._snap_path(key))
        if row is None:
            return None
        if row.get("canonical_path") and row["canonical_path"] != canon:
            info["warn"] = f"row canonical_path {row['canonical_path']} != {canon}"
        slug = canon.rstrip("/").rsplit("/", 1)[-1] or "home"
        today = date.today().isoformat()
        return Page(path=canon, slug=slug, key=key, files=[self.script_rel(canon, today)],
                    title=row.get("title") or "", kind=row.get("page_type") or key.split(":", 1)[0],
                    native=json.dumps(row, indent=1, ensure_ascii=False),
                    extra={"row": row, "source": source, "description": row.get("summary") or "", **info})

    def _row(self, page: Page) -> dict:
        row = page.extra.get("row") if page.extra else None
        if row is None and page.native:
            row = _norm_row(json.loads(page.native))
        if row is None:
            raise Unsupported(f"no landing_pages row for {page.path}")
        return row

    # ---- reading --------------------------------------------------------------------------
    @staticmethod
    def _faq(row) -> list[dict]:
        f = row.get("faq_json") or []
        if isinstance(f, str):
            try:
                f = json.loads(f)
            except ValueError:
                return []
        return f if isinstance(f, list) else []

    @staticmethod
    def _takeaways(row) -> list[str]:
        v = row.get("sections_json") or []
        if isinstance(v, str):
            try:
                v = json.loads(v)
            except ValueError:
                return []
        return [t for t in v if isinstance(t, str)] if isinstance(v, list) else []

    def _visible_body(self, row) -> str:
        b = row.get("body_html") or ""
        b = re.sub(r"<title[^>]*>.*?</title>", "", b, flags=re.S | re.I)
        return _FAQ_SECTION_RE.sub("", b) if self._faq(row) else b

    def text(self, page: Page) -> str:
        row = self._row(page)
        out = [f"# {row.get('subtitle') or row.get('title') or ''}".rstrip()]
        if row.get("summary"):
            out += ["", row["summary"]]
        tk = self._takeaways(row)
        if tk:
            out += ["", "## Key Takeaways", ""] + [f"- {t}" for t in tk]
        body = html_to_text(self._visible_body(row))
        if body:
            out += ["", body]
        faq = self._faq(row)
        if faq:
            out += ["", "## Frequently Asked Questions"]
            for q in faq:
                out += ["", f"**Q: {q.get('question') or q.get('q') or ''}**", q.get("answer") or q.get("a") or ""]
        return "\n".join(out).strip() + "\n"

    def headings(self, page: Page) -> list[dict]:
        return [{"id": None, "heading": _plain(h)} for h in _H2_RE.findall(self._visible_body(self._row(page)))]

    def voice_sample(self, kind: str, exclude: set[str]) -> str | None:
        try:
            rows = self._select(f"select page_key, canonical_path from {self.table} where page_type = :t "
                                "and (length(body_html) - length(replace(body_html, '<h2', ''))) / 3 >= 4 "
                                "order by updated_at desc nulls last limit 40", {"t": kind})
        except Exception:  # noqa: BLE001 — a voice sample is optional
            return None
        for r in rows or []:
            slug = (r["canonical_path"] or "").rstrip("/").rsplit("/", 1)[-1]
            if slug in exclude or r["page_key"] in exclude or r["canonical_path"] in exclude:
                continue
            got = self._select(f"select body_html from {self.table} where page_key = :k", {"k": r["page_key"]})
            if got and len(_H2_RE.findall(got[0]["body_html"] or "")) >= 4:
                return got[0]["body_html"]
        return None

    # ---- computing an edit ----------------------------------------------------------------
    def _limits(self):
        f = self.root / self.limits_file
        if f.exists():
            spec = importlib.util.spec_from_file_location("_rank_drop_seo_field_limits", f)
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)
            return mod
        return None

    def check_fields(self, fields: dict) -> tuple[list[str], list[str]]:
        """(hard, soft) problems for changed title/summary/subtitle. hard = past the renderer clip
        (visibly truncated); soft = outside seo_field_limits' sweet spot."""
        mod = self._limits()
        lim = {k: getattr(mod, k, v) if mod else v for k, v in _FALLBACK_LIMITS.items()}
        hard, soft = [], []
        for col in ("title", "summary", "subtitle"):
            if col not in fields or fields[col] is None:
                continue
            v = fields[col]
            if len(v) > _RENDER_CLIP[col]:
                hard.append(f"{col} {len(v)} chars > {_RENDER_CLIP[col]} (renderer clips it): {v!r}")
            if mod and hasattr(mod, "check_landing_fields"):
                soft += mod.check_landing_fields(**{col: v, "require_title": False, "require_summary": False})
            elif col == "title" and not lim["TITLE_MIN"] <= len(v) <= lim["TITLE_MAX"]:
                soft.append(f"title {len(v)} chars, need {lim['TITLE_MIN']}-{lim['TITLE_MAX']}")
            elif col == "summary" and not lim["SUMMARY_MIN"] <= len(v) <= lim["SUMMARY_MAX"]:
                soft.append(f"summary {len(v)} chars, need {lim['SUMMARY_MIN']}-{lim['SUMMARY_MAX']}")
            elif col == "subtitle" and len(v) > lim["SUBTITLE_MAX"]:
                soft.append(f"subtitle {len(v)} chars > {lim['SUBTITLE_MAX']}")
        return hard, soft

    def _h2_spans(self, body: str) -> list[tuple[int, int, str]]:
        """[(start, end, heading_text)] — a section runs from its <h2 to the next <h2 (or the end)."""
        starts = [(m.start(), _plain(m.group(1))) for m in _H2_RE.finditer(body)]
        return [(s, starts[i + 1][0] if i + 1 < len(starts) else len(body), h) for i, (s, h) in enumerate(starts)]

    @staticmethod
    def _same(h: str, want: str) -> bool:
        return h.strip().lower() == want.strip().lower() or _slugify(h) == _slugify(want)

    def _replace_text(self, f: dict, old: str, new: str) -> str:
        """Exact-once replacement of reader-visible text across body_html, subtitle, summary, takeaways
        and FAQ questions/answers. Returns a note; raises ValueError unless exactly one match."""
        hits = []  # (field, how, payload)
        body = f.get("body_html") or ""
        new_html = new if re.search(r"<(a|strong|em)\b", new) else self.md.inline(new)
        body_forms = [old, html.escape(old, quote=False), html.escape(old, quote=True)]
        form = next((x for x in dict.fromkeys(body_forms) if x in body), None)
        if form is not None:
            hits += [("body_html", "raw", form)] * body.count(form)
        else:  # the sentence lives in one text node next to markup (e.g. after a link)
            for m in re.finditer(r"[^<>]+", body):
                if m.start() and body[m.start() - 1] != ">":
                    continue  # inside a tag (attributes), not text
                node = html.unescape(m.group(0))
                if old in node:
                    hits += [("body_html", "node", m.span())] * node.count(old)
        for col in ("subtitle", "summary"):
            v = f.get(col) or ""
            hits += [(col, "raw", None)] * v.count(old)
        for i, t in enumerate(self._takeaways(f)):
            hits += [("sections_json", "raw", i)] * t.count(old)
        for i, q in enumerate(self._faq(f)):
            for k in ("question", "answer", "q", "a"):
                if isinstance(q.get(k), str):
                    hits += [("faq_json", "raw", (i, k))] * q[k].count(old)
        if len(hits) != 1:
            where = sorted({h[0] for h in hits})
            raise ValueError(f"replace 'old' text found {len(hits)}x (need exactly 1){' in ' + ', '.join(where) if where else ''}: {old[:80]!r}")
        col, how, payload = hits[0]
        plain_new = md_plain(new)
        if col == "body_html":
            if how == "raw":
                # `old` quoted with markup/entities verbatim -> `new` is taken verbatim too
                verbatim = payload == old and re.search(r"[<&]", old)
                f["body_html"] = body.replace(payload, new if verbatim else new_html, 1)
            else:
                a, b = payload
                node = html.unescape(body[a:b])
                i = node.index(old)
                rebuilt = html.escape(node[:i], quote=False) + new_html + html.escape(node[i + len(old):], quote=False)
                f["body_html"] = body[:a] + rebuilt + body[b:]
        elif col in ("subtitle", "summary"):
            f[col] = f[col].replace(old, plain_new, 1)
        elif col == "sections_json":
            tk = self._takeaways(f)
            tk[payload] = tk[payload].replace(old, plain_new, 1)
            f["sections_json"] = json.dumps(tk, ensure_ascii=False) if isinstance(f.get("sections_json"), str) else tk
        else:
            faq = json.loads(json.dumps(self._faq(f)))
            i, k = payload
            faq[i][k] = faq[i][k].replace(old, plain_new, 1)
            f["faq_json"] = json.dumps(faq, ensure_ascii=False) if isinstance(f.get("faq_json"), str) else faq
        return f'{col}: "{old[:80]}" -> "{new[:80]}"'

    def _apply_ops(self, row: dict, ops: list[dict]) -> tuple[dict, list[str]]:
        f = json.loads(json.dumps({k: row.get(k) for k in EDIT_COLS}))  # deep copy
        notes = []
        for op in ops:
            kind = op.get("op")
            if kind == "meta":
                any_set = False
                for logical, col in (("title", "title"), ("description", "summary")):
                    val = op.get(logical)
                    if not val:
                        continue
                    any_set = True
                    f[col] = val
                    notes.append(f"{col}{' (meta description + hero paragraph)' if col == 'summary' else ''} -> {val[:80]}")
                    if col == "title" and not f.get("subtitle"):
                        notes.append("note: subtitle is empty, so the new title is also the visible H1")
                if not any_set:
                    notes.append("skipped meta: no title/description given")
            elif kind in ("insert_section", "replace_section"):
                body = f.get("body_html") or ""
                spans = self._h2_spans(body)
                new = self.md.section(op["heading"], op.get("paragraphs") or [])
                if op.get("section_id"):
                    notes.append("note: section ids are not stored in body_html (plain <h2>); id ignored")
                if kind == "replace_section":
                    hit = [s for s in spans if self._same(s[2], op["match"])]
                    if len(hit) != 1:
                        raise ValueError(f"section {op['match']!r} found {len(hit)}x to replace (need 1)")
                    if any(self._same(s[2], op["heading"]) and s is not hit[0] for s in spans):
                        raise ValueError(f"another section is already headed {op['heading']!r}")
                    a, b, _ = hit[0]
                    tail = body[a:b][len(body[a:b].rstrip()):]
                    if b < len(body) and not tail:
                        tail = "\n"
                    f["body_html"] = body[:a] + new.rstrip("\n") + tail + body[b:]
                    notes.append(f"replaced section: {op['match']} -> {op['heading']}")
                else:
                    if any(self._same(s[2], op["heading"]) for s in spans):
                        raise ValueError(f"section {op['heading']!r} already exists")
                    at = None
                    if op.get("before"):
                        hit = [s for s in spans if self._same(s[2], op["before"])]
                        if hit:
                            at = hit[0][0]
                        else:
                            notes.append(f"note: before-section {op['before']!r} not found; placed before the FAQ/end")
                    if at is None:  # before an in-body FAQ section (stripped or not at render), else the end
                        fm = _FAQ_SECTION_RE.search(body)
                        at = fm.start() if fm else None
                    if at is None:
                        f["body_html"] = body.rstrip("\n") + "\n" + new.rstrip("\n")
                    else:
                        f["body_html"] = body[:at] + new + body[at:]
                    notes.append(f"added section: {op['heading']}")
            elif kind == "replace":
                notes.append(self._replace_text(f, op["old"], op["new"]))
            elif kind == "rewrite":
                notes += self._rewrite(f, op.get("fields") or {})
            else:
                raise ValueError(f"unknown op {kind}")
        return f, notes

    def _rewrite(self, f: dict, fields: dict) -> list[str]:
        """L5 rewrite: generator fields mapped onto the row's columns; unknown keys are skipped."""
        notes, done = [], []
        alias = {"title": "title", "metaTitle": "title", "description": "summary", "metaDescription": "summary",
                 "summary": "summary", "h1": "subtitle", "subtitle": "subtitle", "body_html": "body_html",
                 "keyTakeaways": "sections_json", "key_takeaways": "sections_json"}
        for k, v in fields.items():
            if k in alias:
                f[alias[k]] = v
                done.append(alias[k])
            elif k == "sections" and isinstance(v, list):
                parts = []
                for s in v:
                    paras = s.get("content") or s.get("paragraphs") or s.get("body") or []
                    paras = paras.split("\n\n") if isinstance(paras, str) else paras
                    parts.append(self.md.section(s.get("heading", ""), paras).rstrip("\n"))
                intro = fields.get("introText") or fields.get("intro")
                lead = "\n".join(self.md.block(p) for p in (intro.split("\n\n") if intro else []))
                f["body_html"] = (lead + "\n" if lead else "") + "\n".join(parts)
                done.append("body_html")
            elif k in ("faq", "faqs") and isinstance(v, list):
                f["faq_json"] = [{"question": md_plain(q.get("question") or q.get("q") or ""),
                                  "answer": md_plain(q.get("answer") or q.get("a") or "")} for q in v]
                done.append("faq_json")
            elif k in ("introText", "intro"):
                if "sections" not in fields:
                    notes.append(f"skipped rewrite key {k}: needs sections to rebuild body_html")
            else:
                notes.append(f"skipped rewrite key {k}: no landing_pages column")
        if done:
            notes.insert(0, "rewrote columns: " + ", ".join(sorted(set(done))))
        return notes

    # ---- writing the script ---------------------------------------------------------------
    @staticmethod
    def _digest(d: dict) -> str:
        return hashlib.sha256(json.dumps(d, sort_keys=True, ensure_ascii=False, default=str).encode()).hexdigest()

    def _pick_script(self, path: str, today: str, expect: dict, restore: bool) -> tuple[str, int]:
        """Same base state -> same file (dry run then real run); otherwise the next free _N."""
        dig = self._digest(expect)
        seq = 1
        while True:
            rel = self.script_rel(path, today, seq, restore)
            f = self.root / rel
            if not f.exists() or f"# expect-sha256: {dig}" in f.read_text():
                return rel, seq
            seq += 1

    def _render_script(self, rel: str, page_key: str, path: str, today: str, expect: dict, after: dict,
                       notes: list[str], set_dates: dict | None, title: str) -> str:
        lit = lambda d: pprint.pformat(d, width=110, sort_dicts=True)  # noqa: E731
        clean = lambda t: t.replace("\\", "/").replace('"""', "'''")  # noqa: E731
        doc = "\n".join(f"  - {clean(n)}" for n in notes) or "  - (no notes)"
        return f'''#!/usr/bin/env python3
"""{today} rank-drop-recovery {title}: {clean(path)} ({clean(page_key)})
{doc}
Generated by scripts/rank_drop/backends/pg_rows.py. Idempotent: exits 0 without writing when the row
already holds AFTER; aborts (exit 2) when the row matches neither EXPECT nor AFTER (someone edited it
since the snapshot). Updates only the changed columns + updated_at/last_generated_at, re-selects and
asserts. `--dry` runs the same transaction and rolls it back.
Run: DATABASE_URL=postgresql://... python {rel} [--dry]
(or run the sibling .sql through the Supabase MCP)."""
# expect-sha256: {self._digest(expect)}
import json
import os
import sys

from sqlalchemy import create_engine, text

TABLE = {self.table!r}
PAGE_KEY = {page_key!r}
CANONICAL_PATH = {path!r}
JSON_COLS = {tuple(JSON_COLS)!r}
SET_DATES = {set_dates!r}  # None -> updated_at/last_generated_at = now()

EXPECT = {lit(expect)}

AFTER = {lit(after)}


def _diff(cur):
    return [k for k in sorted(AFTER) if cur.get(k) != EXPECT.get(k)]


def main():
    url = os.environ.get("DATABASE_URL")
    if not url:
        print("DATABASE_URL not set", file=sys.stderr)
        return 3
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    dry = "--dry" in sys.argv
    cols = sorted(AFTER)
    eng = create_engine(url)
    with eng.connect() as c:
        tx = c.begin()
        sel = text(f"select {{', '.join(cols)}} from {{TABLE}} where page_key = :k for update")
        row = c.execute(sel, {{"k": PAGE_KEY}}).mappings().one_or_none()
        if row is None:
            tx.rollback()
            print(f"ABORT: no {{TABLE}} row {{PAGE_KEY}}", file=sys.stderr)
            return 2
        cur = {{k: row[k] for k in cols}}
        if cur == AFTER:
            tx.rollback()
            print(f"already applied: {{PAGE_KEY}}")
            return 0
        if cur != EXPECT:
            tx.rollback()
            print(f"ABORT: {{PAGE_KEY}} changed since the snapshot; columns differ: {{_diff(cur)}}", file=sys.stderr)
            return 2
        sets, params = [], {{"k": PAGE_KEY}}
        for k in cols:
            if k in JSON_COLS:
                sets.append(f"{{k}} = cast(:{{k}} as jsonb)")
                params[k] = None if AFTER[k] is None else json.dumps(AFTER[k], ensure_ascii=False)
            else:
                sets.append(f"{{k}} = :{{k}}")
                params[k] = AFTER[k]
        for k in ("updated_at", "last_generated_at"):
            if SET_DATES and SET_DATES.get(k):
                sets.append(f"{{k}} = cast(:{{k}} as timestamp)")
                params[k] = SET_DATES[k]
            else:
                sets.append(f"{{k}} = now()")
        n = c.execute(text(f"update {{TABLE}} set {{', '.join(sets)}} where page_key = :k"), params).rowcount
        if n != 1:
            tx.rollback()
            print(f"ABORT: update touched {{n}} rows", file=sys.stderr)
            return 2
        back = c.execute(sel, {{"k": PAGE_KEY}}).mappings().one()
        if {{k: back[k] for k in cols}} != AFTER:
            tx.rollback()
            print("ABORT: re-select does not match AFTER", file=sys.stderr)
            return 2
        if dry:
            tx.rollback()
            print(f"DRY: {{PAGE_KEY}} would update {{cols}} (rolled back)")
        else:
            tx.commit()
            print(f"applied: {{PAGE_KEY}} {{cols}}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
'''

    def _render_sql(self, page_key: str, expect: dict, after: dict, set_dates: dict | None) -> str:
        # Every value is base64-encoded: page text can hold words (DROP, DELETE…) or ";" that trip the
        # Supabase MCP's destructive-SQL check, which then waits for a confirmation an unattended run
        # cannot give. Encoded, the statement reads as one plain UPDATE … WHERE page_key = '…'.
        def q(s: str) -> str:
            b = base64.b64encode(s.encode("utf-8")).decode("ascii")
            return f"convert_from(decode('{b}', 'base64'), 'UTF8')"
        sets, where = [], ["page_key = '" + page_key.replace("'", "''") + "'"]
        for k in sorted(after):
            v = after[k]
            if k in JSON_COLS:
                sets.append(f"{k} = " + ("NULL" if v is None else f"{q(json.dumps(v, ensure_ascii=False))}::jsonb"))
            else:
                sets.append(f"{k} = " + ("NULL" if v is None else q(v)))
        for k in sorted(expect):
            v = expect[k]
            if v is None:
                where.append(f"{k} IS NULL")
            elif k in JSON_COLS:
                where.append(f"{k} = {q(json.dumps(v, ensure_ascii=False))}::jsonb")
            else:
                where.append(f"md5({k}) = '{hashlib.md5(v.encode()).hexdigest()}'")
        for k in ("updated_at", "last_generated_at"):
            sets.append(f"{k} = '{set_dates[k]}'::timestamp" if set_dates and set_dates.get(k) else f"{k} = now()")
        return ("-- Guarded: updates 0 rows if the row no longer equals the snapshot (or is already applied).\n"
                "-- Run through the Supabase MCP execute_sql when DATABASE_URL is not available.\n"
                f"UPDATE {self.table} SET\n  " + ",\n  ".join(sets) + "\nWHERE " + "\n  AND ".join(where)
                + "\nRETURNING page_key, updated_at;\n")

    def _preview(self, expect: dict, after: dict) -> str:
        out = []
        for k in sorted(after):
            a, b = expect.get(k), after.get(k)
            fmt = (lambda v: json.dumps(v, indent=1, ensure_ascii=False)) if k in JSON_COLS else (lambda v: v or "")
            sa, sb = fmt(a), fmt(b)
            if k == "body_html":
                sa, sb = re.sub(r"(<h2)", r"\n\1", sa), re.sub(r"(<h2)", r"\n\1", sb)
            out += difflib.unified_diff(sa.splitlines(), sb.splitlines(), f"a/{k}", f"b/{k}", n=1, lineterm="")
        return "\n".join(out) + "\n"

    def _git_head(self) -> str | None:
        r = subprocess.run(["git", "rev-parse", "HEAD"], cwd=self.root, capture_output=True, text=True)
        return r.stdout.strip() if r.returncode == 0 else None

    def _run_script(self, rel: str, *args: str) -> subprocess.CompletedProcess:
        env = dict(os.environ, DATABASE_URL=self._dsn() or "")
        return subprocess.run([sys.executable, str(self.root / rel), *args], cwd=self.root, env=env,
                              capture_output=True, text=True, timeout=180)

    def _write(self, rel: str, content: str) -> None:
        f = self.root / rel
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(content)

    def _bust(self) -> str:
        tok = os.environ.get("ADMIN_TOKEN")
        if not (self.bust_cache and tok):
            return "live HTML may stay cached up to 1h per gunicorn worker (+15 min response cache)"
        import urllib.request
        ok = 0
        for _ in range(6):  # each POST clears only the worker that serves it
            try:
                req = urllib.request.Request(self.cfg["base_url"].rstrip("/") + "/admin/regen-report", method="POST",
                                             headers={"Authorization": f"Bearer {tok}"})
                urllib.request.urlopen(req, timeout=15).read()
                ok += 1
            except Exception:  # noqa: BLE001
                pass
        return f"cache bust: {ok}/6 POST /admin/regen-report ok (per-worker; others expire within 1h)"

    # ---- writing --------------------------------------------------------------------------
    def apply(self, page: Page, ops: list[dict], today: str, dry_run: bool = False, preview=None) -> Result:
        row = self._row(page)
        notes: list[str] = []
        if not dry_run and self._dsn():
            live = self._fetch_row(page.key)
            if live is None:
                return Result(False, f"no landing_pages row {page.key}")
            if any(live.get(k) != row.get(k) for k in EDIT_COLS):
                notes.append("note: live row differed from the located snapshot; edit computed on the live row")
            row = live
        new, op_notes = self._apply_ops(row, ops)
        notes += op_notes
        changed = [k for k in EDIT_COLS if new.get(k) != row.get(k)]
        if not changed:
            return Result(True, "no field changed", [], ["skipped: no field changed"] + notes)
        expect = {k: row.get(k) for k in changed}
        after = {k: new[k] for k in changed}
        hard, soft = self.check_fields(after)
        notes += [f"warn: {p}" for p in hard + soft]
        keep = None if substantive(ops) else {k: str(row.get(k)) for k in ("updated_at", "last_generated_at")
                                                  if row.get(k)}           # meta-only: dates stay (Google)
        notes.append("updated_at, last_generated_at -> now()" if keep is None else "dates kept (no content change)")
        rel, seq = self._pick_script(page.path, today, expect, restore=False)
        sql_rel = rel[:-3] + ".sql"
        self._write(rel, self._render_script(rel, page.key, page.path, today, expect, after, notes, keep or None, "EDIT"))
        self._write(sql_rel, self._render_sql(page.key, expect, after, None))
        diff = self._preview(expect, after)
        if dry_run:
            if preview is not None:
                Path(preview).write_text(diff)
            else:
                self._write(f"{self.snap_dir}/{_safe_key(page.key)}.{today.replace('-', '')}.{seq}.preview.diff", diff)
            return Result(True, f"dry-run: wrote {rel} (not executed); would update {', '.join(changed)}",
                          [rel, sql_rel], notes)
        stamp = today.replace("-", "")
        snap_b = f"{self.snap_dir}/{_safe_key(page.key)}.{stamp}.{seq}.before.json"
        snap_a = f"{self.snap_dir}/{_safe_key(page.key)}.{stamp}.{seq}.after.json"
        meta = {"page_key": page.key, "canonical_path": page.path, "script": rel, "git_head": self._git_head(),
                "captured_at": datetime.now(timezone.utc).isoformat(timespec="seconds")}
        after_row = {**row, **after, "updated_at": None, "last_generated_at": None}
        self._write(snap_b, json.dumps({**meta, "row": row}, indent=1, ensure_ascii=False) + "\n")
        self._write(snap_a, json.dumps({**meta, "row": after_row}, indent=1, ensure_ascii=False) + "\n")
        files = [rel, sql_rel, snap_b, snap_a]
        if not self._dsn():
            if self.apply_mode == "mcp":
                self._queue(sql_rel, page, "EDIT")
                # The queued SQL runs later (PG PUBLISH, after the audit), in order. The cached row moves to
                # the post-edit state now so the next edit's guard expects exactly what this one leaves.
                pending_row = {**row, **after}
                self.save_snapshot(pending_row, source="pending")
                files.append(str(self._snap_path(page.key).relative_to(self.root)))
                page.extra["row"], page.native = pending_row, json.dumps(pending_row, indent=1, ensure_ascii=False)
                return Result(True, "PENDING_SQL " + sql_rel, files, notes + ["PENDING_SQL " + sql_rel])
            return Result(False, MISSING_DB, files, notes + [f"apply {sql_rel} via Supabase MCP execute_sql, then commit: "
                                                             + " ".join(files)])
        r = self._run_script(rel)
        if r.returncode != 0:
            for x in files:
                (self.root / x).unlink(missing_ok=True)
            return Result(False, f"script failed ({r.returncode}): {(r.stderr or r.stdout).strip()[:300]}", [], notes)
        live = self._fetch_row(page.key)
        if live:
            self._write(snap_a, json.dumps({**meta, "row": live}, indent=1, ensure_ascii=False) + "\n")
            self.save_snapshot(live, source="db")
            files.append(str(self._snap_path(page.key).relative_to(self.root)))
            page.extra["row"], page.native = live, json.dumps(live, indent=1, ensure_ascii=False)
        notes.append(self._bust())
        return Result(True, r.stdout.strip()[:300], files, notes)

    def restore(self, page: Page, base_sha: str, today: str) -> Result:
        befores = [b for b in self._history(page.key, "before") if not b[3].get("dry_run")]
        if not befores:
            return Result(False, f"no before-snapshot for {page.key} under {self.snap_dir}")
        chosen = None
        if base_sha:
            for b in befores:  # the first edit made on/after the run base holds the pre-run row
                head = b[3].get("git_head")
                if head and subprocess.run(["git", "merge-base", "--is-ancestor", base_sha, head], cwd=self.root,
                                           capture_output=True).returncode == 0:
                    chosen = b
                    break
        if chosen is None:  # no git link: earliest snapshot of the most recent edit day
            last_day = befores[-1][0]
            chosen = next(b for b in befores if b[0] == last_day)
        target = _norm_row(chosen[3]["row"])
        if self._dsn():
            current = self._fetch_row(page.key)
            if current is None:
                return Result(False, f"no landing_pages row {page.key}")
        else:
            afters = self._history(page.key, "after")
            current = _norm_row(afters[-1][3]["row"]) if afters else self._row(page)
        cols = [k for k in EDIT_COLS if current.get(k) != target.get(k)]
        if not cols:
            return Result(True, "already at the pre-run state", [], [f"restored to {base_sha} (no change)"])
        expect = {k: current.get(k) for k in cols}
        after = {k: target.get(k) for k in cols}
        dates = {k: target.get(k) for k in ("updated_at", "last_generated_at")}
        dates = dates if any(dates.values()) else None
        notes = [f"restore {', '.join(cols)} to the before-snapshot {chosen[2].name} (run base {base_sha})"]
        rel, _ = self._pick_script(page.path, today, expect, restore=True)
        sql_rel = rel[:-3] + ".sql"
        self._write(rel, self._render_script(rel, page.key, page.path, today, expect, after, notes, dates, "REVERT"))
        self._write(sql_rel, self._render_sql(page.key, expect, after, dates))
        files = [rel, sql_rel]
        if not self._dsn():
            if self.apply_mode == "mcp":
                self._queue(sql_rel, page, "REVERT")
                self.save_snapshot({**current, **after}, source="pending")
                files.append(str(self._snap_path(page.key).relative_to(self.root)))
                return Result(True, "PENDING_SQL " + sql_rel, files, notes + ["PENDING_SQL " + sql_rel])
            return Result(False, MISSING_DB, files, notes + [f"apply {sql_rel} via Supabase MCP execute_sql"])
        r = self._run_script(rel)
        if r.returncode != 0:
            return Result(False, f"restore script failed ({r.returncode}): {(r.stderr or r.stdout).strip()[:300]}",
                          files, notes)
        live = self._fetch_row(page.key)
        if live:
            self.save_snapshot(live, source="db")
            files.append(str(self._snap_path(page.key).relative_to(self.root)))
        notes.append(self._bust())
        return Result(True, r.stdout.strip()[:300], files, notes)

    def validate(self, files: list[str]) -> tuple[bool, str]:
        msgs, ok = [], True
        scripts = [f for f in files if re.search(r"(^|/)rank_drop_\d{8}_[^/]+\.py$", f)]
        if not scripts:
            return True, "no rank_drop scripts to validate"
        for rel in scripts:
            f = self.root / rel
            try:
                compile(f.read_text(), rel, "exec")  # syntax check without writing a .pyc
            except SyntaxError as e:
                return False, f"{rel}: {e}"[:300]
            after = script_values(f.read_text()).get("AFTER") or {}
            if "_restore" not in f.name:
                hard, soft = self.check_fields(after)
                if hard:
                    ok = False
                msgs += [f"{rel}: {p}" for p in hard] + [f"{rel}: warn {p}" for p in soft]
            if self._dsn():
                r = self._run_script(rel, "--dry")
                if r.returncode != 0:
                    ok = False
                msgs.append(f"{rel} --dry: {(r.stdout or r.stderr).strip()[:160]}")
        return ok, "; ".join(msgs)[:600] or "ok"


def script_values(src: str) -> dict:
    """EXPECT / AFTER / SET_DATES / PAGE_KEY literals of a generated script (no execution)."""
    out = {}
    for node in ast.parse(src).body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            if node.targets[0].id in ("EXPECT", "AFTER", "SET_DATES", "PAGE_KEY", "CANONICAL_PATH", "TABLE"):
                out[node.targets[0].id] = ast.literal_eval(node.value)
    return out


BACKEND = PgRows
