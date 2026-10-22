#!/usr/bin/env python3
"""Precompute the panchang, festival calendar and transit-based rashifal for Daily Bodh.

Uses kalagana (MIT, pure standard library, no network) so everything is computed
from first principles rather than copied from a table. Output is bundled into the
app, which stays offline.

    python3 tools/build_panchang.py --out app/src/main/assets/content \
        --city Delhi --from 2026 --to 2031 --rashifal-daily-to 2028
"""
import argparse, datetime as dt, json, os, re

from kalagana import city_lookup, daily_panchang, festivals_for_year, daily_rashifal, rashifal_for_all

RASHIS = [
    ("Mesh", "Aries", "Mesha"), ("Vrishabh", "Taurus", "Vrishabha"),
    ("Mithun", "Gemini", "Mithuna"), ("Kark", "Cancer", "Karka"),
    ("Simha", "Leo", "Simha"), ("Kanya", "Virgo", "Kanya"),
    ("Tula", "Libra", "Tula"), ("Vrishchik", "Scorpio", "Vrishchika"),
    ("Dhanu", "Sagittarius", "Dhanu"), ("Makar", "Capricorn", "Makara"),
    ("Kumbh", "Aquarius", "Kumbha"), ("Meen", "Pisces", "Meena"),
]

MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]

# names kalagana accepts (it normalises, but be explicit)
RASHI_ARG = {
    "Mesh": "Mesha", "Vrishabh": "Vrishabha", "Mithun": "Mithuna", "Kark": "Karka",
    "Simha": "Simha", "Kanya": "Kanya", "Tula": "Tula", "Vrishchik": "Vrishchika",
    "Dhanu": "Dhanu", "Makar": "Makara", "Kumbh": "Kumbha", "Meen": "Meena",
}


def hhmm(value):
    """Format a datetime or window end as HH:MM."""
    if value is None:
        return ""
    if isinstance(value, dt.datetime):
        return value.strftime("%H:%M")
    return str(value)


def window(w):
    if w is None:
        return ""
    return f"{hhmm(w.start)}-{hhmm(w.end)}"


def day_record(day):
    d = daily_panchang(day, LOC)
    tithi = d.tithi[0] if d.tithi else None
    nak = d.nakshatra[0] if getattr(d, "nakshatra", None) else None
    yoga = d.yoga[0] if getattr(d, "yoga", None) else None
    karana = d.karana[0] if getattr(d, "karana", None) else None
    m = d.muhurta or {}
    return {
        "d": day.isoformat(),
        "vara": d.vara_en,
        "paksha": d.paksha,
        "masa": d.masa_purnimanta,
        "tithi": tithi.name if tithi else "",
        "tithiEnd": hhmm(tithi.end) if tithi else "",
        "nakshatra": nak.name if nak else "",
        "nakEnd": hhmm(nak.end) if nak else "",
        "yoga": yoga.name if yoga else "",
        "karana": karana.name if karana else "",
        "sunrise": hhmm(d.sunrise),
        "sunset": hhmm(d.sunset),
        "rahu": window(m.get("rahu_kalam")),
        "yamaganda": window(m.get("yamaganda")),
        "gulika": window(m.get("gulika_kalam")),
        "abhijit": window(m.get("abhijit")),
        "brahma": window(m.get("brahma_muhurta")),
    }


def rashi_record(r):
    """Compact form of one Rashifal object."""
    return {
        "h": r.headline or "",
        "s": r.score if r.score is not None else 0,
        "b": r.band or "",
        "f": list(r.favourable or [])[:4],
        "c": list(r.challenging or [])[:4],
    }


