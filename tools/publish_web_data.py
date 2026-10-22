#!/usr/bin/env python3
"""Copy the generated content into docs/data/ so the website can use it.

The site is a static GitHub Pages app: the same JSON the Android build bundles,
served straight to the browser. Nothing is fetched from a third party.
"""
import argparse, json, os, shutil

WEB = ["panchang.json", "festivals.json", "rashifal.json", "moonstars.json",
       "muhurat.json", "numerology.json", "palmistry.json", "lalkitab.json",
       "remedies.json", "aarti.json", "mantras.json", "puja.json"]


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
    print(f"  total {total/1e6:.2f} MB")


if __name__ == "__main__":
    main()
