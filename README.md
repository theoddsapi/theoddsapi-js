# @theoddsapi/client

Official JavaScript client for [TheOddsAPI](https://theoddsapi.com): real-time sports odds from 50+ sportsbooks across 26 sports, normalized into one JSON shape, plus player props, Pinnacle-anchored edge detection, fair odds, and historical snapshots.

Zero dependencies. Node 18+ or any runtime with global fetch.

## Why TheOddsAPI?

- 50+ sportsbooks, one JSON shape
- 26 sports, plus player props and historical snapshots
- Pinnacle-anchored fair odds and cross-book arbitrage (Business)
- Zero dependencies — uses global fetch, nothing to install

## Install

```
npm install @theoddsapi/client
```

## Quick start

```js
import { TheOddsAPI } from "@theoddsapi/client";

const client = new TheOddsAPI("YOUR_API_KEY");
const odds = await client.odds("baseball_mlb", { oddsFormat: "decimal" });
```

Get a free key in minutes at [theoddsapi.com/start](https://theoddsapi.com/start). No credit card.

## Endpoints

Core data: `sports()`, `odds()`, `events()`, `bestLines()`. Business plan: `props()`, `edges()`, `fairOdds()`, `consensus()`, `arbitrage()`, `valueBets()`, `historicalOdds()`, `historicalSettlements()`. Account: `me()`.

Non-2xx responses throw `TheOddsAPIError` with `.status` and `.detail`; transient 5xx responses retry with backoff automatically.

## Examples

Runnable scripts in `examples/`, each showing one endpoint end to end:

| File | Plan | Shows |
|---|---|---|
| `examples/nba.js` | Free | Moneylines + best price per team |
| `examples/mlb.js` | Free | Moneylines + best price per team |
| `examples/player_props.js` | Business | Player props across books |
| `examples/historical.js` | Business | Closing-line snapshots for backtesting |
| `examples/arbitrage.js` | Business | Cross-book two-outcome arbitrage |
| `examples/fair_odds.js` | Business | Vig-removed consensus price (h2h only) |

## Links

Full reference: [theoddsapi.com/docs](https://theoddsapi.com/docs/) · Guides: [theoddsapi.com/guides](https://theoddsapi.com/guides/) · Free calculators: [theoddsapi.com/tools](https://theoddsapi.com/tools/)

## License

MIT. Independently developed against the published TheOddsAPI OpenAPI specification.
