#!/usr/bin/env python3
"""Author the numerology, palmistry and Lal Kitab reference packs.

Sourcing rules for this file:
  * Numerology meanings follow Cheiro (Count Louis Hamon, 1866-1936), whose
    Book of Numbers is public domain in India (author died 1936).
  * Palmistry entries follow Cheiro's Language of the Hand (1894/1897) and
    William G. Benham's The Laws of Scientific Hand Reading (1900), both public domain.
  * Lal Kitab is described, NOT reproduced: Pt. Roop Chand Joshi died in 1982, so
    the five volumes (1939-1952) are still in copyright in India.
Nothing here is generated or invented; every entry says where it comes from.
"""
import argparse, json, os

_ap = argparse.ArgumentParser()
_ap.add_argument("--out", default="app/src/main/assets/content")
_args = _ap.parse_args()
OUT = _args.out
os.makedirs(OUT, exist_ok=True)


def item(id_, title, one, brief, bodh, tags, steps=None, samagri=None):
    d = {"id": id_, "text": title,
         "translations": {"en": brief, "hi": brief, "mr": ""},
         "summary_1line": one, "summary_2to3line": brief, "bodh_3to4line": bodh,
         "tags": tags}
    if steps: d["steps"] = steps
    if samagri: d["samagri"] = samagri
    return d

# ------------------------------------------------------------------ NUMEROLOGY
NUM = [
 (1, "Sun", "Leadership, originality, ambition. A number of self-direction.",
  "Cheiro gives 1 to the Sun: the person is meant to lead rather than follow, is original and ambitious, but must avoid arrogance and domineering.",
  "Days: Sunday and Monday. Colours: gold, orange, yellow. Cheiro pairs 1 with 4, 2 with 7, and 3, 6 and 9 with each other as friendly numbers."),
 (2, "Moon", "Sensitivity, imagination, changeability. A number of feeling.",
  "Cheiro gives 2 to the Moon: imaginative, gentle and adaptable, but easily affected by moods and by the opinions of others.",
  "Days: Monday and Friday. Colours: cream, pale green, white. Cheiro regards 2 and 7 as closely related."),
 (3, "Jupiter", "Discipline, planning, authority. A number of order.",
  "Cheiro gives 3 to Jupiter: the planner and the administrator, strong on discipline and system, sometimes rigid and inclined to instruct others.",
  "Days: Thursday, Tuesday, Friday. Colours: mauve, violet, purple. Cheiro groups 3 with 6 and 9 as mutually friendly."),
 (4, "Uranus (Sun)", "Unconventional, sudden change, restless energy.",
  "Cheiro, writing in a period when Uranus had just entered popular use, assigns 4 to it: the number of the unconventional, of sudden reversals and of things done differently.",
  "Days: Saturday and Sunday. Colours: grey and electric blue. Cheiro pairs 4 with 1 and 8."),
 (5, "Mercury", "Quickness, versatility, travel and commerce.",
  "Cheiro gives 5 to Mercury: fast, adaptable, good with words and trade, fond of travel and change, but easily scattered.",
  "Days: Wednesday and Friday. Colours: light grey, white, silver. 5 is the most changeable of Cheiro's numbers."),
 (6, "Venus", "Love, beauty, comfort, and responsibility for others.",
  "Cheiro gives 6 to Venus: affection, attractiveness and domestic comfort, but also duty towards family and a tendency to over-attach.",
  "Days: Friday, Tuesday, Thursday. Colours: pink, light blue, turquoise. Cheiro groups 6 with 3 and 9."),
 (7, "Neptune (Moon)", "Reflection, philosophy, solitude.",
  "Cheiro assigns 7 to Neptune, linked with the Moon: the dreamer and the thinker, drawn to the unseen, often happiest alone.",
  "Days: Monday and Sunday. Colours: sea green, pale yellow, white. Cheiro pairs 7 with 2."),
 (8, "Saturn", "Discipline, material weight, delay then reward.",
  "Cheiro gives 8 to Saturn: the hardest of the numbers in his reading, promising solid results but only after delay, discipline and often loss first.",
  "Days: Saturday, Friday, Monday. Colours: black, dark blue, grey. Cheiro warns 8 pairs badly with 4."),
 (9, "Mars", "Force, courage, conflict, and achievement through struggle.",
  "Cheiro gives 9 to Mars: energy and courage, capacity for hard achievement, but a tendency to conflict and to act before thinking.",
  "Days: Tuesday, Friday, Monday. Colours: crimson, red, rose. Cheiro groups 9 with 3 and 6."),
]

