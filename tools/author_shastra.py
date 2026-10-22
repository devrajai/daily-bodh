#!/usr/bin/env python3
"""Author the Shastra library: the classical Jyotish texts, and Samudrika Shastra.

Sourcing rules:
  * The Sanskrit originals are public domain. Where a specific fact comes from a
    text it is named in the entry.
  * Modern translations and commentaries (Santhanam, Sagar, Ranjan and others) are
    still in copyright, so no translated text is reproduced here - only description.
  * Chapter numbers follow the vulgate edition with Bhattotpala's commentary; other
    editions count an extra chapter (67 becomes 68, 69 becomes 70).
Nothing here is invented; each entry says where it comes from.
"""
import argparse, json, os

_ap = argparse.ArgumentParser()
_ap.add_argument("--out", default="app/src/main/assets/content")
_args = _ap.parse_args()
OUT = _args.out
os.makedirs(OUT, exist_ok=True)


def item(id_, title, one, brief, bodh, tags, steps=None):
    d = {"id": id_, "text": title,
         "translations": {"en": brief, "hi": brief, "mr": ""},
         "summary_1line": one, "summary_2to3line": brief, "bodh_3to4line": bodh,
         "tags": tags}
    if steps:
        d["steps"] = steps
    return d


TEXTS = [
 ("s-bphs", "Brihat Parashara Hora Shastra (BPHS)",
  "Attributed to Sage Parashara - the foundational compendium",
  "The BPHS is the core text of what is now called Parashari Jyotish. It sets out the zodiac and its divisions, the grahas and their natures, the twelve bhavas, aspects, yogas, the Vimshottari dasha, the divisional charts (vargas) and longevity.",
  "Almost every modern Jyotish practice - including the dasha system and the varga charts this site computes - traces back to it. The attribution to Parashara is traditional; the text as we have it was compiled and expanded over centuries. Source: the Sanskrit text is public domain. Several early English translations exist; check each translator's date before reusing any of them.",
  ["shastra", "jyotish"]),
 ("s-jataka", "Brihat Jataka",
  "Varahamihira, 6th century - one of the oldest systematic treatises",
  "Varahamihira's Brihat Jataka is among the earliest surviving systematic works of Indian horoscopy, written in a compact verse style. It treats the signs, the grahas, the bhavas, and the results of planetary combinations.",
  "It is prized for being early and terse, and it sits alongside the same author's Brihat Samhita. Source: public domain in Sanskrit; Varahamihira is placed in the 6th century CE.",
  ["shastra", "jyotish"]),
 ("s-saravali", "Saravali",
  "Kalyanavarma - a comprehensive digest of earlier authorities",
  "The Saravali works through the grahas in each sign and each bhava, the yogas, and the results of combinations, gathering and comparing what earlier authorities had said.",
  "Useful precisely because it is a digest: where texts disagree, it often shows both readings. Source: public domain in Sanskrit.",
  ["shastra", "jyotish"]),
 ("s-phaladeepika", "Phaladeepika",
  "Mantreswara - a widely used predictive manual",
  "The Phaladeepika is a practical manual of predictive astrology: the grahas in the signs and bhavas, yogas, the dashas, and transits. It is one of the texts most often quoted in ordinary practice.",
  "Source: public domain in Sanskrit. Several English renderings exist from the early twentieth century; those are likely public domain, later ones are not.",
  ["shastra", "jyotish"]),
 ("s-parijata", "Jataka Parijata",
  "Vaidyanatha Dikshita - in three parts",
  "The Jataka Parijata is arranged in three parts: the fundamentals of the chart, the results of the grahas and bhavas, and the dashas and longevity.",
  "Its organisation makes it a convenient reference for looking a combination up. Source: public domain in Sanskrit.",
  ["shastra", "jyotish"]),
 ("s-jaimini", "Jaimini Sutras (Upadesa Sutras)",
  "A different system, not Parashari",
  "Attributed to Jaimini, these sutras set out a distinct method: the chara karakas (the grahas ranked by degree as signifiers of self, spouse, career and so on), argala and virodhargala, and the rashi dashas, rather than the Parashari bhava-and-dasha approach.",
  "Important because it is genuinely another system, not a variant - a chart read by Jaimini's rules can give a different answer from the same chart read by Parashara's. Source: public domain in Sanskrit.",
  ["shastra", "jyotish"]),
 ("s-horasara", "Hora Sara",
  "Prithuyasas, son of Varahamihira",
  "A concise horoscopy text by Prithuyasas, covering the grahas, the bhavas and their results.",
  "Source: public domain in Sanskrit; placed in the 6th-7th century, following Varahamihira.",
  ["shastra", "jyotish"]),
 ("s-uttarakalamrita", "Uttara Kalamrita",
  "Kalidasa (attribution debated) - strong on karakas and remedies",
  "The Uttara Kalamrita is best known for its tables of karakas - which graha signifies which matter, down to quite specific things - and for its chapters on remedial measures.",
  "The attribution to Kalidasa is traditional and disputed. Source: public domain in Sanskrit.",
  ["shastra", "jyotish"]),
 ("s-laghu", "Laghu Parashari (Jataka Chandrika)",
  "A short work on the dasha rules",
  "A brief text - a few dozen verses - that presents the rules for interpreting the Vimshottari dasha as given by Parashara, and is often studied before the BPHS itself because it is so compressed.",
  "Source: public domain in Sanskrit.",
  ["shastra", "jyotish"]),
 ("s-samhita", "Brihat Samhita",
  "Varahamihira, 6th century - an encyclopaedia, not a horoscopy manual",
  "The Brihat Samhita is not a text of natal astrology. It is an encyclopaedic work on omens, the transits of the grahas, weather and rain, agriculture, architecture, gems, and - in the chapters that matter here - the marks on the human body.",
  "Because it ranges so widely it is the single richest early source for samudrika shastra in Sanskrit. Source: public domain; 6th century CE.",
  ["shastra", "samudrika"]),
]

