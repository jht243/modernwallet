#!/usr/bin/env python3
"""Build the downloadable templates served from /templates/.

Standard library only — no python-docx, no openpyxl. A .docx is just a ZIP of
Office Open XML parts, and the subset needed for a clean, editable business
document (headings, paragraphs, tables, bold runs) is small enough to emit
directly. Keeping it dependency-free means the files can be regenerated in any
CI or cloud-routine environment without an install step.

Run from the repo root:

    python3 scripts/build_templates.py

Outputs to public/downloads/. Every file is regenerated from scratch, so the
script is the source of truth — edit here, never edit the artefacts.
"""

from __future__ import annotations

import csv
import io
import zipfile
from dataclasses import dataclass, field
from pathlib import Path
from xml.sax.saxutils import escape

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "downloads"

# --------------------------------------------------------------------------------------
# Minimal Office Open XML writer
# --------------------------------------------------------------------------------------

CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>"""

ROOT_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

DOC_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

# Heading and body styles. Deliberately plain: these are documents people will edit and
# put their own branding on, so anything decorative is something they have to remove.
STYLES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr>
<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/>
</w:rPr></w:rPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:pPr>
<w:spacing w:after="240"/></w:pPr><w:rPr><w:b/><w:sz w:val="44"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:pPr>
<w:spacing w:before="280" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr>
<w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr>
<w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:style>
</w:styles>"""


def _run(text: str, bold: bool = False, italic: bool = False) -> str:
    props = ""
    if bold or italic:
        props = "<w:rPr>" + ("<w:b/>" if bold else "") + ("<w:i/>" if italic else "") + "</w:rPr>"
    return f'<w:r>{props}<w:t xml:space="preserve">{escape(text)}</w:t></w:r>'


def _para(text: str = "", style: str | None = None, bold: bool = False, italic: bool = False) -> str:
    ppr = f'<w:pPr><w:pStyle w:val="{style}"/></w:pPr>' if style else ""
    return f"<w:p>{ppr}{_run(text, bold, italic) if text else ''}</w:p>"


def _cell(text: str, bold: bool = False, width: int = 2400) -> str:
    return (
        f'<w:tc><w:tcPr><w:tcW w:w="{width}" w:type="dxa"/></w:tcPr>'
        f"{_para(text, bold=bold)}</w:tc>"
    )


def _table(rows: list[list[str]], header: bool = True, widths: list[int] | None = None) -> str:
    if not rows:
        return ""
    cols = len(rows[0])
    widths = widths or [int(9360 / cols)] * cols
    borders = (
        "<w:tblBorders>"
        + "".join(
            f'<w:{edge} w:val="single" w:sz="4" w:color="CCCCCC"/>'
            for edge in ("top", "left", "bottom", "right", "insideH", "insideV")
        )
        + "</w:tblBorders>"
    )
    out = [f'<w:tbl><w:tblPr><w:tblW w:w="9360" w:type="dxa"/>{borders}</w:tblPr>']
    for i, row in enumerate(rows):
        cells = "".join(_cell(c, bold=(header and i == 0), width=widths[j]) for j, c in enumerate(row))
        out.append(f"<w:tr>{cells}</w:tr>")
    out.append("</w:tbl>")
    # Word requires a paragraph after a table or the next block can render oddly.
    out.append(_para())
    return "".join(out)


