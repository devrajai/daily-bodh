# Free infrastructure

How Daily Bodh runs, what it depends on, and what it deliberately does not.

## Architecture

```text
Browser / Android app
        |
        +-- Static JSON served alongside the page  (the whole experience)
```

There is no server, no account, no database and no API key. Every number the
site shows is computed in the browser from files served with it.

## What this project actually uses

- **Astronomy:** computed at build time with `kalagana` (MIT), Lahiri ayanamsa,
  into JSON under `docs/data/`. Nothing is fetched at runtime.
- **Website:** static files on GitHub Pages.
- **Android app:** the same JSON bundled into the APK. The offline build has no
  INTERNET permission at all.
- **Place lookup:** a bundled list of 33 cities with coordinates and UTC offsets
  (`docs/data/places.json`). No geocoding service is called.
- **Interpretation:** the tradition's own rule tables, evaluated in code. There
  is no language model and no AI provider, so there is no per-request cost and
  nothing to hallucinate.
- **Gita text:** the public-domain `gita/gita` dataset (Unlicense).

Free does not mean unlimited or guaranteed. Record the licence, attribution and
fallback for every dependency, and re-check provider terms before relying on any
of it.

## Caveats on the calculations

The site **does** cast the ascendant: `docs/chart.js` computes it from the exact
birth time, latitude and longitude, validated against kalagana to within 0.6
arc-minutes across 400 random charts. The real limits are narrower:

- The ephemeris stores graha longitudes at **12:00 IST**, so the site **linearly
  interpolates** for a birth at another hour. A fast-moving Moon can be a
  fraction of a degree out.
- There is **no historical daylight-saving database**. Places carry a standard
  UTC offset, which you can override.
- **Shadbala, Ashtakavarga and the divisional charts beyond D9 are not
  computed.** They are large tables that could not be verified against an
  authoritative source, so they are omitted rather than guessed.

## What was deliberately not adopted

A larger blueprint for this kind of product proposed pricing, subscriptions, a
payment provider, managed PostgreSQL, a licensed geocoding service, an AI model
provider, a serverless API proxy, and an admin console with billing. None of it
is here. None of it is needed to compute an accurate chart, and each item adds a
cost, a credential, or a place for birth data to leak.

Swiss Ephemeris was also avoided: it is AGPL, whereas kalagana provides the same
positions under MIT.

## Repository size

The publish step must never commit a large generated archive. A `git archive` of
the repository contains the previous archive, so it grows on every run until it
passes GitHub's 100 MB per-file limit and the push is rejected. The workflow
stages the APKs and the data only, and refuses to push any staged file over
50 MB with a clear message. Use GitHub's own "Download ZIP" on the repository
page when a source snapshot is wanted.

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

## Deployment

1. GitHub Pages serves `docs/`.
2. `.github/workflows/apk.yml` regenerates the data and builds the APKs.
3. `.github/workflows/validate-json.yml` checks that no data file is malformed.
