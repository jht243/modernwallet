// JSON-LD builders for authorship + article schema (YMYL E-E-A-T). Plain functions, no Astro deps.
import { SITE, AUTHOR } from "../data/site";
import type { Source } from "../data/types";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
    url: AUTHOR.url,
    jobTitle: AUTHOR.role,
    description: AUTHOR.bio,
    knowsAbout: AUTHOR.knowsAbout,
    worksFor: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
}

/** Article schema with named author + publisher + citations. `url` is the canonical page URL. */
export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  sources?: Source[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    reviewedBy: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/favicon.svg` },
    },
    ...(opts.sources && opts.sources.length
      ? { citation: opts.sources.map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })) }
      : {}),
  };
}
