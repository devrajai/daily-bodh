#!/usr/bin/env python3
"""Fill gaps in the festival calendar from the panchang we already compute.

kalagana's festival table has holes. Verified: Krishna Janmashtami is present
for 2027-2031 but missing entirely from 2026, even though the panchang for
2026-09-04 correctly reports "Bhadrapada Krishna Ashtami" prevailing at
sunrise - which is the published Janmashtami date for that year.

Rather than hard-code dates, this derives each missing entry from the panchang
by (masa, paksha, tithi) - the same rule the tradition uses - so the date is
computed, not typed in. If the panchang has no matching day, nothing is added
and the gap is reported.

Run after build_panchang.py, before publish_web_data.py.
"""
import argparse, json, os

# name as it appears in the calendar, and the panchang signature that identifies it
RULES = [
    ("Krishna Janmashtami", "Bhadrapada", "Krishna", "Ashtami"),
    ("Rama Navami",         "Chaitra",    "Shukla",  "Navami"),
    ("Hanuman Jayanti",     "Chaitra",    "Shukla",  "Purnima"),
    ("Guru Purnima",        "Ashadha",    "Shukla",  "Purnima"),
    ("Maha Shivaratri",     "Magha",      "Krishna", "Chaturdashi"),
    ("Akshaya Tritiya",     "Vaishakha",  "Shukla",  "Tritiya"),
    ("Vijayadashami",       "Ashwina",    "Shukla",  "Dashami"),
    ("Sharad Purnima",      "Ashwina",    "Shukla",  "Purnima"),
    ("Karva Chauth",        "Kartika",    "Krishna", "Chaturthi"),
    ("Dhanteras",           "Kartika",    "Krishna", "Trayodashi"),
]


def norm(s):
    return (s or "").strip().lower()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--festivals", required=True)
    ap.add_argument("--panchang", required=True)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    F = json.load(open(a.festivals))
    P = json.load(open(a.panchang))["days"]
    fests = F["festivals"]

    # index the panchang by signature
    by_sig = {}
    for d in P:
        masa, paksha, tithi = norm(d.get("masa")), norm(d.get("paksha")), norm(d.get("tithi"))
        # panchang tithi strings can repeat the name, e.g. "Krishna Krishna Ashtami"
        if tithi.startswith(paksha + " "):
            tithi = tithi[len(paksha) + 1:]
        by_sig.setdefault((masa, paksha, tithi), []).append(d["d"])

    years = sorted({f["d"][:4] for f in fests})
    added, checked = [], 0
    for name, masa, paksha, tithi in RULES:
        for y in years:
            checked += 1
            have = any(norm(f["n"]) == norm(name) and f["d"].startswith(y) for f in fests)
            if have:
                continue
            days = by_sig.get((norm(masa), norm(paksha), norm(tithi)), [])
            hit = [d for d in days if d.startswith(y)]
            if not hit:
                continue
            added.append({"d": hit[0], "n": name, "k": "derived from panchang"})
            print(f"  + {hit[0]}  {name}  (panchang: {masa} {paksha} {tithi})")

    if not added:
        print(f"  checked {checked} festival-years, no gaps found")
        return

    fests.extend(added)
    fests.sort(key=lambda x: (x["d"], x["n"]))
    F["festivals"] = fests
    print(f"  added {len(added)} entries, total now {len(fests)}")

    if a.dry_run:
        print("  dry run - nothing written")
        return
    with open(a.festivals, "w", encoding="utf-8") as f:
        json.dump(F, f, separators=(",", ":"))
    print(f"  wrote {os.path.getsize(a.festivals)/1e6:.2f} MB")


if __name__ == "__main__":
    main()