@dataclass
class Doc:
    """A document under construction. Blocks are raw OOXML fragments."""

    blocks: list[str] = field(default_factory=list)

    def title(self, text: str) -> "Doc":
        self.blocks.append(_para(text, style="Title"))
        return self

    def heading(self, text: str) -> "Doc":
        self.blocks.append(_para(text, style="Heading1"))
        return self

    def para(self, text: str = "", bold: bool = False, italic: bool = False) -> "Doc":
        self.blocks.append(_para(text, bold=bold, italic=italic))
        return self

    def bullets(self, items: list[str]) -> "Doc":
        # Rendered as en-dash lines rather than real list numbering: a numbered list needs a
        # numbering.xml part, and these documents are edited by hand anyway.
        for item in items:
            self.blocks.append(_para(f"—  {item}"))
        return self

    def table(self, rows: list[list[str]], widths: list[int] | None = None) -> "Doc":
        self.blocks.append(_table(rows, widths=widths))
        return self

    def signature_block(self, parties: tuple[str, str]) -> "Doc":
        self.heading("Signatures")
        for party in parties:
            self.para(party, bold=True)
            self.para("Signature: ______________________________________")
            self.para("Printed name: ___________________________________")
            self.para("Date: ___________________________________________")
            self.para()
        return self

    def to_bytes(self) -> bytes:
        document = (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            "<w:body>" + "".join(self.blocks) +
            '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/>'
            '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr>'
            "</w:body></w:document>"
        )
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
            z.writestr("[Content_Types].xml", CONTENT_TYPES)
            z.writestr("_rels/.rels", ROOT_RELS)
            z.writestr("word/document.xml", document)
            z.writestr("word/_rels/document.xml.rels", DOC_RELS)
            z.writestr("word/styles.xml", STYLES)
        return buf.getvalue()


DISCLAIMER = (
    "This template is provided for general informational purposes only and is not legal or tax "
    "advice. It is a starting point, not a finished agreement. Laws differ by state and by "
    "industry, and a clause that is standard in one context may be unenforceable in another. "
    "Have a licensed attorney review any agreement before you rely on it."
)


def write_docx(name: str, doc: Doc) -> Path:
    path = OUT_DIR / name
    path.write_bytes(doc.to_bytes())
    return path


def write_csv(name: str, header: list[str], sample_rows: list[list[str]], notes: list[str]) -> Path:
    path = OUT_DIR / name
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        for note in notes:
            w.writerow([f"# {note}"])
        if notes:
            w.writerow([])
        w.writerow(header)
        for row in sample_rows:
            w.writerow(row)
    return path


# --------------------------------------------------------------------------------------
# The templates
# --------------------------------------------------------------------------------------


def freelance_invoice() -> Doc:
    d = Doc().title("INVOICE")
    d.table(
        [
            ["Invoice number", "[INV-0001]"],
            ["Date issued", "[DATE]"],
            ["Payment due", "[DUE DATE — use a real date, not 'Net 30']"],
        ],
        widths=[3000, 6360],
    )
    d.heading("From")
    d.para("[Your name / business name]")
    d.para("[Street address]")
    d.para("[City, State ZIP]")
    d.para("[Email]  ·  [Phone]")
    d.para("[EIN or SSN — only if the client has requested it on a W-9]")
    d.heading("Bill to")
    d.para("[Client business name]")
    d.para("[Attn: accounts payable contact]")
    d.para("[Street address]")
    d.para("[City, State ZIP]")
    d.heading("Work performed")
    d.table(
        [
            ["Description", "Qty / hours", "Rate", "Amount"],
            ["[Describe the deliverable, not the activity]", "[10]", "[$100.00]", "[$1,000.00]"],
            ["[Second line item]", "[2]", "[$100.00]", "[$200.00]"],
            ["", "", "Subtotal", "[$1,200.00]"],
            ["", "", "Deposit already paid", "[-$300.00]"],
            ["", "", "TOTAL DUE", "[$900.00]"],
        ],
        widths=[4400, 1500, 1600, 1860],
    )
    d.heading("How to pay")
    d.para("Bank transfer (preferred): [bank name, routing, account]")
    d.para("Card / online: [payment link]")
    d.para("Make checks payable to: [name]")
    d.para()
    d.para("Thank you — please reference the invoice number with your payment.", italic=True)
    d.heading("Notes")
    d.bullets(
        [
            "Give a real due date. 'Net 30' makes the client do arithmetic, and clients who do arithmetic pay later.",
            "Describe deliverables rather than activities — 'homepage copy, 3 rounds' reads better to accounts payable than 'writing'.",
            "Keep a copy. Your invoices are the primary record of the income you report on Schedule C.",
            "For 2026, clients only file a Form 1099-NEC at $2,000 or more. Income below that is still fully reportable.",
        ]
    )
    d.para()
    d.para(DISCLAIMER, italic=True)
    return d


