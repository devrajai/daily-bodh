#!/usr/bin/env python3
"""Per-day sidereal longitudes for the grahas, for the website and the app.

One byte-pair per body per day (centidegrees, little-endian), computed at local
noon IST with kalagana (MIT) using the Lahiri ayanamsa. This is what lets the
browser draw a rashi chart, find Mangal dosha, check Kaal Sarp, follow the
Vimshottari dasha and watch Sade Sati - without a server or an ephemeris file.

Ketu is not stored: it is exactly Rahu + 180 by definition.
"""
import argparse, base64, datetime as dt, json, os
from kalagana.julian import datetime_to_jd
from kalagana.jyotish import graha_longitudes

BODIES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--from", dest="y0", type=int, default=1930)
    ap.add_argument("--to", dest="y1", type=int, default=2035)
    a = ap.parse_args()

    start = dt.date(a.y0, 1, 1)
    end = dt.date(a.y1, 12, 31)
    n = (end - start).days + 1
    buf = bytearray()
    d = start
    for _ in range(n):
        jd = datetime_to_jd(dt.datetime(d.year, d.month, d.day, 6, 30))  # 12:00 IST
        g = graha_longitudes(jd)
        for b in BODIES:
            c = int(round((g[b] % 360.0) * 100)) % 36000
            buf.append(c & 0xFF)
            buf.append((c >> 8) & 0xFF)
        d += dt.timedelta(days=1)

    payload = {
        "from": start.isoformat(),
        "days": n,
        "bodies": BODIES,
        "ayanamsa": "lahiri",
        "note": ("Sidereal longitude of each graha at 12:00 IST, in centidegrees, "
                 "two bytes little-endian per body in the order given by 'bodies'. "
                 "Ketu = Rahu + 180. Positions are for noon, so the Moon may be in the "
                 "neighbouring sign for a birth late or early in the day, and no ascendant "
                 "is implied - that needs an exact birth time and place."),
        "lon": base64.b64encode(bytes(buf)).decode(),
    }
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(payload, f, separators=(",", ":"))
    print(f"ephemeris.json  {n} days x {len(BODIES)} bodies  {os.path.getsize(a.out)/1024:.0f} KB")


if __name__ == "__main__":
    main()
