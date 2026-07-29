import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { isNoindexedPath } from "./src/data/noindex.ts";

// Single source of truth for the production URL lives in src/data/site.ts (SITE.url).
// Keep this in sync when the domain is finalized.
// https://astro.build/config
export default defineConfig({
  site: "https://www.themodernwallet.com",
  // Keep noindexed spoke/state pages out of the sitemap — listing a `noindex` URL is a
  // GSC quality demerit ("Submitted URL marked noindex"). See src/data/noindex.ts.
  integrations: [react(), sitemap({ filter: (page) => !isNoindexedPath(new URL(page).pathname) })],
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    ssr: {
      noExternal: ["lucide-react"],
    },
  },
});
