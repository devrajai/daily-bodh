#!/usr/bin/env python3
"""Build tomorrow's post pack: panchang, twelve rashifal lines, ready-to-copy text.

Runs nightly in CI. Writes docs/data/daily-post.json, which the site reads and
which you can copy straight into Canva, Instagram or a WhatsApp channel.

Everything is computed from data the site already ships - the panchang and the
transit-derived readings. Nothing is written by hand and nothing is copied from
anyone else's content.

Output shape:
  {
    "for": "2026-11-01",             # the day the post is about
    "built": "2026-10-31T00:05:00",  # when it was generated
    "panchang": {...},               # the day's limbs and timings
    "rashifal": [ {sign, stars, line}, ... ],   # 12 entries
    "text": "..."                    # a ready-to-post block
  }
"""
import argparse, datetime as dt, json, os

SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
         "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

SIGN_HI = ["Mesh", "Vrishabh", "Mithun", "Kark", "Simha", "Kanya",
           "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen"]


def stars_txt(n):
    return "\u2605" * n + "\u2606" * (5 - n)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--panchang", required=True)
    ap.add_argument("--weekly", required=True)
    ap.add_argument("--festivals", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--for", dest="for_date", default=None,
                    help="date the post is for; defaults to tomorrow")
    a = ap.parse_args()

    day = a.for_date or (dt.date.today() + dt.timedelta(days=1)).isoformat()

    P = json.load(open(a.panchang))
    d = next((x for x in P["days"] if x["d"] == day), None)
    if not d:
        raise SystemExit(f"no panchang bundled for {day}")

    W = json.load(open(a.weekly))
    week = next((w for w in W["weeks"] if w["week"] <= day <= w["end"]), None)
    if not week:
        week = W["weeks"][0] if W["weeks"] else None

    try:
        F = json.load(open(a.festivals))
        fests = [f for f in F["festivals"] if f["d"] == day]
    except Exception:
        fests = []

    # ---- twelve lines, one per sign ----
    rashifal = []
    for i, sign in enumerate(SIGNS):
        entry = week["signs"][i] if week else None
        if not entry:
            continue
        c = entry["cats"]
        top = c.get("Overall", {})
        best = max(c.items(), key=lambda kv: kv[1]["stars"] if kv[0] != "Overall" else -1)
        worst = min(c.items(), key=lambda kv: kv[1]["stars"] if kv[0] != "Overall" else 99)
        line = (f"{best[0]} looks strongest ({stars_txt(best[1]['stars'])}) - {best[1]['why']}. "
                f"Take {worst[0].lower()} gently ({stars_txt(worst[1]['stars'])}).")
        rashifal.append({
            "sign": sign, "signHi": SIGN_HI[i],
            "stars": top.get("stars", 3),
            "line": line,
            "sadeSati": entry.get("sadeSati", False),
        })

    # ---- ready-to-post text ----
    t = []
    t.append(f"Daily Bodh - {day}")
    t.append("")
    t.append(f"{d.get('vara','')} | {d.get('paksha','')} {d.get('tithi','')}")
    t.append(f"Nakshatra: {d.get('nakshatra','')} till {d.get('nakEnd','')}")
    t.append(f"Sunrise {d.get('sunrise','')} | Sunset {d.get('sunset','')}")
    if d.get("moonrise"):
        t.append(f"Moonrise {d.get('moonrise','')} | Moonset {d.get('moonset','')}")
    t.append(f"Rahu Kaal: {d.get('rahu','')} (avoid new starts)")
    t.append(f"Abhijit: {d.get('abhijit','')}")
    if d.get("samvat_vikram"):
        t.append(f"Vikram Samvat {d['samvat_vikram']} | Shaka {d.get('samvat_shaka','')} | {d.get('samvatsara','')}")
    if fests:
        t.append("")
        t.append("Today: " + ", ".join(f["n"] for f in fests))
    t.append("")
    t.append("Rashifal:")
    for r in rashifal:
        t.append(f"  {r['signHi']}: {r['line']}")
    t.append("")
    t.append("Computed from the JPL ephemeris. Traditional reading, not a forecast.")
    t.append("devrajai.github.io/daily-bodh")

    out = {
        "for": day,
        "built": dt.datetime.now().replace(microsecond=0).isoformat(),
        "panchang": {k: d.get(k) for k in
                     ("vara", "paksha", "tithi", "nakshatra", "yoga", "karana",
                      "sunrise", "sunset", "moonrise", "moonset", "rahu", "abhijit",
                      "masa", "masa_purnimanta", "samvat_vikram", "samvat_shaka", "samvatsara")},
        "festivals": [f["n"] for f in fests],
        "rashifal": rashifal,
        "text": "\n".join(t),
    }

    os.makedirs(os.path.dirname(os.path.abspath(a.out)) or ".", exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))

    print(f"  post for {day}: {len(rashifal)} signs, {len(fests)} festivals")
    print(f"  wrote {os.path.getsize(a.out)/1024:.1f} KB")
    print("  --- first lines ---")
    for ln in out["text"].split("\n")[:8]:
        print("   ", ln)


if __name__ == "__main__":
    main()