SAMUDRIKA = [
 ("s-samudrika-what", "What Samudrika Shastra is",
  "The Indian tradition of reading the body",
  "Samudrika Shastra is the branch of Jyotish that reads the human body - its build, complexion, voice, gait, the marks and lines on the skin, and the form of the hands and feet - and draws conclusions from them about a person's past and future.",
  "The name comes from Samudra, understood both as a name of Shiva and as a sage, and the body itself is called samudra because it is 'imprinted with lines'. Varahamihira's Brihat Samhita treats it in the chapters on the marks of men, of the great man, and of women (67, 69 and 70 in the vulgate numbering; 68, 70 and 71 in editions that count an extra chapter). Source: Brihat Samhita, public domain.",
  ["samudrika", "shastra"]),
 ("s-samudrika-what-read", "What the practitioner examines",
  "Twelve things, before any prediction",
  "Brihat Samhita opens its chapter on the marks of men by saying that a learned person should first examine twelve things: the body, the complexion, the voice, the strength, the joints, the gloss, the colour, the shape of the face, the height, the weight, the disposition, and the gait - and only then speak.",
  "That ordering is worth noticing. The text puts measurement and observation before interpretation, and later verses give actual proportions - the navel at the mid-point of the body, the circumference of the head equal to the waist, the nose the length of the forefinger. Source: Brihat Samhita, chapter on the marks of men.",
  ["samudrika", "method"]),
 ("s-samudrika-lines", "The lines of the hand",
  "The Male line, the Life line and the Fortune line",
  "Brihat Samhita describes the lines of the palm directly. The line running from the root of the thumb toward the root of the first finger is called the Male line and stands for the man himself; the line next to it stands for his partner. If the two join between the thumb and the first finger, the text reads long conjugal happiness; if they are separated, the couple stay apart.",
  "It names a line running from the foot of the little finger to that of the forefinger as the Life line, and a vertical line from the wrist toward the root of the second finger as the Fortune or wealth line. A cut or defect in a line is read as ill health or danger. It also holds that a person's left palm indicates the spouse's fortune and the right their own - and the reverse for a woman. Source: Brihat Samhita, chapter on the marks of men.",
  ["samudrika", "palmistry"]),
 ("s-samudrika-marks", "The planetary marks",
  "A circle for the Sun, a square for the Moon, a triangle for Mars",
  "Brihat Samhita gives a set of marks found on the body and the palm and assigns each to a graha: a circle to the Sun, a square to the Moon, a triangle to Mars, an arrow to Mercury, and further shapes - a quadrilateral, a pentagon, a bow, a flag - to the remaining grahas.",
  "The method that follows is genuinely astrological: find the limb the mark sits on, and the nakshatra and sign assigned to that limb, and you have the graha's position at the person's birth. The text also gives a way to work out the natal ascendant from body measurements - height and head circumference. Source: Brihat Samhita, chapter on the marks of men. This is a description of what the text says, not a claim that it works.",
  ["samudrika", "palmistry", "method"]),
 ("s-samudrika-three", "The three branches",
  "Palmistry, physiognomy, and the marks of women",
  "Later samudrika literature divides the subject into three branches: palmistry, the reading of the body and face, and the marks of women. It also sorts marks into three kinds - natural, seasonal or temporal, and casual - and holds that the lines are the writing of the creator on the body, which an expert can read.",
  "The Brihat Samhita gives a separate chapter to the marks of women, and the Garudapurana redacts the same material into its own chapters on men's and women's marks. Source: Brihat Samhita and the Garudapurana; both public domain. The Puranic version is an abbreviated redaction, so where the two differ the Samhita is the fuller text.",
  ["samudrika", "shastra"]),
 ("s-samudrika-caveat", "How to hold this",
  "Traditional reference, not measurement",
  "Samudrika Shastra is a traditional system of interpretation with no demonstrated predictive validity, and nothing here is offered as a reading of your own body. The Brihat Samhita's own verses run from careful proportion to claims about a man's fate from the number of hairs in a pore; the two are not the same kind of statement.",
  "The site presents this material because it is the authentic Indian source for palmistry and body reading, and because it is public domain and therefore quotable in description. It is not a diagnostic tool and not a basis for decisions. Source: Brihat Samhita; described, not reproduced.",
  ["samudrika", "caveat"]),
]

