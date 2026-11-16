/**
 * NBA example: upcoming moneylines + best price per team across books.
 *
 * Free tier. Get a key at https://bettingdataapi.com/start then:
 *   npm install @theoddsapi/client
 *   export THEODDSAPI_API_KEY=your_key_here
 *   node examples/nba.js
 *
 * Uses GET /odds/?sport_key=basketball_nba&markets=h2h. During the NBA
 * off-season this may return an empty list -- that's expected, not a bug.
 */
import { TheOddsAPI } from "@theoddsapi/client";

const client = new TheOddsAPI(); // reads THEODDSAPI_API_KEY

const events = await client.odds("basketball_nba", {
  markets: "h2h",
  bookmakers: "draftkings,fanduel",
});

if (!events || events.length === 0) {
  console.log("No upcoming NBA games in the current window (likely off-season).");
  process.exit(0);
}

console.log(`${events.length} upcoming NBA games\n`);

for (const event of events.slice(0, 5)) {
  const best = {}; // team name -> [price, book]
  for (const entry of event.books ?? []) {
    if (entry.market !== "h2h") continue;
    for (const outcome of entry.outcomes ?? []) {
      const { name: team, price } = outcome;
      if (team == null || price == null) continue;
      if (!(team in best) || price > best[team][0]) {
        best[team] = [price, entry.book];
      }
    }
  }
  console.log(`${event.away_team} at ${event.home_team}`);
  for (const [team, [price, book]] of Object.entries(best)) {
    console.log(`  best ${team}: ${price > 0 ? "+" : ""}${price} at ${book}`);
  }
}