def main():
    global LOC
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--city", default="Delhi")
    ap.add_argument("--from", dest="year_from", type=int, default=2026)
    ap.add_argument("--to", dest="year_to", type=int, default=2031)
    ap.add_argument("--rashifal-daily-to", type=int, default=2028)
    ap.add_argument("--sections", default="panchang,festivals,rashifal")
    ap.add_argument("--tag", default="")
    args = ap.parse_args()

    LOC = city_lookup(args.city)
    os.makedirs(args.out, exist_ok=True)
    want = {x.strip() for x in args.sections.split(",") if x.strip()}
    suffix = f"-{args.tag}" if args.tag else ""

    def emit(name, obj):
        path = os.path.join(args.out, name + suffix + ".json")
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(obj, fh, ensure_ascii=False, separators=(",", ":"))
        return path

    # ---------------- panchang ----------------
    days = []
    if "panchang" not in want:
        days = None
    if days is not None:
        for year in range(args.year_from, args.year_to + 1):
            d = dt.date(year, 1, 1)
            while d.year == year:
                days.append(day_record(d))
                d += dt.timedelta(days=1)
    panchang = {
        "location": LOC.name,
        "timezone": LOC.tz,
        "from": f"{args.year_from}-01-01",
        "to": f"{args.year_to}-12-31",
        "source": "Computed with kalagana (MIT) from Meeus-grade positional astronomy.",
        "note": "Times are local (IST). Tithi/nakshatra/yoga are the ones prevailing at sunrise.",
        "days": days,
    }
    if days is not None:
        p = emit("panchang", panchang)
        print(f"panchang{suffix}.json  {len(days):5d} days   {os.path.getsize(p)/1e6:5.2f} MB")

    # ---------------- festivals ----------------
    fest = []
    if "festivals" in want:
        for year in range(args.year_from, args.year_to + 1):
            for f in festivals_for_year(year, LOC, include_monthly=False):
                fest.append({"d": f.date.isoformat(), "n": f.name, "k": f.kind})
        fest.sort(key=lambda x: x["d"])
    fj = {
        "location": LOC.name,
        "from": args.year_from,
        "to": args.year_to,
        "note": "Derived from panchang rules by kalagana, not a hand-kept list.",
        "festivals": fest,
    }
    if fest:
        p = emit("festivals", fj)
        print(f"festivals{suffix}.json {len(fest):5d} dates  {os.path.getsize(p)/1e6:5.2f} MB")

    # ---------------- rashifal ----------------
    daily = {}
    if "rashifal" in want:
      for year in range(args.year_from, args.rashifal_daily_to + 1):
        d = dt.date(year, 1, 1)
        while d.year == year:
            row = []
            for key, _, arg in RASHIS:
                row.append(rashi_record(daily_rashifal(arg, d)))
            daily[d.isoformat()] = row
            d += dt.timedelta(days=1)

    monthly = {}
    if "rashifal" in want:
      for year in range(args.year_from, args.year_to + 1):
        for m in range(1, 13):
            row = []
            for key, _, arg in RASHIS:
                row.append(rashi_record(daily_rashifal(arg, dt.date(year, m, 15), period="monthly")))
            monthly[f"{year}-{m:02d}"] = row

    yearly = {}
    if "rashifal" in want:
      for year in range(args.year_from, args.year_to + 1):
        row = []
        for key, _, arg in RASHIS:
            row.append(rashi_record(daily_rashifal(arg, dt.date(year, 6, 15), period="yearly")))
        yearly[str(year)] = row

    rj = {
        "rashis": [{"key": k, "en": e} for k, e, _ in RASHIS],
        "dailyFrom": f"{args.year_from}-01-01",
        "dailyTo": f"{args.rashifal_daily_to}-12-31",
        "monthlyFrom": args.year_from,
        "monthlyTo": args.year_to,
        "yearlyFrom": args.year_from,
        "yearlyTo": args.year_to,
        "source": "Transit (gochar) readings computed by kalagana (MIT).",
        "disclaimer": "Jyotish is a traditional system of interpretation, not a prediction of events. "
                      "These are the classical transit readings for each Moon sign, offered as tradition.",
        "daily": daily,
        "monthly": monthly,
        "yearly": yearly,
    }
    if "rashifal" in want:
        p = emit("rashifal", rj)
        print(f"rashifal{suffix}.json  {len(daily):5d} days x12  {os.path.getsize(p)/1e6:5.2f} MB")


if __name__ == "__main__":
    main()
