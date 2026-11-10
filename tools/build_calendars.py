#!/usr/bin/env python3
"""Generate the subscribable .ics calendars from docs/data/festivals.json.

Standalone script rather than inline in the workflow, for the reason recorded in
tools/patch_head.py: content at column 1 inside a YAML block scalar silently
breaks the workflow file.
"""

import datetime
import json
import pathlib
import re
import sys


def fold(line: str) -> str:
    """RFC 5545: fold at 75 octets; continuation lines start with a space."""
    if len(line.encode("utf-8")) <= 75:
        return line
    out, cur = [], ""
    for ch in line:
        if len((cur + ch).encode("utf-8")) > 74:
            out.append(cur)
            cur = " " + ch
        else:
            cur += ch
    out.append(cur)
    return "\r\n".join(out)


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def esc(s: str) -> str:
    return (s.replace("\\", "\\\\").replace(";", r"\;")
             .replace(",", r"\,").replace("\n", r"\n"))


def build(items, calname: str, out: pathlib.Path, stamp: str):
    lines = [
        "BEGIN:VCALENDAR", "VERSION:2.0",
        "PRODID:-//Daily Bodh//Panchang Calendar//EN",
        "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
        "X-WR-CALNAME:" + calname,
        "X-WR-CALDESC:Hindu festival dates bundled by Daily Bodh. Free, no account.",
        "X-WR-TIMEZONE:Asia/Kolkata",
    ]
    seen = set()
    for e in items:
        uid = e["d"] + "-" + slug(e["n"]) + "@dailybodh"
        if uid in seen:
            continue
        seen.add(uid)
        try:
            dt = datetime.date.fromisoformat(e["d"])
        except ValueError:
            continue
        nxt = (dt + datetime.timedelta(days=1)).strftime("%Y%m%d")
        cat = "Festival" if e.get("k") == "festival" else "Observance"
        lines += [
            "BEGIN:VEVENT", "UID:" + uid, "DTSTAMP:" + stamp,
            "DTSTART;VALUE=DATE:" + dt.strftime("%Y%m%d"),
            "DTEND;VALUE=DATE:" + nxt,
            "SUMMARY:" + esc(e["n"]),
            "CATEGORIES:" + cat,
            "TRANSP:TRANSPARENT", "END:VEVENT",
        ]
    lines.append("END:VCALENDAR")
    body = "\r\n".join(fold(x) for x in lines) + "\r\n"
    out.write_text(body, encoding="utf-8", newline="")
    return len(seen), len(body)


def main() -> int:
    src = pathlib.Path("docs/data/festivals.json")
    if not src.exists():
        print("docs/data/festivals.json not found", file=sys.stderr)
        return 1

    data = json.loads(src.read_text(encoding="utf-8"))
    events = data["festivals"]
    print(f"source: {len(events)} entries {data['from']}-{data['to']} at {data['location']}")

    out_dir = pathlib.Path("docs/calendar")
    out_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.datetime.now(datetime.UTC).strftime("%Y%m%dT%H%M%SZ")

    n1, b1 = build(events, "Hindu Festivals (Daily Bodh)", out_dir / "festivals.ics", stamp)
    print(f"  festivals.ics: {n1} events, {b1} bytes")

    only = [e for e in events if e.get("k") == "festival"]
    n2, b2 = build(only, "Hindu Festivals only (Daily Bodh)", out_dir / "festivals-only.ics", stamp)
    print(f"  festivals-only.ics: {n2} events, {b2} bytes")

    for name in ("festivals.ics", "festivals-only.ics"):
        b = (out_dir / name).read_bytes()
        assert b.startswith(b"BEGIN:VCALENDAR"), name + ": bad header"
        assert b.rstrip().endswith(b"END:VCALENDAR"), name + ": bad footer"
        assert b"\r\n" in b, name + ": no CRLF"
        long_lines = [l for l in b.split(b"\r\n") if len(l) > 75]
        assert not long_lines, f"{name}: {len(long_lines)} lines over 75 octets"
        print(f"  {name}: verified")
    return 0


if __name__ == "__main__":
    sys.exit(main())
