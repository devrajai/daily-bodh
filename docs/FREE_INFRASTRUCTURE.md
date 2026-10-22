# Free and open infrastructure

How Daily Bodh runs, what it depends on, and what it deliberately does not.

## Target architecture

```text
Browser / Android app
        |
        +-- Bundled or static JSON data  (the whole core experience)
        |
        +-- Optional server, only for features that genuinely need one
```

The core has no server. Every number the site shows is computed in the browser
from files served alongside the page.

## What this project actually does

- **Astronomy:** computed at build time with `kalagana` (MIT), Lahiri ayanamsa,
  into JSON under `docs/data/`. Nothing is fetched at runtime.
- **Website:** static files on GitHub Pages. No account, no database, no API key.
- **Android app:** the same JSON bundled into the APK. The offline build has no
  INTERNET permission at all.
- **Place lookup:** a bundled list of 33 cities with coordinates and UTC offsets
  (`docs/data/places.json`). No geocoding service is called.
- **Interpretation:** the tradition's own rule tables, evaluated in code. There
  is no language model and no AI provider, so there is no per-request cost and
  nothing to hallucinate.

## Correction to the earlier note about the ephemeris

An earlier draft of this document said the ephemeris "should not be treated as a
substitute for calculating the ascendant from exact time and location". That is
now out of date. The site **does** cast the ascendant: `docs/chart.js` computes it
from the exact birth time, latitude and longitude, and was validated against
kalagana to within 0.6 arc-minutes across 400 random charts. What remains true is
narrower:

- The ephemeris stores graha longitudes at **12:00 IST**, so the site
  **linearly interpolates** between two noon values for a birth at another hour.
  A fast-moving Moon can therefore be a fraction of a degree out.
- There is **no historical daylight-saving database**. Places carry a standard
  UTC offset, and the site lets you override it.
- **Shadbala, Ashtakavarga and the divisional charts beyond D9 are not
  computed.** They are large tables that could not be verified against an
  authoritative source from here, so they are omitted rather than guessed.

## Free services used, and what "free" means

| Service | Used for | Notes |
|---|---|---|
| GitHub Pages | static hosting | public repository |
| GitHub Actions | generating data, building APKs, validating JSON | free-tier limits depend on account type and can change |
| kalagana (MIT) | all astronomy | retain the licence notice |
| Gita source dataset (Unlicense) | the Gita pack | public domain |

Free does not mean unlimited, guaranteed, or unrestricted for commercial use.
Record the licence, attribution, quota and fallback for every dependency, and
re-check provider terms before relying on any of it.

## What was deliberately not adopted

A larger blueprint for this kind of product proposed pricing, subscriptions, a
payment provider, managed PostgreSQL, a licensed geocoding service, an AI model
provider, and an admin console with billing. None of it is here, because none of
it is needed to compute an accurate chart, and each item adds a cost, a
credential, or a place for birth data to leak.

Swiss Ephemeris was also avoided: it is AGPL, whereas kalagana provides the same
positions under MIT.

## If a server is ever needed

Keep it optional, and keep the static site working when it is down.

1. Expose named routes only; never proxy a user-supplied URL.
2. Allow only the expected methods and parameters.
3. Validate and bound every input.
4. Restrict CORS to the deployed origin.
5. Rate-limit and cache.
6. Return safe errors; never leak upstream credentials or internal traces.
7. Never use a proxy to bypass another service's limits or terms.

Public Nominatim is for occasional, user-driven lookups only. It is not a bulk
geocoding backend, and it requires attribution and an identifying User-Agent.
This project does not call it: the bundled city list is sufficient.

## Data licensing checklist

For every dataset or package, record:

- exact package, release or version, and source URL;
- licence text and attribution requirements;
- whether redistribution in a public repository is allowed;
- whether modification and commercial use are allowed;
- update cadence and the source of truth;
- validation dates and known limitations.

Do not copy interpretive text from astrology websites merely because it is
publicly readable. Publicly accessible is not the same as reusable. Keep
interpretive text original, or use sources whose licences explicitly permit
reuse. The classical Sanskrit texts described in the Shastra library are public
domain; modern translations and commentaries generally are not, and none of
their text is reproduced here.

## Deployment order

1. Validate the generated JSON (see `.github/workflows/validate-json.yml`).
2. Keep GitHub Pages as the host.
3. Add a server only for a feature that cannot be computed locally.
