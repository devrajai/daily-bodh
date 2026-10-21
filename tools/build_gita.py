#!/usr/bin/env python3
"""Build the full Bhagavad Gita pack (18 chapters, 701 shlokas) for Daily Bodh.

Source data: https://github.com/gita/gita  (The Unlicense / public domain)
    verse.json        Sanskrit (Devanagari) + IAST transliteration
    translation.json  translations keyed by verse id, author and language
    chapters.json     chapter names

English translation: Swami Sivananda (d. 1963)  - public domain in India
Hindi translation:   Swami Ramsukhdas (d. 2005) - NOT public domain; personal use only

Usage:
    python3 tools/build_gita.py --src <dir with the three json files> --out <path to gita.json>
"""
import argparse, collections, json, os, re

EN_AUTHOR = 16   # Swami Sivananda
HI_AUTHOR = 1    # Swami Ramsukhdas

VERSE_MARK = re.compile(r"[।\|]{0,2}\s*\d+\.\d+\s*[।\|]{0,2}")
NOTE_REF = re.compile(r"\((?:टिप्पणी|देखें)[^)]*\)")
WS = re.compile(r"[ \t]+")


def clean_block(s):
    if not s:
        return ""
    s = s.replace("\r", "")
    s = re.sub(r"\n\s*\n+", "\n", s)
    lines = [WS.sub(" ", ln).strip() for ln in s.split("\n")]
    return "\n".join(ln for ln in lines if ln).strip()


def clean_translation(s):
    if not s:
        return ""
    s = NOTE_REF.sub("", s)
    s = VERSE_MARK.sub(" ", s)
    return re.sub(r"\s+", " ", s).strip()


def first_sentence(s, limit=140):
    s = s.strip()
    if not s:
        return ""
    parts = re.split(r"(?<=[.!?])\s+", s)
    out = parts[0] if parts else s
    if len(out) > limit:
        cut = out[:limit]
        if " " in cut:
            cut = cut[:cut.rfind(" ")]
        out = cut.rstrip(",;:") + "…"
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    def load(name):
        with open(os.path.join(args.src, name), encoding="utf-8") as f:
            return json.load(f)

    verses = load("verse.json")
    translations = load("translation.json")
    chapters = {c["chapter_number"]: c for c in load("chapters.json")}

    by_verse = collections.defaultdict(dict)
    for t in translations:
        if t["author_id"] == EN_AUTHOR and t["lang"] == "english":
            by_verse[t["verse_id"]]["en"] = t["description"]
        elif t["author_id"] == HI_AUTHOR and t["lang"] == "hindi":
            by_verse[t["verse_id"]]["hi"] = t["description"]

    items = []
    for v in verses:
        ch, vn = v["chapter_number"], v["verse_number"]
        tr = by_verse.get(v["id"], {})
        en = clean_translation(tr.get("en", ""))
        hi = clean_translation(tr.get("hi", ""))
        meta = chapters.get(ch, {})
        cname = meta.get("name_translation") or meta.get("name") or ""
        sanskrit = VERSE_MARK.sub(" ", clean_block(v.get("text", "")))
        sanskrit = re.sub(r"\s*\n\s*", "\n", sanskrit).strip()
        items.append({
            "id": f"gita-{ch}-{vn}",
            "chapter": ch,
            "verse": vn,
            "chapter_name": cname,
            "sanskrit": sanskrit,
            "transliteration": clean_block(v.get("transliteration", "")),
            "translations": {"en": en, "hi": hi, "mr": ""},
            "summary_1line": first_sentence(en),
            "summary_2to3line": en,
            "bodh_3to4line": en,
            "tags": [],
        })

    items.sort(key=lambda x: (x["chapter"], x["verse"]))
    pack = {
        "packId": "gita",
        "packName": "Bhagavad Gita",
        "description": "All 18 chapters and 701 shlokas, in order, one per day.",
        "version": 2,
        "ordering": "sequential",
        "items": items,
    }
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(pack, f, ensure_ascii=False, indent=1)
    print(f"wrote {args.out}: {len(items)} shlokas across {len({i['chapter'] for i in items})} chapters")


if __name__ == "__main__":
    main()
