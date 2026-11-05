import { paragraphs, richBody } from "./richtext";

// A period in an abbreviation is not a reliable sentence boundary.
const ABBREVIATIONS = /\b(?:U\.S\.|U\.K\.|Jan\.|Feb\.|Mar\.|Apr\.|Jun\.|Jul\.|Aug\.|Sept?\.|Oct\.|Nov\.|Dec\.|Mr\.|Mrs\.|Ms\.|Dr\.|e\.g\.|i\.e\.)/gi;

/** Keep authored blocks short while preserving abbreviations, links and all text. */
export function benefitParagraphs(input: string): string[] {
  let protectedDot = "\uE000";
  while (input.includes(protectedDot)) protectedDot += "\uE001";
  return input.split(/\n\s*\n/).flatMap((block) => {
    const protectedBlock = block.replace(ABBREVIATIONS, (word) => word.replaceAll(".", protectedDot));
    return paragraphs(protectedBlock).map((paragraph) => paragraph.split(protectedDot).join("."));
  });
}

export function benefitBody(input: string): string {
  return input.split(/\n\s*\n/).map((block) => {
    const html = richBody(block);
    return html.startsWith("<p>") && html.endsWith("</p>")
      ? benefitParagraphs(block).map((paragraph) => richBody(paragraph)).join("\n")
      : html;
  }).join("\n");
}
