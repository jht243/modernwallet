/**
 * Where the API routes live.
 *
 * This site is a STATIC export, so the CDN host has no /api/* at read time.
 * Search logging POSTs cross-origin to the shared fleet API service
 * (growth-sites-api), which resolves the site from the request Origin.
 *
 * Set PUBLIC_API_BASE in the static site's build env to override. Empty /
 * unset = the shared fleet API (correct for production and local dev alike).
 */
export const API_BASE: string =
  import.meta.env.PUBLIC_API_BASE || 'https://growth-sites-api.onrender.com';
