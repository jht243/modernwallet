// BLS Consumer Price Index for All Urban Consumers (CPI-U), U.S. city average, all items, not seasonally
// adjusted, 1982-84 = 100 — series CUUR0000SA0. Pulled from the BLS Public Data API
// (https://api.bls.gov/publicAPI/v2/timeseries/data/) on 2026-10-28 (tool-usage pass). Annual averages 1913–2025
// are the BLS "M13" values; the latest month is the newest monthly value BLS had published on that date.
// BLS did not publish an October 2025 index; its 2025 annual average is the BLS figure as published.
// Refresh: re-pull the series and update CPI_LATEST when BLS publishes a newer month.

/** CPI-U annual averages by year (BLS series CUUR0000SA0, M13). */
export const CPI_U_ANNUAL: Record<number, number> = {
  1913: 9.9, 1914: 10, 1915: 10.1, 1916: 10.9, 1917: 12.8, 1918: 15.1,
  1919: 17.3, 1920: 20, 1921: 17.9, 1922: 16.8, 1923: 17.1, 1924: 17.1,
  1925: 17.5, 1926: 17.7, 1927: 17.4, 1928: 17.1, 1929: 17.1, 1930: 16.7,
  1931: 15.2, 1932: 13.7, 1933: 13, 1934: 13.4, 1935: 13.7, 1936: 13.9,
  1937: 14.4, 1938: 14.1, 1939: 13.9, 1940: 14, 1941: 14.7, 1942: 16.3,
  1943: 17.3, 1944: 17.6, 1945: 18, 1946: 19.5, 1947: 22.3, 1948: 24.1,
  1949: 23.8, 1950: 24.1, 1951: 26, 1952: 26.5, 1953: 26.7, 1954: 26.9,
  1955: 26.8, 1956: 27.2, 1957: 28.1, 1958: 28.9, 1959: 29.1, 1960: 29.6,
  1961: 29.9, 1962: 30.2, 1963: 30.6, 1964: 31, 1965: 31.5, 1966: 32.4,
  1967: 33.4, 1968: 34.8, 1969: 36.7, 1970: 38.8, 1971: 40.5, 1972: 41.8,
  1973: 44.4, 1974: 49.3, 1975: 53.8, 1976: 56.9, 1977: 60.6, 1978: 65.2,
  1979: 72.6, 1980: 82.4, 1981: 90.9, 1982: 96.5, 1983: 99.6, 1984: 103.9,
  1985: 107.6, 1986: 109.6, 1987: 113.6, 1988: 118.3, 1989: 124, 1990: 130.7,
  1991: 136.2, 1992: 140.3, 1993: 144.5, 1994: 148.2, 1995: 152.4, 1996: 156.9,
  1997: 160.5, 1998: 163, 1999: 166.6, 2000: 172.2, 2001: 177.1, 2002: 179.9,
  2003: 184, 2004: 188.9, 2005: 195.3, 2006: 201.6, 2007: 207.342, 2008: 215.303,
  2009: 214.537, 2010: 218.056, 2011: 224.939, 2012: 229.594, 2013: 232.957, 2014: 236.736,
  2015: 237.017, 2016: 240.007, 2017: 245.12, 2018: 251.107, 2019: 255.657, 2020: 258.811,
  2021: 270.97, 2022: 292.655, 2023: 304.702, 2024: 313.689, 2025: 321.943,
};

/** The newest monthly CPI-U value in this file. */
export const CPI_LATEST = { year: 2026, month: 9, label: "September 2026", value: 336.94 };

/** CPI-U for the same month one year earlier (September 2025), for the latest 12-month change. */
export const CPI_YEAR_AGO = { year: 2025, month: 9, label: "September 2025", value: 324.8 };

export const CPI_FIRST_YEAR = 1913;
export const CPI_LAST_FULL_YEAR = 2025;
export const CPI_SERIES_ID = "CUUR0000SA0";
export const CPI_SOURCE_URL = "https://data.bls.gov/timeseries/CUUR0000SA0";

/** Latest 12-month CPI-U change, in percent (September 2025 → September 2026). */
export const CPI_12M_CHANGE_PCT = (CPI_LATEST.value / CPI_YEAR_AGO.value - 1) * 100;

export interface PastValueResult {
  /** The past amount restated in dollars of the latest CPI month. */
  todayValue: number;
  /** Cumulative price change from the year's average to the latest month, in percent. */
  cumulativePct: number;
  /** Average yearly inflation over the span (compound), in percent; null for a span under one year. */
  avgYearlyPct: number | null;
  /** Years between mid-year of the start year and the latest month. */
  years: number;
}

/** amount × CPI(latest month) ÷ CPI(annual average of `year`). Null for a year outside the data. */
export function pastToToday(amount: number, year: number): PastValueResult | null {
  const base = CPI_U_ANNUAL[year];
  if (!base || !(amount >= 0)) return null;
  const ratio = CPI_LATEST.value / base;
  // An annual average sits at mid-year, so the span runs from July 1 of `year` to the latest month.
  const years = CPI_LATEST.year + (CPI_LATEST.month - 0.5) / 12 - (year + 0.5);
  return {
    todayValue: amount * ratio,
    cumulativePct: (ratio - 1) * 100,
    avgYearlyPct: years >= 1 ? (Math.pow(ratio, 1 / years) - 1) * 100 : null,
    years,
  };
}