numerology = [item(
 "num-system", "How these numbers are worked out",
 "The arithmetic behind numerology, and the three numbers that matter",
 "Your psychic number (mulank) is the day of the month you were born, reduced to a single digit. Your destiny number (bhagyank) is the full date, reduced the same way. Your name number is the sum of the letters of your name, reduced.",
 "Reduction means adding the digits until one digit remains: 29 becomes 2+9 = 11, and 11 becomes 1+1 = 2. Cheiro used a fixed letter table (A=1, B=2, ... I=1, J=1, K=2 ...). Nothing here is a judgement about you - it is arithmetic on a date and a name, and the interpretation on top of it is Cheiro's, not a fact.",
 ["numerology", "how-to"])]

for n, planet, one, brief, bodh in NUM:
    numerology.append(item(f"num-{n}", f"Number {n} \u2014 {planet}", one, brief,
                           bodh + " Source: Cheiro, Book of Numbers.", ["numerology", planet.lower()]))

# ------------------------------------------------------------------ PALMISTRY
PALM = [
 ("palm-lines-intro", "The seven lines of the hand",
  "How the classical texts organise the hand",
  "Cheiro and Benham read the hand mainly by its lines and mounts. The four principal lines are the Line of Life, the Line of Head, the Line of Heart and the Line of Fate; the Line of Sun, the Line of Health (Mercury) and the Girdle of Venus are read alongside them.",
  "Read this section as a reference to what the classical texts say about each feature - not as a reading of your own hand. Cheiro's Language of the Hand (1894) and Benham's Laws of Scientific Hand Reading (1900) are both out of copyright, and the descriptions here follow them. Palmistry is a traditional system with no demonstrated predictive basis; it is included because you asked for it, not because it works.",
  ["palmistry", "reference"]),
 ("palm-life", "Line of Life",
  "Encircles the base of the thumb, from between thumb and index finger toward the wrist",
  "Traditionally read for vitality, constitution and the general course of life - not, as is often said, for its length. Cheiro treats a long, clear, unbroken line as vitality; a chained or broken line as periods of low health; branches rising toward the Mount of Jupiter as ambition.",
  "Cheiro is explicit that the Line of Life does not measure how long you will live. That claim is a later popular addition. Source: Cheiro, Language of the Hand.",
  ["palmistry", "line"]),
 ("palm-head", "Line of Head",
  "Runs across the palm, usually starting near the thumb side and crossing toward the Mount of Moon or Mercury",
  "Read for the quality and direction of thought. A straight line to the Mount of Mercury is read as practical, business-like thinking; a line sloping to the Mount of the Moon as imagination. A line joined to the Line of Life at the start is read as caution or a strong early attachment to family.",
  "Source: Cheiro, Language of the Hand; Benham, Laws of Scientific Hand Reading.",
  ["palmistry", "line"]),
 ("palm-heart", "Line of Heart",
  "Runs across the upper palm, from the Mount of Mercury side toward the Mount of Jupiter",
  "Read for the affections and the emotional life. Ending under the index finger (Jupiter) is read as idealism in love; ending under the middle finger (Saturn) as a more physical or self-regarding attachment. A chained line is read as changing affections.",
  "Source: Cheiro, Language of the Hand.",
  ["palmistry", "line"]),
 ("palm-fate", "Line of Fate (Destiny)",
  "Rises from the wrist or the centre of the palm toward the Mount of Saturn",
  "Read for the sense of direction and outward career. A strong line rising from the wrist is read as a clear path from early on; a line that begins midway as a career that forms later; a broken line as changes of direction.",
  "Cheiro's treatment is the source. Benham warns the Line of Fate should never be read alone.",
  ["palmistry", "line"]),
 ("palm-sun", "Line of Sun (Apollo)",
  "A short line rising toward the ring finger",
  "Read for recognition, reputation and the arts. Marked clearly, it is read as public success or artistic gift; absent or faint, the tradition reads it as a life without public notice rather than a life without worth.",
  "Source: Cheiro, Language of the Hand.",
  ["palmistry", "line"]),
 ("palm-health", "Line of Health (Mercury / Hepatica)",
  "Runs from the base of the little finger down across the palm",
  "Traditionally read for the state of the digestion and the nerves. Cheiro reads a clear line as good health and a chained one as digestive trouble, and warns strongly against reading it as illness on its own.",
  "Source: Cheiro, Language of the Hand. The tradition itself cautions against using this line to diagnose anything.",
  ["palmistry", "line"]),
 ("palm-mounts", "The mounts",
  "The raised pads of the palm, named for the planets",
  "Under each finger and around the palm sit the mounts: Venus at the base of the thumb, Jupiter under the index, Saturn under the middle finger, Apollo (Sun) under the ring finger, Mercury under the little finger, the Moon on the outer lower palm, and Mars between thumb and palm and below Mercury.",
  "A well-developed mount is read as strength in that planet's qualities; a flat or over-developed one as excess or lack. Source: Cheiro and Benham.",
  ["palmistry", "mounts"]),
 ("palm-shapes", "The seven hand shapes",
  "D'Arpentigny's classification, used by Cheiro",
  "Cheiro follows D'Arpentigny in sorting hands into seven types by palm and finger proportion: elementary, square, spatulate, conic, psychic, philosophic and mixed. Each type is read as a temperament rather than a fate.",
  "Source: Cheiro, Language of the Hand, following D'Arpentigny. Most hands are mixed, and Cheiro says so.",
  ["palmistry", "shapes"]),
 ("palm-caveat", "What palmistry can and cannot be",
  "The honest position on reading hands",
  "There is no algorithm that reads a hand. A palmistry reading requires an actual hand, a reader, and judgement; nothing here claims otherwise. This section is a reference to what the classical texts say, so that you can read about the tradition - not a service that tells you your future from a tap.",
  "Palmistry has no demonstrated predictive validity and is not a diagnostic tool. It is included as traditional reference material. If you want a reading of your own hand, the honest route is a book and your own hand, or a practitioner you trust - not an app.",
  ["palmistry", "caveat"]),
]

