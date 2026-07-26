/**
 * Fair odds example: vig-removed consensus price, moneyline (Business plan).
 *
 *   npm install @theoddsapi/client
 *   export THEODDSAPI_API_KEY=your_key_here
 *   node examples/fair_odds.js
 *
 * Covers the h2h (moneyline) market only today -- that's the endpoint's
 * current scope, not a bug in this script. Passing any other market
 * (spreads, totals, player props) returns an HTTP 400 with a roadmap
 * message; don't build on those until the API says they're supported.
 *
 * The response includes a method_note disclosing that "fair" here means
 * consensus across the tracked retail/offshore books, not a sharp-anchored
 * price -- there's no Pinnacle or Circa in this feed.
 */
import { TheOddsAPI, TheOddsAPIError } from "@theoddsapi/client";

const client = new TheOddsAPI(); // reads THEODDSAPI_API_KEY

let fair;
try {
  fair = await client.fairOdds("baseball_mlb", { market: "h2h" });
} catch (e) {
  if (e instanceof TheOddsAPIError && e.status === 403) {
    console.log("Fair odds require the Business plan:", e.detail);
  } else {
    console.log(`Request failed (${e.status}): ${e.detail}`);
  }
  process.exit(1);
}

const items = Array.isArray(fair) ? fair : [fair];
if (!items.length || items[0] == null) {
  console.log("No fair-odds data in the current window.");
  process.exit(0);
}

for (const entry of items.slice(0, 5)) {
  console.log(entry);
  if (entry?.method_note) console.log(`  note: ${entry.method_note}`);
}
