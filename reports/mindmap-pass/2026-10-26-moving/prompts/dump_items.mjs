import * as L from "../../../../src/lib/checklists.ts";
for (const s of L.SECTIONS.moving) {
  console.log(s.title + ":");
  for (const i of s.items) console.log(`- ${i.text}${i.note ? ` (note: ${i.note})` : ""}${L.ONLY[i.id] ? ` [only if: ${L.ONLY[i.id]}]` : ""}${i.link ? ` [links: ${i.link.label}]` : ""}`);
}
