for name in ["uk_guide", "ramsey_guide"]:
    src = f"reports/keyword-pass/2026-09-16/drafts/{name}.ts.json"
    dst = f"reports/keyword-pass/2026-09-16/drafts/{name}.insert.ts"
    text = open(src).read()
    lines = text.split("\n")
    indented = "\n".join(("  " + l if l.strip() else l) for l in lines)
    indented = indented + ",\n"
    open(dst, "w").write(indented)
print("done")