def freelance_contract() -> Doc:
    d = Doc().title("FREELANCE SERVICES AGREEMENT")
    d.para(
        "This Agreement is made on [DATE] between [CLIENT LEGAL NAME] (\"Client\") and "
        "[YOUR LEGAL NAME] (\"Contractor\")."
    )
    d.heading("1. Services")
    d.para(
        "Contractor will provide the following services: [describe the deliverables specifically. "
        "Vague scope is the single most common cause of a dispute]."
    )
    d.heading("2. Fees and payment")
    d.bullets(
        [
            "Fee: [$X per hour / $X per project / $X per month].",
            "Deposit: [X]% is due before work begins and is non-refundable.",
            "Invoices are issued [weekly / on milestone completion / monthly].",
            "Payment is due within [14] days of the invoice date.",
            "Late payments accrue interest at [1.5]% per month, to the extent permitted by law.",
        ]
    )
    d.heading("3. Scope changes")
    d.para(
        "Work outside the scope described in Section 1 requires written agreement on additional "
        "fees and timeline before it begins. Neither party is obliged to proceed with out-of-scope "
        "work without that agreement."
    )
    d.heading("4. Revisions")
    d.para(
        "The fee includes [2] rounds of revisions per deliverable. Further revisions are billed at "
        "[$X per hour]. Name a number here — unlimited revisions is how a profitable project becomes "
        "an unprofitable one."
    )
    d.heading("5. Timeline and client dependencies")
    d.para(
        "Contractor will deliver by [DATE], provided Client supplies [materials, access, approvals] "
        "by [DATE]. Deadlines extend by the length of any delay in Client's dependencies."
    )
    d.heading("6. Intellectual property")
    d.para(
        "Ownership of the deliverables transfers to Client upon full payment. Until then, Contractor "
        "retains all rights. Contractor retains ownership of pre-existing tools, templates, and "
        "know-how used to produce the work, and may display the work in a portfolio unless Section 7 "
        "says otherwise."
    )
    d.heading("7. Confidentiality")
    d.para(
        "Each party will keep the other's non-public information confidential and use it only to "
        "perform this Agreement. This obligation survives termination for [2] years."
    )
    d.heading("8. Independent contractor status")
    d.para(
        "Contractor is an independent contractor, not an employee. Contractor controls the manner and "
        "means of the work, supplies their own equipment, is free to work for others, and is "
        "responsible for their own taxes, including self-employment tax. Neither party is the other's "
        "agent, and Contractor is not entitled to employee benefits."
    )
    d.heading("9. Termination")
    d.para(
        "Either party may terminate on [14] days' written notice. Client pays for all work completed "
        "and expenses incurred up to the termination date. Deposits are non-refundable."
    )
    d.heading("10. Limitation of liability")
    d.para(
        "Neither party is liable for indirect or consequential damages. Contractor's total liability "
        "is limited to the fees paid under this Agreement."
    )
    d.heading("11. Governing law")
    d.para(
        "This Agreement is governed by the laws of [STATE]. Disputes will be resolved in the courts "
        "of [COUNTY, STATE] or by [mediation / arbitration] before litigation."
    )
    d.heading("12. Entire agreement")
    d.para(
        "This Agreement is the entire agreement between the parties and replaces any prior "
        "discussions. Changes must be in writing and signed by both parties."
    )
    d.signature_block(("Client", "Contractor"))
    d.para(DISCLAIMER, italic=True)
    return d


