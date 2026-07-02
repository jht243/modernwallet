// JSON-LD builders for authorship + article schema (YMYL E-E-A-T). Plain functions, no Astro deps.
import { SITE, AUTHOR } from "../data/site";
import type { Source, Reviewer } from "../data/types";

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

/** Standalone Person schema for a legal/tax page reviewer (e.g. attorney). Emitted alongside the
 *  primary personSchema() on pages that pass a reviewer; keeps each entity properly typed for
 *  Google's Person guidelines. */
export function reviewerPersonSchema(reviewer: Reviewer) {
  const url = reviewer.url && reviewer.url.length > 0 ? reviewer.url : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: reviewer.name,
    ...(url ? { url } : {}),
    ...(reviewer.credentials ? { honorificSuffix: reviewer.credentials } : {}),
    worksFor: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
}

/** Article schema with named author + publisher + citations. `url` is the canonical page URL.
 *  `reviewedBy` defaults to AUTHOR (current behavior); pass a Reviewer to override on legal pages. */
export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  sources?: Source[];
  reviewedBy?: Reviewer;
}) {
  const reviewer = opts.reviewedBy;
  const reviewerNode = reviewer
    ? {
        "@type": "Person",
        name: reviewer.name,
        ...(reviewer.url && reviewer.url.length > 0 ? { url: reviewer.url } : {}),
        ...(reviewer.credentials ? { honorificSuffix: reviewer.credentials } : {}),
      }
    : { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    image: { "@type": "ImageObject", url: `${SITE.url}/favicon.svg` },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    reviewedBy: reviewerNode,
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