palmistry = [item(i, t, o, b, bo, tg) for i, t, o, b, bo, tg in PALM]

# ------------------------------------------------------------------ LAL KITAB
lalkitab = [
 item("lk-what", "What Lal Kitab is",
  "Five volumes by Pt. Roop Chand Joshi, published 1939-1952",
  "Lal Kitab ('the red book') is a set of five volumes on astrology and samudrik shastra, written in Urdu and later in Hindi. They were authored by Pt. Roop Chand Joshi (1898-1982) of Pharwala, Jalandhar, between 1939 and 1952.",
  "The five volumes are Lal Kitab Ke Farman (1939), Lal Kitab Ke Armaan (1940), the Gutka (1941), the revised Farman (1942) and the large 1952 edition. A copy of the 1939 first edition is held in the Lahore Museum. Source: the published volumes and standard reference summaries of them.",
  ["lalkitab", "reference"]),
 item("lk-not-reproduced", "Why the text itself is not in this app",
  "Copyright, and a problem with the editions in circulation",
  "Pt. Roop Chand Joshi died in 1982. Under Indian copyright that runs for sixty years after an author's death, the five volumes remain protected, so this app does not reproduce them. What follows is an attributed description of the system, not the text.",
  "There is a second reason. Practitioners of Lal Kitab have said for years that most editions sold in the market are corrupt - that translators have added and dropped material, and that no printed translation is a faithful copy of the Urdu originals. If you want Lal Kitab, the originals or a careful transliteration of them are the only reliable source. Treat anything else, including this summary, as second-hand.",
  ["lalkitab", "caveat"]),
 item("lk-framework", "How the system is organised",
  "Fixed houses, planets in them, and 'farmaan' edicts",
  "Lal Kitab keeps the planets and the houses of ordinary Vedic astrology but fixes several planets to particular houses - the 'pakka ghar', or permanent home, of each planet - and reads the chart largely from which planets sit in which houses, rather than from a full predictive apparatus. The volumes are written as farmaan: short edicts, often in verse, each stating a combination and what follows from it.",
  "The 1939 volume is in large part about palmistry and samudrik shastra - nails, fingers, palm shape, the forehead, the lines of the hand - and only the later volumes develop the astrology. That is why Lal Kitab is often paired with palmistry. This is an outline of the structure only; the detail belongs to the volumes themselves.",
  ["lalkitab", "framework"]),
 item("lk-remedies", "The remedies, and what they are",
  "Daan, plants, metals and small household actions",
  "Lal Kitab is best known for its upaya (remedies): giving things away (daan), keeping or planting particular plants, wearing or discarding particular metals, and small household actions performed in a fixed way. The remedies are characteristically cheap and use ordinary things.",
  "These are faith practices within a specific tradition, not treatment. They do not replace medicine, legal or financial advice, and the tradition itself ties them to willpower and to actually changing something in your conduct. This app will not generate remedies for you, because doing so would mean inventing them.",
  ["lalkitab", "remedies", "caveat"]),
]

def write(name, pack_id, pack_name, desc, items):
    p = os.path.join(OUT, name)
    json.dump({"packId": pack_id, "packName": pack_name, "description": desc,
               "version": 1, "ordering": "daily", "items": items},
              open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{name}: {len(items)} items, {os.path.getsize(p)/1024:.1f} KB")

write("numerology.json", "numerology", "Numerology",
      "How the numbers are worked out and what each means, following Cheiro (d. 1936), public domain in India.", numerology)
write("palmistry.json", "palmistry", "Palmistry (reference)",
      "What the classical texts say about each line, mount and hand shape - Cheiro (1894) and Benham (1900), both public domain. A reference, not a reading of your hand.", palmistry)
write("lalkitab.json", "lalkitab", "Lal Kitab (overview)",
      "An attributed description of the Lal Kitab system. The five volumes (1939-1952) are still in copyright and are not reproduced.", lalkitab)