def statement_of_work() -> Doc:
    d = Doc().title("STATEMENT OF WORK")
    d.para(
        "This Statement of Work (\"SOW\") is issued under the Services Agreement dated [DATE] between "
        "[CLIENT] and [CONTRACTOR]. Where this SOW conflicts with that Agreement, the Agreement "
        "controls unless this SOW says otherwise explicitly."
    )
    d.table(
        [
            ["SOW number", "[SOW-001]"],
            ["Effective date", "[DATE]"],
            ["Project name", "[NAME]"],
        ],
        widths=[3000, 6360],
    )
    d.heading("1. Objective")
    d.para("[One paragraph: what this project is for, in the client's terms, and what success looks like.]")
    d.heading("2. Deliverables")
    d.table(
        [
            ["#", "Deliverable", "Acceptance criteria", "Due"],
            ["1", "[Specific artefact]", "[How the client will judge it complete]", "[DATE]"],
            ["2", "[Specific artefact]", "[Objective, testable criteria]", "[DATE]"],
        ],
        widths=[600, 3200, 3560, 2000],
    )
    d.heading("3. Out of scope")
    d.para(
        "The following are explicitly not included and require a separate SOW or change order: "
        "[list them]. This section prevents more disputes than any other, because it is the one "
        "place an assumption gets written down."
    )
    d.heading("4. Milestones and payment schedule")
    d.table(
        [
            ["Milestone", "Trigger", "Amount"],
            ["Deposit", "On signature, before work begins", "[$X]"],
            ["Midpoint", "On delivery of item 1", "[$X]"],
            ["Final", "On acceptance of all deliverables", "[$X]"],
        ],
        widths=[3000, 4360, 2000],
    )
    d.heading("5. Client responsibilities")
    d.bullets(
        [
            "Provide [materials, brand assets, system access] by [DATE].",
            "Nominate a single approver with authority to sign off deliverables.",
            "Return feedback within [5] business days of each delivery.",
        ]
    )
    d.heading("6. Acceptance")
    d.para(
        "Client has [5] business days from delivery to accept or provide written feedback against the "
        "acceptance criteria. Deliverables not rejected in writing within that window are deemed "
        "accepted. Silence is the most common way a project stalls — this clause resolves it."
    )
    d.heading("7. Change control")
    d.para(
        "Any change to scope, deliverables, timeline, or fees must be agreed in a written change "
        "order signed by both parties before the affected work begins."
    )
    d.heading("8. Assumptions")
    d.bullets(
        [
            "[e.g. Client's existing platform is on a supported version.]",
            "[e.g. Content is supplied in final form and does not require rewriting.]",
        ]
    )
    d.signature_block(("Client", "Contractor"))
    d.para(DISCLAIMER, italic=True)
    return d


def retainer_agreement() -> Doc:
    d = Doc().title("RETAINER AGREEMENT")
    d.para(
        "This Retainer Agreement is made on [DATE] between [CLIENT LEGAL NAME] (\"Client\") and "
        "[YOUR LEGAL NAME] (\"Contractor\")."
    )
    d.heading("1. What the retainer buys")
    d.para(
        "Choose one and delete the other — this is the clause that decides whether a retainer works:"
    )
    d.bullets(
        [
            "CAPACITY: Client reserves [X] hours or [X] days per month of Contractor's availability. "
            "The fee is payable whether or not Client uses the reserved time.",
            "DELIVERABLES: Contractor provides the following each month: [list]. Hours are not tracked; "
            "the fee buys the outcome.",
        ]
    )
    d.heading("2. Fee and payment")
    d.bullets(
        [
            "Monthly fee: [$X], payable in advance on the [1st] of each month.",
            "The first payment is due before work begins.",
            "Payment is due within [7] days of the invoice date.",
            "Fees are reviewed every [6] months and may be adjusted on [30] days' notice.",
        ]
    )
    d.heading("3. Unused time")
    d.para(
        "Unused hours [do not / partially] roll over. If they roll over, they expire after [1] month "
        "and are capped at [X] hours. Unlimited rollover turns a retainer into a liability, because "
        "a client can bank months of your time and call it in at once."
    )
    d.heading("4. Overage")
    d.para(
        "Work beyond the retained amount is billed at [$X per hour], invoiced monthly in arrears. "
        "Contractor will notify Client before exceeding the retained amount."
    )
    d.heading("5. Scope")
    d.para("Covered work: [list]. Not covered: [list]. Out-of-scope work requires a separate agreement.")
    d.heading("6. Response times")
    d.para(
        "Contractor will acknowledge requests within [1] business day and works [days, hours]. This "
        "is a retainer, not an on-call arrangement, unless stated here explicitly."
    )
    d.heading("7. Term and termination")
    d.para(
        "This Agreement runs for an initial term of [3] months, then continues monthly. Either party "
        "may terminate on [30] days' written notice. Fees for the notice period remain payable, and "
        "fees already paid are non-refundable."
    )
    d.heading("8. Independent contractor status")
    d.para(
        "Contractor is an independent contractor, not an employee, controls the manner and means of "
        "the work, is free to work for others, and is responsible for their own taxes including "
        "self-employment tax."
    )
    d.heading("9. Confidentiality and IP")
    d.para(
        "Each party keeps the other's non-public information confidential. Ownership of deliverables "
        "transfers to Client upon payment for the month in which they were produced."
    )
    d.heading("10. Governing law")
    d.para("This Agreement is governed by the laws of [STATE].")
    d.signature_block(("Client", "Contractor"))
    d.para(DISCLAIMER, italic=True)
    return d


