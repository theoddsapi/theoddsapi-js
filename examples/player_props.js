/**
 * Player props example: NBA player points across books (Business plan).
 *
 *   npm install @theoddsapi/client
 *   export THEODDSAPI_API_KEY=your_key_here
 *   node examples/player_props.js
 *
 * Guide: https://bettingdataapi.com/guides/nba-player-props-edge-detection
 *
 * Note: props responses follow the same events/books/outcomes envelope as
 * GET /odds/, but the exact market-specific fields can vary by sport. This
 * script prints defensively (won't crash on an unfamiliar shape) rather
 * than assume field names it hasn't seen live -- inspect the raw output
 * for your account before building on top of it.
 */
import { TheOddsAPI, TheOddsAPIError } from "@theoddsapi/client";

const client = new TheOddsAPI(); // reads THEODDSAPI_API_KEY

let events;
try {
  events = await client.props("basketball_nba", { markets: "player_points" });
} catch (e) {
  if (e instanceof TheOddsAPIError && e.status === 403) {
    console.log("Player props require the Business plan:", e.detail);
  } else {
    console.log(`Request failed (${e.status}): ${e.detail}`);
  }
  process.exit(1);
}

if (!events || events.length === 0) {
  console.log("No player props in the current window (likely off-season).");
  process.exit(0);
}

console.log(`${events.length} events with player props\n`);
console.log("First event, raw shape:");
console.log(JSON.stringify(events[0], null, 2).slice(0, 1000));
