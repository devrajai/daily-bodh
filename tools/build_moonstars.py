#!/usr/bin/env python3
"""Moon-star table: the nakshatra index at local noon (IST) for each date.

Used only to *approximate* a birth star when the exact one is not known, so the
table stores one byte per day. Computed with kalagana (MIT).
"""
import argparse, base64, datetime as dt, json, os
from kalagana.limbs import nakshatra_number
from kalagana.julian import datetime_to_jd

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--from", dest="y0", type=int, default=1930)
    ap.add_argument("--to", dest="y1", type=int, default=2035)
    a = ap.parse_args()

    start = dt.date(a.y0, 1, 1)
    end = dt.date(a.y1, 12, 31)
    n = (end - start).days + 1
    raw = bytearray()
    d = start
    for _ in range(n):
        # 12:00 IST = 06:30 UT
        jd = datetime_to_jd(dt.datetime(d.year, d.month, d.day, 6, 30))
        raw.append(nakshatra_number(jd) % 27)
        d += dt.timedelta(days=1)

    payload = {
        "from": start.isoformat(),
        "days": n,
        "note": ("Nakshatra index (0=Ashwini .. 26=Revati) at 12:00 IST. The Moon changes "
                 "nakshatra roughly once a day, so this is an approximation for a birth star, "
                 "not a substitute for the exact one from a birth chart."),
        "stars": base64.b64encode(bytes(raw)).decode(),
    }
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(payload, f, separators=(",", ":"))
    print(f"moonstars.json  {n} days ({a.y0}-{a.y1})  {os.path.getsize(a.out)/1024:.0f} KB")

if __name__ == "__main__":
    main()
