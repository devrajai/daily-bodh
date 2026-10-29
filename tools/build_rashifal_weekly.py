#!/usr/bin/env python3
"""Weekly rashi readings, computed from real transits.

For each of the twelve Moon signs and each week in the requested range, this
finds which house every transiting planet occupies and scores five areas from
the classical house groupings. Nothing is hand-written and nothing is copied:
the output is a function of the JPL ephemeris we already ship, and every score
carries the reason that produced it.

House groupings (the tradition's own):
  Love     5, 7
  Finance  2, 11
  Career   6, 10
  Health   1, 6, 8
  Overall  every house

Weights are deliberately simple and stated here so the result can be argued
with: benefics help in the houses of gain and relationship, malefics hurt in the
houses of loss and friction. This is the tradition's reading of where the
planets are - not a forecast, and not personalised beyond the Moon sign.

Cross-checked: for Aries in November 2026 it puts Saturn in the 12th house and
flags Sade Sati, which matches a published reading for that month.
"""
import argparse, base64, datetime as dt, json, os

SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
         "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

CATEGORIES = {
    "Love": [5, 7],
    "Finance": [2, 11],
    "Career": [6, 10],
    "Health": [1, 6, 8],
}

# (planet, {houses it helps in: weight}, {houses it hurts in: weight})
RULES = {
    "Jupiter": ({2: 2, 5: 2, 7: 2, 9: 2, 11: 2}, {1: 1, 3: 1, 4: 1, 6: 1, 8: 1, 10: 1, 12: 1}),
    "Venus":   ({2: 1, 5: 1, 7: 1, 9: 1, 11: 1}, {1: 1, 6: 1, 8: 1, 12: 1}),
    "Mercury": ({2: 1, 5: 1, 7: 1, 9: 1, 11: 1}, {1: 1, 6: 1, 8: 1, 12: 1}),
    "Moon":    ({2: 1, 5: 1, 7: 1, 9: 1, 11: 1}, {1: 1, 6: 1, 8: 1, 12: 1}),
    "Saturn":  ({3: 1, 6: 1, 11: 1}, {1: 2, 2: 2, 5: 2, 7: 2, 8: 2, 12: 2}),
    "Mars":    ({3: 1, 6: 1, 11: 1}, {1: 1, 4: 1, 7: 1, 8: 1, 12: 1}),
    "Rahu":    ({3: 1, 6: 1, 11: 1}, {1: 1, 5: 1, 7: 1, 9: 1}),
    "Ketu":    ({3: 1, 6: 1, 11: 1}, {1: 1, 5: 1, 7: 1, 9: 1}),
}

ORD = {1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th",
       7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th"}


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


def stars(score, n_planets):
    """Map a raw weight sum onto 1-5 stars, relative to how much was in play."""
    if n_planets == 0:
        return 3
    per = score / max(n_planets, 1)
    if per >= 1.2:   return 5
    if per >= 0.5:   return 4
    if per >= -0.2:  return 3
    if per >= -0.9:  return 2
    return 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--eph", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--from", dest="dfrom", default=None)
    ap.add_argument("--to", dest="dto", default=None)
    a = ap.parse_args()

    E, lon, start = load(a.eph)
    days = E["days"]
    first = dt.date.fromisoformat(a.dfrom) if a.dfrom else start
    last = dt.date.fromisoformat(a.dto) if a.dto else start + dt.timedelta(days=days - 1)

    # weekly buckets starting on Monday
    weeks = []
    cur = first - dt.timedelta(days=first.weekday())
    while cur <= last:
        wend = min(cur + dt.timedelta(days=6), last)
        if wend >= first:
            weeks.append((cur, wend))
        cur += dt.timedelta(days=7)

    out = {"from": weeks[0][0].isoformat(), "to": weeks[-1][1].isoformat(),
           "note": ("Weekly readings computed from the bundled JPL DE421 ephemeris. "
                    "Each area is scored from the houses the transiting planets occupy, "
                    "counted from the Moon sign. Weights are fixed and stated in "
                    "tools/build_rashifal_weekly.py. This is the tradition's reading of "
                    "where the planets are, not a forecast."),
           "weeks": []}

    planets = ["Jupiter", "Saturn", "Mars", "Venus", "Mercury", "Moon", "Rahu", "Ketu"]

    for (w0, w1) in weeks:
        mid = w0 + dt.timedelta(days=(w1 - w0).days // 2)
        i = (mid - start).days
        if i < 0 or i >= days:
            continue
        psign = {}
        for p in planets:
            # Ketu is not stored: it is always exactly opposite Rahu.
            L = lon["Rahu"][i] + 180.0 if p == "Ketu" else lon[p][i]
            psign[p] = int(L % 360 // 30)

        entry = {"week": w0.isoformat(), "end": w1.isoformat(), "signs": []}
        for s_idx, s_name in enumerate(SIGNS):
            houses = {p: ((psign[p] - s_idx) % 12) + 1 for p in planets}

            cats = {}
            for cat, hlist in CATEGORIES.items():
                score, why = 0, []
                for p in planets:
                    h = houses[p]
                    if h not in hlist:
                        continue
                    good, bad = RULES[p]
                    if h in good:
                        score += good[h]
                        why.append((good[h], p, h, True))
                    elif h in bad:
                        score -= bad[h]
                        why.append((-bad[h], p, h, False))
                why.sort(key=lambda x: -abs(x[0]))
                top = why[0] if why else None
                cats[cat] = {
                    "stars": stars(score, len(why)),
                    "score": score,
                    "why": (f"{top[1]} transits your {ORD[top[2]]} house" if top else "No planet in these houses")
                }

            score, why = 0, []
            for p in planets:
                h = houses[p]
                good, bad = RULES[p]
                if h in good:
                    score += good[h]; why.append((good[h], p, h, True))
                elif h in bad:
                    score -= bad[h]; why.append((-bad[h], p, h, False))
            why.sort(key=lambda x: -abs(x[0]))
            top = why[0] if why else None
            cats["Overall"] = {
                "stars": stars(score, len(why)),
                "score": score,
                "why": (f"{top[1]} transits your {ORD[top[2]]} house" if top else "No strong transit")
            }

            entry["signs"].append({
                "sign": s_name,
                "cats": cats,
                "saturnHouse": houses["Saturn"],
                "sadeSati": houses["Saturn"] in (12, 1, 2)
            })
        out["weeks"].append(entry)

    os.makedirs(os.path.dirname(os.path.abspath(a.out)) or ".", exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(out, f, separators=(",", ":"))

    print(f"  weeks: {len(out['weeks'])}  {out['from']} .. {out['to']}")
    if out["weeks"]:
        w = out["weeks"][0]
        aries = [s for s in w["signs"] if s["sign"] == "Aries"][0]
        print(f"  sample {w['week']} Aries: " +
              " ".join(f"{k}={v['stars']}" for k, v in aries["cats"].items()))
        print(f"    saturn in house {aries['saturnHouse']}, sade sati {aries['sadeSati']}")
    print(f"  wrote {os.path.getsize(a.out)/1024:.0f} KB")


if __name__ == "__main__":
    main()
