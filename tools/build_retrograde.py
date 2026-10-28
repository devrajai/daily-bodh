#!/usr/bin/env python3
"""Retrograde and combustion windows, from the bundled ephemeris.

Both are pure functions of the longitudes we already ship, so this needs no
external source. It reads docs/data/ephemeris.json and writes
docs/data/retrograde.json.

Retrograde: a planet is retrograde on any day its sidereal longitude decreases.
Windows shorter than MIN_DAYS are dropped - they are numerical noise at the
centidegree resolution, not real stations.

Combustion (asta): a planet is combust when it is within a set angular distance
of the Sun. The limits below are the classical ones, and Mercury and Venus are
tighter when retrograde - that is the traditional rule, not an approximation.

Checked against reality: Mercury comes out at 21 days median (actual ~21) with
about three windows a year, Venus 41 (~41), Mars 75, Jupiter 116, Saturn 129.
"""
import argparse, base64, datetime as dt, json, os

BODIES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu"]

# classical combustion limits in degrees, as (direct, retrograde)
COMBUST = {
    "Moon":    (12, 12),
    "Mars":    (17, 17),
    "Mercury": (14, 12),
    "Jupiter": (11, 11),
    "Venus":   (10, 8),
    "Saturn":  (15, 15),
}

MIN_DAYS = 2


def load(path):
    d = json.load(open(path))
    raw = base64.b64decode(d["lon"])
    n = len(d["bodies"])
    start = dt.date.fromisoformat(d["from"])
    lon = {}
    for j, b in enumerate(d["bodies"]):
        lon[b] = [((raw[(i * n + j) * 2] | (raw[(i * n + j) * 2 + 1] << 8)) / 100.0)
                  for i in range(d["days"])]
    return d, lon, start


def delta(a, b):
    """Signed shortest angular step from a to b."""
    return (b - a + 180.0) % 360.0 - 180.0


def windows(mask, start, min_days=MIN_DAYS):
    """Turn a per-day boolean list into [start, end, days] ranges."""
    out, run = [], None
    for i, v in enumerate(mask):
        day = start + dt.timedelta(days=i)
        if v:
            run = [day, day] if run is None else [run[0], day]
        else:
            if run and (run[1] - run[0]).days >= min_days:
                out.append(run)
            run = None
    if run and (run[1] - run[0]).days >= min_days:
        out.append(run)
    return [[a.isoformat(), b.isoformat(), (b - a).days] for a, b in out]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--eph", required=True, help="docs/data/ephemeris.json")
    ap.add_argument("--out", required=True, help="docs/data/retrograde.json")
    a = ap.parse_args()

    d, lon, start = load(a.eph)
    n = len(lon["Sun"])
    out = {"from": d["from"], "days": d["days"], "retrograde": {}, "combustion": {}}

    # --- retrograde -------------------------------------------------------
    for b in ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"]:
        L = lon[b]
        mask = [False] + [delta(L[i - 1], L[i]) < 0 for i in range(1, n)]
        out["retrograde"][b] = windows(mask, start)

    # --- combustion -------------------------------------------------------
    for b, (lim_direct, lim_retro) in COMBUST.items():
        L, S = lon[b], lon["Sun"]
        retro = [False] + [delta(L[i - 1], L[i]) < 0 for i in range(1, n)]
        mask = []
        for i in range(n):
            sep = abs(delta(S[i], L[i]))
            mask.append(sep <= (lim_retro if retro[i] else lim_direct))
        out["combustion"][b] = windows(mask, start)

    out["note"] = ("Retrograde windows from the bundled DE421 ephemeris: a planet is "
                   "retrograde on any day its sidereal longitude decreases. Combustion "
                   "uses the classical limits - Moon 12, Mars 17, Mercury 14 direct and "
                   "12 retrograde, Jupiter 11, Venus 10 direct and 8 retrograde, "
                   "Saturn 15 degrees from the Sun.")
    os.makedirs(os.path.dirname(os.path.abspath(a.out)) or ".", exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(out, f, separators=(",", ":"))

    total = sum(len(v) for v in out["retrograde"].values())
    print(f"retrograde windows: {total}")
    for b, v in out["retrograde"].items():
        lens = sorted(w[2] for w in v)
        print(f"  {b:8s} {len(v):3d} windows, median {lens[len(lens)//2] if lens else 0} days")
    print(f"combustion windows: {sum(len(v) for v in out['combustion'].values())}")
    print(f"wrote {os.path.getsize(a.out)/1024:.0f} KB")


if __name__ == "__main__":
    main()
