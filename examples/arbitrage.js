/**
 * Arbitrage example: cross-book two-outcome opportunities (Business plan).
 *
 *   npm install @theoddsapi/client
 *   export THEODDSAPI_API_KEY=your_key_here
 *   node examples/arbitrage.js
 *
 * Guide: https://bettingdataapi.com/guides/arbitrage-detection
 *
 * Today this covers two-outcome h2h markets only. Every opportunity
 * carries detected_at / age_seconds (server-side precompute age) and a
 * latency_warning, since arb windows can close in seconds while odds
 * refresh on a slower cycle -- always check age_seconds before acting.
 * Opportunities over ~5% profit are flagged likely_stale rather than
 * trusted at face value.
 */
import { TheOddsAPI, TheOddsAPIError } from "@theoddsapi/client";

const client = new TheOddsAPI(); // reads THEODDSAPI_API_KEY

let opportunities;
try {
  opportunities = await client.arbitrage("basketball_nba");
} catch (e) {
  if (e instanceof TheOddsAPIError && e.status === 403) {
    console.log("Arbitrage detection requires the Business plan:", e.detail);
  } else {
    console.log(`Request failed (${e.status}): ${e.detail}`);
  }
  process.exit(1);
}

if (!opportunities || opportunities.length === 0) {
  console.log("No arbitrage opportunities detected right now.");
  process.exit(0);
}

console.log(`${opportunities.length} opportunities\n`);

for (const opp of opportunities.slice(0, 5)) {
  const flag = opp.likely_stale ? " (likely_stale)" : "";
  console.log(`profit=${opp.profit_pct}%  age=${opp.age_seconds}s${flag}  ${opp.event_id ?? JSON.stringify(opp)}`);
}
