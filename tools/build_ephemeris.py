#!/usr/bin/env python3
"""Per-day sidereal longitudes for the grahas, for the website and the app.

One byte-pair per body per day (centidegrees, little-endian), computed at local
noon IST with the Lahiri ayanamsa.

Why DE421 instead of kalagana
-----------------------------
This file used to be generated from `kalagana` (Meeus algorithms). Checked
against NASA/JPL Horizons on 30 dates, kalagana's Jupiter and Saturn came out
7.2 and 10.1 arc-minutes away, while the fast bodies agreed to about 1. DE421 is
the same JPL data Horizons itself serves, so every body now lands within roughly
1.5 arc-minutes. The fast bodies are unchanged in practice.

Rahu is not a physical body, and no planetary kernel contains it. It is the mean
lunar node from Meeus's polynomial, minus the ayanamsa. That reproduces the old
values exactly - 0.0000 arc-minutes across 15 test dates spanning 1930-2035.

Ketu is not stored: it is exactly Rahu + 180 by definition.

The kernel is a build-time dependency only. Nothing is fetched at runtime, so the
website and the app stay fully offline.
"""
import argparse, base64, datetime as dt, json, os

BODIES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu"]

# DE421 carries the outer planets only as system barycentres. The offset from the
# planet's centre is sub-arcminute - far below the 7-10 arc-minute error this
# replaces. (de440s.bsp has the centres too, at about twice the download.)
TARGETS = {
    "Sun": "sun",
    "Moon": "moon",
    "Mars": "mars",
    "Mercury": "mercury",
    "Venus": "venus",
    "Jupiter": "jupiter barycenter",
    "Saturn": "saturn barycenter",
}


def ayanamsa(jd):
    """Lahiri, the same model docs/chart.js uses."""
    T = (jd - 2451545.0) / 36525.0
    p = (5028.796195 * T + 1.1054348 * T * T + 0.00007964 * T ** 3
         - 0.000023857 * T ** 4 - 0.0000000383 * T ** 5)
    return 23.85305555555556 + p / 3600.0


def mean_node(jd):
    """Mean lunar node (Rahu), tropical, degrees."""
    T = (jd - 2451545.0) / 36525.0
    return (125.0445479 - 1934.1362891 * T + 0.0020754 * T * T
            + T ** 3 / 467441.0 - T ** 4 / 60616000.0) % 360.0


def jd_at_noon_ist(d):
    """Julian Day for 12:00 IST (06:30 UT) on date d."""
    return (dt.datetime(d.year, d.month, d.day, 6, 30,
                        tzinfo=dt.timezone.utc).timestamp() / 86400.0
            + 2440587.5)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--from", dest="y0", type=int, default=1930)
    ap.add_argument("--to", dest="y1", type=int, default=2035)
    ap.add_argument("--kernel", default="de421.bsp")
    a = ap.parse_args()

    from skyfield.api import load
    from skyfield.framelib import ecliptic_frame

    ts = load.timescale()
    eph = load(a.kernel)
    earth = eph["earth"]

    start = dt.date(a.y0, 1, 1)
    end = dt.date(a.y1, 12, 31)
    n = (end - start).days + 1
    buf = bytearray()
    d = start
    for _ in range(n):
        jd = jd_at_noon_ist(d)
        ay = ayanamsa(jd)
        t = ts.utc(d.year, d.month, d.day, 6, 30)
        vals = {}
        for b in BODIES[:-1]:
            astrometric = earth.at(t).observe(eph[TARGETS[b]])
            _, lon, _ = astrometric.frame_latlon(ecliptic_frame)
            vals[b] = (lon.degrees - ay) % 360.0
        vals["Rahu"] = (mean_node(jd) - ay) % 360.0
        for b in BODIES:
            c = int(round(vals[b] * 100)) % 36000
            buf.append(c & 0xFF)
            buf.append((c >> 8) & 0xFF)
        d += dt.timedelta(days=1)

    payload = {
        "from": start.isoformat(),
        "days": n,
        "bodies": BODIES,
        "ayanamsa": "lahiri",
        "source": "NASA/JPL DE421 via skyfield",
        "note": ("Sidereal longitude of each graha at 12:00 IST, in centidegrees, "
                 "two bytes little-endian per body in the order given by 'bodies'. "
                 "Ketu = Rahu + 180. Rahu is the mean node. Positions are for noon, "
                 "so the Moon may be in the neighbouring sign for a birth late or "
                 "early in the day, and no ascendant is implied - that needs an exact "
                 "birth time and place."),
        "lon": base64.b64encode(bytes(buf)).decode(),
    }
    os.makedirs(os.path.dirname(os.path.abspath(a.out)) or ".", exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(payload, f, separators=(",", ":"))
    print(f"ephemeris.json  {n} days x {len(BODIES)} bodies  "
          f"{os.path.getsize(a.out)/1024:.0f} KB")


if __name__ == "__main__":
    main()
