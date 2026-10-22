#!/usr/bin/env python3
"""Copy the generated content into docs/data/ so the website can use it.

The site is a static GitHub Pages app: the same JSON the Android build bundles,
served straight to the browser. Nothing is fetched from a third party.
"""
import argparse, json, os, shutil

WEB = ["panchang.json", "festivals.json", "moonstars.json",
       "ephemeris.json", "muhurat.json", "numerology.json", "palmistry.json",
       "lalkitab.json", "shastra.json", "jyotish.json", "places.json",
       "remedies.json", "aarti.json",
       "mantras.json", "puja.json"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default="app/src/main/assets/content")
    ap.add_argument("--dst", default="docs/data")
    a = ap.parse_args()
    os.makedirs(a.dst, exist_ok=True)
    total = 0
    for name in WEB:
        s = os.path.join(a.src, name)
        if not os.path.exists(s):
            print(f"  skip {name} (not generated)")
            continue
        d = os.path.join(a.dst, name)
        shutil.copyfile(s, d)
        n = os.path.getsize(d)
        total += n
        print(f"  {name:22s} {n/1024:8.1f} KB")

    # Split rashifal.json
    rashifal_src = os.path.join(a.src, "rashifal.json")
    if os.path.exists(rashifal_src):
        with open(rashifal_src, 'r') as f:
            rdata = json.load(f)

        info = {k: v for k, v in rdata.items() if k not in ('daily', 'monthly', 'yearly')}
        d_info = os.path.join(a.dst, "rashifal-info.json")
        with open(d_info, 'w') as f:
            json.dump(info, f, separators=(',', ':'))
        total += os.path.getsize(d_info)
        print(f"  rashifal-info.json     {os.path.getsize(d_info)/1024:8.1f} KB")

        # monthly and yearly
        monthly_data = {"monthly": rdata.get("monthly", {})}
        d_monthly = os.path.join(a.dst, "rashifal-monthly.json")
        with open(d_monthly, 'w') as f:
            json.dump(monthly_data, f, separators=(',', ':'))
        total += os.path.getsize(d_monthly)
        print(f"  rashifal-monthly.json  {os.path.getsize(d_monthly)/1024:8.1f} KB")

        yearly_data = {"yearly": rdata.get("yearly", {})}
        d_yearly = os.path.join(a.dst, "rashifal-yearly.json")
        with open(d_yearly, 'w') as f:
            json.dump(yearly_data, f, separators=(',', ':'))
        total += os.path.getsize(d_yearly)
        print(f"  rashifal-yearly.json   {os.path.getsize(d_yearly)/1024:8.1f} KB")

        # daily split by year
        daily = rdata.get("daily", {})
        daily_by_year = {}
        for d, vals in daily.items():
            year = d[:4]
            if year not in daily_by_year:
                daily_by_year[year] = {}
            daily_by_year[year][d] = vals

        for year, year_daily in daily_by_year.items():
            y_data = {"daily": year_daily}
            d_year = os.path.join(a.dst, f"rashifal-daily-{year}.json")
            with open(d_year, 'w') as f:
                json.dump(y_data, f, separators=(',', ':'))
            total += os.path.getsize(d_year)
            print(f"  rashifal-daily-{year}.json {os.path.getsize(d_year)/1024:8.1f} KB")

    # Write metadata
    import datetime
    d_meta = os.path.join(a.dst, "metadata.json")
    with open(d_meta, 'w') as f:
        json.dump({"generated": datetime.datetime.now(datetime.timezone.utc).isoformat()}, f)
    total += os.path.getsize(d_meta)
    print(f"  metadata.json          {os.path.getsize(d_meta)/1024:8.1f} KB")

    print(f"  total {total/1e6:.2f} MB")


if __name__ == "__main__":
    main()
