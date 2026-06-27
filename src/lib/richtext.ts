// Tiny rich-text helper for content strings authored with inline markdown links: [text](/path/).
// `linkify` → safe HTML (escapes everything, then turns links into <a>). Use with set:html.
// `plain`   → strips link syntax to just the anchor text (for <meta>, JSON-LD, anywhere HTML is wrong).

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Escape HTML, then render [text](url) as anchors. Internal links (starting "/") stay normal;
 *  external (http) get rel="noopener". Content is first-party/trusted (we generate it). */
export function linkify(input: string): string {
  const escaped = escapeHtml(input);
  return escaped.replace(LINK_RE, (_m, text: string, url: string) => {
    const isExternal = /^https?:\/\//i.test(url);
    const rel = isExternal ? ' rel="noopener"' : "";
    const target = isExternal ? ' target="_blank"' : "";
    return `<a href="${url}"${target}${rel}>${text}</a>`;
  });
}

/** Strip [text](url) down to text. For meta descriptions and JSON-LD answer text. */
export function plain(input: string): string {
  return input.replace(LINK_RE, (_m, text: string) => text).replace(/\s+/g, " ").trim();
}
