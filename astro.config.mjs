import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// Single source of truth for the production URL lives in src/data/site.ts (SITE.url).
// Keep this in sync when the domain is finalized.
// https://astro.build/config
export default defineConfig({
  site: "https://www.themodernwallet.com",
  integrations: [react(), sitemap()],
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    ssr: {
      noExternal: ["lucide-react"],
    },
  },
});
