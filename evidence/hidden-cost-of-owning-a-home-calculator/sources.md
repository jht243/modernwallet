# Source notes — hidden cost of owning a home (read 2026-10-29)

Primary: Zillow and Thumbtack release, 2026-10-22, "Hidden costs of homeownership top $16.5K a year, up nearly 32% in 5 years" (https://zillow.mediaroom.com/2026-10-22-Hidden-costs-of-homeownership-top-16-5K-year,-up-nearly-32-in-5-years), fetched 2026-10-29 (HTTP 200). The release links nothing at zillow.com/research; that URL appeared only in the scout email, returned 403 to two fetchers, and is NOT used.
- Typical U.S. homeowner: $16,566 a year, about $1,380 a month, on top of a mortgage payment.
- Maintenance $11,171 (about two-thirds), property taxes $3,129, homeowners insurance $2,266. Sum $16,566.
- Total up 31.7% over five years (text: nearly 32%) and 2.8% over one year (text: 3%). Insurance +54% over five years (largest), maintenance +32%, property taxes +19%. Maintenance annual increases fell each year, from 9% in 2022 to 1% in 2026.
- Insurance is up at least 50% over five years in 19 of the 30 metros analyzed; largest five-year rises: Dallas 75%, Tampa 71%, Denver 70%, Houston 69%. Six metros top $3,000 a year for insurance (Miami, Dallas, Houston, Tampa, Orlando, Denver). Miami insurance is nearly $5,000 a year, the highest.
- 30-metro total table: highest New York $25,111; lowest Phoenix $14,187 (others between, e.g. Los Angeles $22,915, Chicago $18,239, Houston $16,529).
- Method: Zillow estimated property taxes and insurance for a typical U.S. homeowner in each metro; Thumbtack supplied maintenance as a weighted index of yearly maintenance projects (recommended frequency, quarterly moving average). The release does not define a typical home or give a home value.

Corroboration: Fox Business, 2026-10-22 (https://www.foxbusiness.com/economy/owning-home-comes-hidden-price-tag-its-getting-more-expensive), same figures, "in addition to a mortgage payment".

Arithmetic checks are in output.json (nationalSumCheck, backcastFiveYears). Components sum to the reported total.