SOURCES = [
 ("s-sources", "Where to read the originals",
  "The Sanskrit is free; many translations are not",
  "The Sanskrit originals of all these texts are public domain. The trouble is translations: the well-known modern ones - Santhanam, Sagar, Ranjan and others - are still in copyright, so they cannot be reused. Older English renderings from the nineteenth and early twentieth centuries usually are free.",
  "The classical chapter numbering also varies between editions, which is why a citation can point at two different chapters: the vulgate edition with Bhattotpala's commentary (around 966 CE) is the one used here, and other editions count one extra chapter.",
  ["shastra", "sources"], [
   "archive.org - search the text name together with an early translator such as Suryanarain Rao or Krishna Rau for public-domain English renderings.",
   "sanskritdocuments.org and GRETIL (Gottingen) - free digital Sanskrit texts.",
   "Wikisource, Sanskrit and Hindi - proofread texts.",
   "indianculture.gov.in and the Digital Library of India - scanned Indian books.",
   "eGangotri and the Sarasvati Mahal Library - manuscripts.",
   "Before reusing any translation, check the translator's date and the licence. A public-domain original does not make its modern translation public domain.",
  ]),
]

shastra = [item(*t) for t in TEXTS] + [item(*t) for t in SAMUDRIKA] + [item(*t) for t in SOURCES]

p = os.path.join(OUT, "shastra.json")
json.dump({"packId": "shastra", "packName": "Shastra library", "version": 1, "ordering": "daily",
           "description": "The classical Jyotish texts and Samudrika Shastra: what each covers, where it comes from, and where to read the originals. Described, never reproduced.",
           "items": shastra},
          open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"shastra.json: {len(shastra)} items, {os.path.getsize(p)/1024:.1f} KB")
