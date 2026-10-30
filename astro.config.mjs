import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { isNoindexedPath } from "./src/data/noindex.ts";

const CANCEL_PLANNER_PATH = "/checklists/cancel-subscription-planner/";
const CANCEL_PLANNER_UPDATED = "2026-10-29";
const ROBINHOOD_GOLD_PATH = "/guides/is-robinhood-gold-worth-it/";
const ROBINHOOD_GOLD_UPDATED = "2026-10-29";

// Single source of truth for the production URL lives in src/data/site.ts (SITE.url).
// Keep this in sync when the domain is finalized.
// https://astro.build/config
export default defineConfig({
  site: "https://www.themodernwallet.com",
  // Keep noindexed spoke/state pages out of the sitemap — listing a `noindex` URL is a
  // GSC quality demerit ("Submitted URL marked noindex"). See src/data/noindex.ts.
  integrations: [react(), sitemap({
    filter: (page) => !isNoindexedPath(new URL(page).pathname),
    serialize(item) {
      const pathname = new URL(item.url).pathname;
      if (pathname === CANCEL_PLANNER_PATH) return { ...item, lastmod: new Date(`${CANCEL_PLANNER_UPDATED}T00:00:00.000Z`) };
      if (pathname === ROBINHOOD_GOLD_PATH) return { ...item, lastmod: new Date(`${ROBINHOOD_GOLD_UPDATED}T00:00:00.000Z`) };
      return item;
    },
  })],
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    ssr: {
      noExternal: ["lucide-react"],
    },
  },
});
