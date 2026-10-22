#!/usr/bin/env python3
"""Author the Jyotish reference pack - the classical classification tables.

This follows the syllabus of a standard beginners' course in phalit jyotish:
the classifications of the rashis, the karakatvas of the grahas, the twelve
bhavas, the friendships between planets, the aspects, the strengths, and the
principal yogas. All of it is the common classical material found in the
Parashari texts named in the Shastra library - no translated text is copied.
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


# ---------------------------------------------------------------- the rashis
RASHIS = [
 ("j-rashi-class", "Classifying the twelve rashis",
  "Seven ways the texts sort the signs",
  "A rashi is not just a slice of the zodiac. The texts classify each one by element (fire, earth, air, water), by movement (chara movable, sthira fixed, dwisvabhava dual), by gender, by caste (varna), by temperament (krura harsh or saumya gentle), by body (dwi-pada, chatus-pada, bahu-pada or keeta), by how it rises (shirshodaya head-first, prishtodaya hind-first, ubhayodaya both), and by which of sattva, rajas and tamas predominates.",
  "These classifications are the vocabulary of prediction: a planet in a fixed sign behaves with more inertia than the same planet in a movable one, and a planet in a water sign carries a different flavour from the same planet in fire. Nothing here is interpretation yet - it is the table you interpret with.",
  ["jyotish", "rashi"],
  ["Movable (chara): Aries, Cancer, Libra, Capricorn.",
   "Fixed (sthira): Taurus, Leo, Scorpio, Aquarius.",
   "Dual (dwisvabhava): Gemini, Virgo, Sagittarius, Pisces.",
   "Fire: Aries, Leo, Sagittarius. Earth: Taurus, Virgo, Capricorn. Air: Gemini, Libra, Aquarius. Water: Cancer, Scorpio, Pisces.",
   "Male signs: Aries, Gemini, Leo, Libra, Sagittarius, Aquarius. Female: the other six.",
   "Harsh (krura): Aries, Gemini, Leo, Libra, Sagittarius, Aquarius - the odd signs. Gentle (saumya): the even signs.",
   "Human (manushya): Gemini, Virgo, Libra, Aquarius and the first half of Sagittarius. Animal: Aries, Taurus, Leo and the second half of Sagittarius. Keeta (insect): Cancer, Scorpio, Pisces. Quadruped (chatuspada): Aries, Taurus, Leo, the second half of Sagittarius and the first half of Capricorn."]),
 ("j-rashi-lords", "Rashis and their lords",
  "Which graha rules which sign",
  "Aries and Scorpio are Mars's; Taurus and Libra Venus's; Gemini and Virgo Mercury's; Cancer the Moon's; Leo the Sun's; Sagittarius and Pisces Jupiter's; Capricorn and Aquarius Saturn's.",
  "The lord of a bhava is the ruler of the sign on its cusp, and most prediction works through the lord: where it sits, what it is with, and how strong it is. The Sun and Moon own one sign each, and the nodes own none - they are shadow planets.",
  ["jyotish", "rashi"]),
 ("j-rashi-organs", "Rashis and the body",
  "The sign-to-limb correspondence",
  "The zodiac is mapped onto the body from head to foot: Aries the head, Taurus the face and neck, Gemini the shoulders and arms, Cancer the chest and heart area, Leo the stomach and upper back, Virgo the abdomen and intestines, Libra the kidneys and lower back, Scorpio the generative organs, Sagittarius the hips and thighs, Capricorn the knees, Aquarius the calves and ankles, Pisces the feet.",
  "This is the basis of the medical astrology the texts use - an afflicted sign points at the limb it governs. It is traditional correspondence, not diagnosis.",
  ["jyotish", "rashi", "body"]),
]

# -------------------------------------------------------------- the grahas
GRAHAS = [
 ("j-graha-karaka", "The karakatvas of the grahas",
  "What each planet signifies",
  "The Sun signifies the soul, the father, authority, vitality and the bones. The Moon the mind, the mother, the emotions and the blood. Mars energy, courage, brothers, land and injury. Mercury speech, intellect, trade and writing. Jupiter wisdom, children, fortune and the guru. Venus love, marriage, beauty, vehicles and comfort. Saturn time, discipline, labour, sorrow and longevity. Rahu obsession, foreign things and illusion; Ketu detachment, moksha and the past.",
  "These karakatvas are the sense in which a planet 'owns' a matter. When several planets carry the same karakatva, that matter is emphasised in the chart; when the karaka is afflicted, the matter suffers. This is the common list found across the Parashari texts.",
  ["jyotish", "graha"]),
 ("j-graha-exalt", "Exaltation, debilitation and moolatrikona",
  "Where each planet is strongest and weakest",
  "Every planet has a sign where it is exalted (uccha) and therefore strongest, a sign where it is debilitated (neecha) and weakest, and a sign it owns where a particular portion is its moolatrikona - its own home ground, stronger than ordinary ownership.",
  "The degrees matter. The Sun is exalted at 10 degrees of Aries and debilitated at 10 of Libra; the Moon at 3 of Taurus and 3 of Scorpio; Mars at 28 of Capricorn and 28 of Cancer; Mercury at 15 of Virgo and 15 of Pisces; Jupiter at 5 of Cancer and 5 of Capricorn; Venus at 27 of Pisces and 27 of Virgo; Saturn at 20 of Libra and 20 of Aries. Moolatrikona: the Sun in Leo, the Moon in Taurus, Mars in Aries, Mercury in Virgo, Jupiter in Sagittarius, Venus in Libra, Saturn in Aquarius.",
  ["jyotish", "graha", "strength"]),
 ("j-graha-friendship", "Natural friendship between the grahas",
  "Who is whose friend, by nature",
  "The texts give a fixed table of natural friendship. The Sun counts the Moon, Mars and Jupiter as friends, Mercury as neutral, and Venus and Saturn as enemies. The Moon counts the Sun and Mercury as friends and the rest as neutral. Mars counts the Sun, Moon and Jupiter as friends and Mercury as an enemy. Mercury counts the Sun and Venus as friends and the Moon as an enemy. Jupiter counts the Sun, Moon and Mars as friends, Saturn as neutral and Mercury and Venus as enemies. Venus counts Mercury and Saturn as friends and the Sun and Moon as enemies. Saturn counts Mercury and Venus as friends and the Sun, Moon and Mars as enemies.",
  "Natural friendship is inherent to the planets and never changes. It is only one half of the picture - the other half is temporal, and the two combine into the five-fold relationship. The nodes are generally not given natural friendship, as they own no sign.",
  ["jyotish", "graha", "friendship"]),
 ("j-graha-tatkalik", "Temporary friendship",
  "Who is whose friend, by position",
  "Tatkalik maitri is friendship by placement in the chart. A planet treats as its temporary friends the planets sitting in the 2nd, 3rd, 4th, 10th, 11th and 12th houses from itself, and as temporary enemies those in the 1st, 5th, 6th, 7th, 8th and 9th.",
  "This is why the same two planets can be friends in one chart and enemies in another. It is computed from the chart, so it needs the positions of all the planets - which the Kundli screen now has.",
  ["jyotish", "graha", "friendship"]),
 ("j-graha-panchadha", "The five-fold relationship (panchadha maitri)",
  "Natural and temporary friendship combined",
  "Combining the two tables gives five possible relationships. Natural friend plus temporal friend is adhi mitra, a great friend. Natural friend plus temporal enemy, and natural enemy plus temporal friend, both reduce to sama, neutral. Natural neutral plus temporal friend is mitra, a friend. Natural neutral plus temporal enemy is shatru, an enemy. Natural enemy plus temporal enemy is adhi shatru, a great enemy.",
  "This is the relationship the texts actually use when judging whether two planets will help or harm each other. It is computable from the chart, and the Kundli screen shows it.",
  ["jyotish", "graha", "friendship"]),
 ("j-graha-aspects", "Aspects (drishti)",
  "Which house each planet looks at",
  "Every planet aspects the 7th house from itself with a full glance. Beyond that, Mars also aspects the 4th and 8th, Jupiter the 5th and 9th, and Saturn the 3rd and 10th. These three are the planets with special aspects, and it is one reason a Mars or Saturn is watched carefully - it reaches houses the others do not.",
  "Some texts give the nodes aspects too, most often the 5th, 7th and 9th like Jupiter, or the 3rd, 7th and 10th like Saturn; practice differs, so the app uses the three classical special-aspect planets and says so.",
  ["jyotish", "graha", "drishti"]),
 ("j-graha-digbala", "Directional strength (digbala)",
  "Where each planet is strongest by direction",
  "Each planet has a direction in which it is strong: the Sun and Mars in the 10th (south), Jupiter and Mercury in the 1st (east), Saturn in the 7th (west), and the Moon and Venus in the 4th (north). A planet in the opposite house is at its weakest.",
  "Digbala is one of the classical sources of planetary strength, alongside exaltation, moolatrikona and the friendship tables. Like the others it needs a house to be meaningful, so it needs the ascendant.",
  ["jyotish", "graha", "strength"]),
 ("j-graha-attributes", "The attributes of the grahas",
  "Gender, element, dosha, guna, varna and taste",
  "The texts assign each planet a set of qualities. Gender: the Sun, Mars and Jupiter are male; the Moon and Venus female; Mercury and Saturn neuter. Element: the Sun and Mars are fire, the Moon and Venus water, Mercury earth, Jupiter ether, Saturn and Rahu air. Dosha: the Sun is pitta, the Moon kapha and vata, Mars pitta, Mercury tridosha, Jupiter kapha, Venus vata-kapha, Saturn vata. Guna: the Sun, Moon and Jupiter are sattvic; Mercury and Venus rajasic; Mars, Saturn and Rahu tamasic. Taste: the Sun is pungent, the Moon salty, Mars bitter, Mercury mixed, Jupiter sweet, Venus sour, Saturn astringent.",
  "These are the correspondences the texts use when a planet's nature has to be matched to a matter - an illness, a food, a temperament. They are traditional classification, not medicine.",
  ["jyotish", "graha"]),
 ("j-graha-bodyparts", "Grahas and the body",
  "Which limb each planet governs",
  "The Sun governs the bones, heart, right eye and head. The Moon the blood, the left eye and the mind. Mars the marrow, neck and energy. Mercury the skin and nervous system. Jupiter the fat and the liver. Venus the reproductive system and the kidneys. Saturn the nerves, teeth and feet. Rahu and Ketu the subtle body and the breath.",
  "Read alongside the sign-to-limb mapping: the sign says which limb, the planet says what kind of trouble or strength.",
  ["jyotish", "graha", "body"]),
]

# --------------------------------------------------------------- the bhavas
BHAVAS = [
 ("j-bhava-1", "The first bhava (lagna)", "Body, self, vitality, fame, general fortune",
  "The first house is the self - the body, the temperament, the vitality and the direction of the life. Its sign is the lagna, and the lord of the lagna is read as the person themselves.",
  "The lagna is fixed by the moment of birth, so it needs an exact birth time and place. Everything else in the chart is read from it.", ["jyotish", "bhava"]),
 ("j-bhava-2", "The second bhava", "Wealth, speech, family, food, and one of the marak houses",
  "The second house governs accumulated wealth, the power of speech, the family you are born into, and what you eat. It is also, with the seventh, a marak bhava - a house whose significations can end life.",
  "Why the second and seventh are marak is a classical point of some subtlety: they are the houses that 'kill' the lagna, being the 2nd and the 7th from it.", ["jyotish", "bhava"]),
 ("j-bhava-3", "The third bhava", "Siblings, courage, communication, short journeys",
  "The third house covers younger siblings, valour and effort, the hands and communication, and short travel. Mars is its natural karaka.",
  "It is an upachaya house - one of the houses that grows better with time and with effort.", ["jyotish", "bhava"]),
 ("j-bhava-4", "The fourth bhava", "Mother, home, land, vehicles, inner peace",
  "The fourth house governs the mother, the home and property, vehicles, education in the early years, and the happiness of the mind. The Moon and Venus are read here.",
  "Being a kendra, it is one of the pillars of the chart.", ["jyotish", "bhava"]),
 ("j-bhava-5", "The fifth bhava", "Children, intelligence, creativity, past merit",
  "The fifth house covers children, intelligence and learning, creativity, romance, and purva punya - the merit carried from previous lives. Jupiter is its karaka.",
  "It is a trikona house, and the trikonas are the most auspicious in the chart.", ["jyotish", "bhava"]),
 ("j-bhava-6", "The sixth bhava", "Enemies, disease, debt, service, competition",
  "The sixth house governs enemies, illness, debt, servants and service, and day-to-day competition. It is an upachaya house, so it strengthens with time.",
  "A strong sixth house is read as the capacity to overcome opposition, not as misfortune.", ["jyotish", "bhava"]),
 ("j-bhava-7", "The seventh bhava", "Spouse, partnership, business, and the other marak house",
  "The seventh house governs the spouse and marriage, business partnerships, and dealings with others. Venus is its karaka, and it is the second of the two marak houses.",
  "It is also the house of the public - how the world receives you.", ["jyotish", "bhava"]),
 ("j-bhava-8", "The eighth bhava", "Longevity, death, inheritance, the hidden",
  "The eighth house governs the length of life, death, inheritance and legacies, chronic illness, and everything hidden - the occult, research, sudden events. Saturn is read here.",
  "It is the most difficult house in the classical reading, and also the house of deep knowledge.", ["jyotish", "bhava"]),
 ("j-bhava-9", "The ninth bhava", "Fortune, dharma, father, the guru, long journeys",
  "The ninth house governs fortune or bhagya, dharma, the father, the guru and higher learning, pilgrimage and long journeys. Jupiter is its karaka.",
  "It is a trikona, and with the fifth it is one of the two most benefic houses.", ["jyotish", "bhava"]),
 ("j-bhava-10", "The tenth bhava", "Career, karma, status, authority",
  "The tenth house governs profession, karma in the sense of work done in the world, status and authority, and the father in some readings. The Sun, Saturn and Mercury are read here.",
  "It is a kendra and the strongest of the upachaya houses.", ["jyotish", "bhava"]),
 ("j-bhava-11", "The eleventh bhava", "Gains, income, elder siblings, fulfilment of desire",
  "The eleventh house governs income and gains, elder siblings, friends, and the fulfilment of desires. Jupiter is its karaka.",
  "It is an upachaya house and, with the third and sixth, strengthens with time.", ["jyotish", "bhava"]),
 ("j-bhava-12", "The twelfth bhava", "Loss, expenditure, moksha, foreign lands",
  "The twelfth house governs loss and expenditure, confinement, foreign residence, and moksha - liberation. Saturn is read here.",
  "The texts read it both as the house of loss and as the house of liberation, which is the same idea seen from two ends.", ["jyotish", "bhava"]),
 ("j-bhava-groups", "The groups of houses",
  "Kendra, trikona, upachaya, dusthana, marak",
  "The houses are read in groups as well as singly. Kendras are the angles - 1, 4, 7, 10. Trikonas are the trines - 1, 5, 9. Upachaya houses - 3, 6, 10, 11 - improve with time. Dusthanas - 6, 8, 12 - are the difficult houses. Marak houses - 2 and 7 - are the houses that can end life.",
  "A planet is strong in a kendra or a trikona and weak in a dusthana. The kendra-trikona relationship is what produces raja yoga, and the app checks it on the Kundli screen.",
  ["jyotish", "bhava"]),
]

# ------------------------------------------------------------------- yogas
YOGAS = [
 ("j-yoga-mahapurusha", "The Panch Mahapurusha yogas",
  "Five yogas of the great person",
  "When Mars, Mercury, Jupiter, Venus or Saturn sits in its own sign, its exaltation sign or its moolatrikona, and in a kendra from the lagna, the texts name a yoga. Mars gives Ruchaka, Mercury Bhadra, Jupiter Hamsa, Venus Malavya and Saturn Shasha.",
  "Each is read for a different kind of eminence - Ruchaka for command and physical courage, Bhadra for intellect and learning, Hamsa for wisdom and dharma, Malavya for beauty, comfort and the arts, Shasha for authority and endurance. The yoga needs a kendra, so it needs the lagna; the app checks it from the Moon as well, and labels which.",
  ["jyotish", "yoga"]),
 ("j-yoga-raja", "Raja yoga",
  "The kendra-trikona connection",
  "A raja yoga forms when a lord of a kendra (1, 4, 7, 10) and a lord of a trikona (1, 5, 9) are joined - by conjunction, by mutual aspect, by exchange of signs, or by one being in the other's sign. The first house is both a kendra and a trikona, so its lord is the easiest partner in the combination.",
  "This is the central raja yoga of the Parashari texts, and there are many named variations. The app reports the plain conjunction, mutual-aspect and exchange forms, and says which lords formed it.",
  ["jyotish", "yoga"]),
 ("j-yoga-yogakari", "Yogakari planets",
  "A planet that rules both a kendra and a trikona",
  "For some ascendants a single planet rules both a kendra and a trikona, and that planet becomes the yogakari - the maker of yoga. The clearest case is Saturn for a Taurus or Libra ascendant, where it rules the 9th and 10th.",
  "A yogakari is read as doing good even when it is a natural malefic, because its lordships are auspicious. This is why Saturn is said to behave well for Taurus and Libra.",
  ["jyotish", "yoga"]),
 ("j-yoga-sade-sati", "Sade Sati",
  "Saturn's transit over the natal Moon",
  "Sade Sati is the roughly seven-and-a-half year period in which Saturn transits the 12th, 1st and 2nd houses from the natal Moon - the sign before it, the Moon sign itself, and the sign after. The app checks this against the Moon sign you give it.",
  "It is a transit, not a natal yoga, and the texts treat it as a period of pressure and maturation rather than simple misfortune. Its intensity depends on Saturn's strength in the natal chart, which is why a bare 'you have Sade Sati' tells you very little.",
  ["jyotish", "yoga", "transit"]),
 ("j-yoga-ashtakavarga", "On the strength systems not implemented here",
  "What is deliberately left out, and why",
  "The classical texts also use Shadbala (six sources of strength), Ashtakavarga (the eight-fold point system), and the full varga scheme of divisional charts. The app computes dignity, digbala and the friendship tables, but not Shadbala or Ashtakavarga.",
  "They are left out because they are large, arithmetically heavy tables and I could not verify an implementation of them against an authoritative source from here. Rather than ship a number I cannot stand behind, the app omits them and says so. The texts for them are named in the Shastra library.",
  ["jyotish", "caveat"]),
]

jyotish = ([item(*t) for t in RASHIS] + [item(*t) for t in GRAHAS]
           + [item(*t) for t in BHAVAS] + [item(*t) for t in YOGAS])

# ------------------------------------------------- birth places for the site
from kalagana import CITIES
# standard UTC offsets; historical DST is NOT modelled, so the site lets you override
OFFSETS = {"Asia/Kolkata": 5.5, "Asia/Kathmandu": 5.75, "Asia/Dubai": 4.0,
           "Asia/Singapore": 8.0, "Europe/London": 0.0, "America/New_York": -5.0,
           "America/Toronto": -5.0, "Australia/Sydney": 10.0}
places, seen = [], set()
for key, loc in CITIES.items():
    if loc.name in seen:
        continue
    seen.add(loc.name)
    places.append({"name": loc.name, "lat": round(loc.lat, 4), "lon": round(loc.lon, 4),
                   "tz": loc.tz, "offset": OFFSETS.get(loc.tz, 5.5)})
places.sort(key=lambda x: x["name"])
json.dump({"note": "Birth places bundled with the site so the ascendant can be cast. "
                   "offset is the standard UTC offset; historical daylight saving is not modelled.",
           "places": places},
          open(os.path.join(OUT, "places.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print(f"places.json: {len(places)} places")

p = os.path.join(OUT, "jyotish.json")
json.dump({"packId": "jyotish", "packName": "Jyotish", "version": 1, "ordering": "daily",
           "description": "The classical classification tables of phalit jyotish - the rashis, the grahas, the twelve bhavas, the friendships, the aspects and the principal yogas. Described from the Parashari texts; no translated text is copied.",
           "items": jyotish},
          open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"jyotish.json: {len(jyotish)} items, {os.path.getsize(p)/1024:.1f} KB")
