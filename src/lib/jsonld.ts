// JSON-LD builders for authorship + editorial review schema (YMYL E-E-A-T). Plain functions, no Astro deps.
import { SITE, OPERATOR, EDITORIAL_DESK, EDITORIAL_REVIEWER } from "../data/site";
import type { Source, Reviewer } from "../data/types";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": EDITORIAL_REVIEWER.id,
    name: EDITORIAL_REVIEWER.name,
    honorificSuffix: EDITORIAL_REVIEWER.credentials,
    url: EDITORIAL_REVIEWER.url,
    image: EDITORIAL_REVIEWER.image,
    jobTitle: EDITORIAL_REVIEWER.role,
    description: EDITORIAL_REVIEWER.bio,
    sameAs: [...EDITORIAL_REVIEWER.sameAs],
    alumniOf: EDITORIAL_REVIEWER.alumniOf.map((school) => ({
      "@type": "CollegeOrUniversity",
      name: school.name,
      sameAs: school.sameAs,
    })),
    knowsAbout: [...EDITORIAL_REVIEWER.knowsAbout],
    worksFor: {
      "@type": "Organization",
      name: OPERATOR.name,
      url: OPERATOR.url,
    },
  };
}

export function profilePageSchema(canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: canonicalUrl,
    name: `${EDITORIAL_REVIEWER.displayName} — ${EDITORIAL_REVIEWER.role} | ${SITE.name}`,
    mainEntity: personSchema(),
  };
}

/** Standalone Person schema for an optional specialist legal/tax page reviewer (e.g., attorney or CPA). */
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

/** Article schema cleanly separating the Research Desk (Organization author) from the verified
 *  human Editorial Reviewer (Person editor) + primary-source citations. */
export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  sources?: Source[];
  reviewedBy?: Reviewer;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    image: { "@type": "ImageObject", url: `${SITE.url}/favicon.svg` },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      "@type": "Organization",
      name: EDITORIAL_DESK.name,
      url: EDITORIAL_DESK.url,
    },
    editor: {
      "@type": "Person",
      "@id": EDITORIAL_REVIEWER.id,
      name: EDITORIAL_REVIEWER.name,
      honorificSuffix: EDITORIAL_REVIEWER.credentials,
      url: EDITORIAL_REVIEWER.url,
      sameAs: [...EDITORIAL_REVIEWER.sameAs],
    },
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
