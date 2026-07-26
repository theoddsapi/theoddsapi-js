/**
 * Historical odds example: MLB closing-line snapshots (Business plan).
 *
 *   npm install @theoddsapi/client
 *   export THEODDSAPI_API_KEY=your_key_here
 *   node examples/historical.js
 *
 * Guide: https://theoddsapi.com/guides/historical-odds-backtesting
 *
 * Defaults to the last 7 days if no from/to window is given; max limit
 * is 1000 rows per call, paginate with offset for more.
 */
import { TheOddsAPI, TheOddsAPIError } from "@theoddsapi/client";

const client = new TheOddsAPI(); // reads THEODDSAPI_API_KEY

let result;
try {
  result = await client.historicalOdds("baseball_mlb", { bookmakers: "pinnacle", limit: 25 });
} catch (e) {
  if (e instanceof TheOddsAPIError && e.status === 403) {
    console.log("Historical odds require the Business plan:", e.detail);
  } else {
    console.log(`Request failed (${e.status}): ${e.detail}`);
  }
  process.exit(1);
}

const rows = Array.isArray(result) ? result : result?.data ?? [];
const meta = Array.isArray(result) ? null : result?.meta;

if (!rows.length) {
  console.log("No historical rows in the default 7-day window for this filter.");
  process.exit(0);
}

console.log(`${rows.length} rows returned` + (meta ? ` (meta: ${JSON.stringify(meta)})` : ""));
console.log("First row, raw shape:");
console.log(JSON.stringify(rows[0], null, 2).slice(0, 1000));
