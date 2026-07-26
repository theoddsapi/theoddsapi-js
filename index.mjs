/**
 * theoddsapi: official JavaScript client for TheOddsAPI (theoddsapi.com).
 * Zero dependencies; uses global fetch (Node 18+, all modern runtimes).
 *
 *   import { TheOddsAPI } from "@theoddsapi/client";
 *   const client = new TheOddsAPI("YOUR_API_KEY");
 *   const odds = await client.odds("baseball_mlb", { oddsFormat: "decimal" });
 */

const BASE_URL = "https://api.theoddsapi.com";
const RETRY_STATUSES = new Set([502, 503, 504]);

export class TheOddsAPIError extends Error {
  constructor(status, detail) {
    super(`HTTP ${status}: ${detail}`);
    this.name = "TheOddsAPIError";
    this.status = status;
    this.detail = detail;
  }
}

const ENV_KEY = "THEODDSAPI_API_KEY";

export class TheOddsAPI {
  constructor(apiKey, { baseUrl = BASE_URL, timeoutMs = 15000, maxRetries = 3 } = {}) {
    this.apiKey = apiKey ??
      (typeof process !== "undefined" ? process.env?.[ENV_KEY] : undefined);
    if (!this.apiKey) {
      throw new TheOddsAPIError(0,
        `no API key: pass new TheOddsAPI("key") or set ${ENV_KEY}. ` +
        "Free key in minutes at https://theoddsapi.com/start");
    }
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.timeoutMs = timeoutMs;
    this.maxRetries = maxRetries;
  }

  async #get(path, params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null));
    const url = `${this.baseUrl}${path}${query.size ? `?${query}` : ""}`;
    let delay = 1000;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const res = await fetch(url, {
        headers: { "x-api-key": this.apiKey, "User-Agent": "theoddsapi-js/1.0.1" },
        signal: AbortSignal.timeout(this.timeoutMs),
      }).catch((e) => {
        if (attempt === this.maxRetries) throw new TheOddsAPIError(0, `connection failed: ${e.message}`);
        return null;
      });
      if (!res) { await sleep(delay); delay = Math.min(delay * 2, 30000); continue; }
      if (res.ok) return res.json();
      if (RETRY_STATUSES.has(res.status) && attempt < this.maxRetries) {
        await sleep(delay); delay = Math.min(delay * 2, 30000); continue;
      }
      const detail = await res.json().then((b) => b.detail ?? res.statusText).catch(() => res.statusText);
      throw new TheOddsAPIError(res.status, detail);
    }
  }

  // Core data
  sports() { return this.#get("/sports/"); }
  odds(sportKey, params = {}) { return this.#get("/odds/", { sport_key: sportKey, ...params }); }
  events(sportKey, params = {}) { return this.#get("/events/", { sport_key: sportKey, ...params }); }
  bestLines(sportKey, params = {}) { return this.#get("/best-lines/", { sport_key: sportKey, ...params }); }

  // Business plan
  props(sportKey, params = {}) { return this.#get("/props/", { sport_key: sportKey, ...params }); }
  edges(sportKey, params = {}) { return this.#get("/edges/", { sport_key: sportKey, ...params }); }
  fairOdds(sportKey, params = {}) { return this.#get("/intelligence/fair-odds", { sport_key: sportKey, ...params }); }
  consensus(sportKey, params = {}) { return this.#get("/intelligence/consensus", { sport_key: sportKey, ...params }); }
  arbitrage(sportKey, params = {}) { return this.#get("/intelligence/arbitrage", { sport_key: sportKey, ...params }); }
  valueBets(sportKey, params = {}) { return this.#get("/intelligence/value", { sport_key: sportKey, ...params }); }
  historicalOdds(sportKey, params = {}) { return this.#get("/historical/odds", { sport_key: sportKey, ...params }); }
  historicalSettlements(sportKey, params = {}) { return this.#get("/historical/settlements", { sport_key: sportKey, ...params }); }

  // Account
  me() { return this.#get("/me/"); }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Canonical import is the named export (see CONVENTIONS.md); the default
// export tolerates `import TheOddsAPI from "@theoddsapi/client"` variants.
export default TheOddsAPI;