MILEAGE_NOTES = [
    "2026 MILEAGE LOG - IRS requires a contemporaneous record: date, miles, destination, purpose.",
    "2026 has TWO business rates: 72.5 cents/mile Jan 1-Jun 30, and 76 cents/mile Jul 1-Dec 31.",
    "Enter the date on every row so miles fall in the right rate period. An annual total cannot be split.",
    "Commuting from home to a regular workplace is NOT deductible. Delete the sample rows before use.",
]

EXPENSE_NOTES = [
    "2026 BUSINESS EXPENSE LOG for Schedule C. One row per expense; keep the receipt.",
    "Category should match a Schedule C line so the year-end totals map straight onto the form.",
    "Business use % matters for anything shared with personal use (phone, internet, laptop).",
    "Deductible amount = Amount x Business use %. Delete the sample rows before use.",
]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    built: list[tuple[str, int]] = []

    for name, doc in [
        ("freelance-invoice-template.docx", freelance_invoice()),
        ("freelance-contract-template.docx", freelance_contract()),
        ("statement-of-work-template.docx", statement_of_work()),
        ("retainer-agreement-template.docx", retainer_agreement()),
    ]:
        p = write_docx(name, doc)
        built.append((name, p.stat().st_size))

    p = write_csv(
        "mileage-log-template.csv",
        ["Date", "Start location", "Destination", "Business purpose", "Odometer start", "Odometer end", "Business miles"],
        [
            ["2026-03-14", "Home office", "Client site, Austin TX", "Client meeting", "41230", "41258", "28"],
            ["2026-08-02", "Home office", "Supplier, Round Rock TX", "Collect materials", "44110", "44149", "39"],
        ],
        MILEAGE_NOTES,
    )
    built.append((p.name, p.stat().st_size))

    p = write_csv(
        "expense-report-template.csv",
        ["Date", "Vendor", "Description", "Schedule C category", "Amount", "Business use %", "Deductible amount", "Receipt kept?"],
        [
            ["2026-02-09", "Adobe", "Creative Cloud subscription", "Office expense", "59.99", "100", "59.99", "Yes"],
            ["2026-02-28", "Mobile carrier", "Phone plan", "Utilities", "85.00", "60", "51.00", "Yes"],
        ],
        EXPENSE_NOTES,
    )
    built.append((p.name, p.stat().st_size))

    print(f"Wrote {len(built)} templates to {OUT_DIR}:")
    for name, size in built:
        print(f"  {name:40s} {size:>8,} bytes")


if __name__ == "__main__":
    main()
