package com.dailybodh.app.data

/**
 * Classical Ashtakoota (36-point) compatibility, computed from the birth nakshatra
 * and rashi of both people. Everything here is a traditional lookup table, so it
 * runs entirely offline.
 *
 * IMPORTANT: these tables differ between lineages and printed sources, and the
 * classical texts treat the per-koota breakdown - not the total - as the useful
 * output. This is one traditional input among many, never a verdict.
 */
object GunaMilan {

    val rashiNames = listOf(
        "Aries (Mesh)", "Taurus (Vrishabh)", "Gemini (Mithun)", "Cancer (Kark)",
        "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrishchik)",
        "Sagittarius (Dhanu)", "Capricorn (Makar)", "Aquarius (Kumbh)", "Pisces (Meen)"
    )

    val nakshatraNames = listOf(
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
        "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
        "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
        "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
        "Uttara Bhadrapada", "Revati"
    )

    data class Koota(val name: String, val max: Int, val score: Double, val note: String)

    data class Result(
        val kootas: List<Koota>,
        val total: Double,
        val verdict: String
    ) {
        val maxTotal: Int get() = kootas.sumOf { it.max }
    }

    // ---- Varna (1) : 3=Brahmin 2=Kshatriya 1=Vaishya 0=Shudra ----
    private val varnaByRashi = intArrayOf(2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3)

    // ---- Gana (6) : 0=Deva 1=Manushya 2=Rakshasa ----
    private val ganaByNak = intArrayOf(
        0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0
    )

    // ---- Nadi (8) : 0=Adi 1=Madhya 2=Antya ----
    private val nadiByNak = intArrayOf(
        0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2
    )

    // ---- Yoni (4) : 14 animals ----
    private val yoniByNak = intArrayOf(
        0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1
    )
    private val yoniNames = listOf(
        "Horse", "Elephant", "Sheep", "Serpent", "Dog", "Cat", "Rat", "Cow",
        "Buffalo", "Tiger", "Deer", "Monkey", "Mongoose", "Lion"
    )
    /** The classical sworn-enemy pairs; everything else is treated as neutral. */
    private val yoniEnemies = setOf(
        setOf(0, 8),   // horse - buffalo
        setOf(1, 13),  // elephant - lion
        setOf(2, 11),  // sheep - monkey
        setOf(3, 12),  // serpent - mongoose
        setOf(4, 10),  // dog - deer
        setOf(5, 6),   // cat - rat
        setOf(7, 9)    // cow - tiger
    )

    // ---- rashi lords, for Graha Maitri (5) ----
    private val lordByRashi = intArrayOf(2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4) // Sun..Saturn
    private val friends = listOf(
        setOf(1, 2, 4),          // Sun: Moon, Mars, Jupiter
        setOf(0, 3),             // Moon: Sun, Mercury
        setOf(0, 1, 4),          // Mars: Sun, Moon, Jupiter
        setOf(0, 5),             // Mercury: Sun, Venus
        setOf(0, 1, 2),          // Jupiter: Sun, Moon, Mars
        setOf(3, 6),             // Venus: Mercury, Saturn
        setOf(3, 5)              // Saturn: Mercury, Venus
    )
    private val enemies = listOf(
        setOf(5, 6),             // Sun: Venus, Saturn
        setOf(),                 // Moon: none
        setOf(3),                // Mars: Mercury
        setOf(1),                // Mercury: Moon
        setOf(3, 5),             // Jupiter: Mercury, Venus
        setOf(0, 1),             // Venus: Sun, Moon
        setOf(0, 1, 2)           // Saturn: Sun, Moon, Mars
    )

    private fun taraScore(from: Int, to: Int): Boolean {
        val count = ((to - from + 27) % 27) + 1
        val rem = count % 9
        return rem == 0 || rem % 2 == 0
    }

    fun compute(boyNak: Int, boyRashi: Int, girlNak: Int, girlRashi: Int): Result {
        val kootas = mutableListOf<Koota>()

        // 1. Varna
        val vb = varnaByRashi[boyRashi]; val vg = varnaByRashi[girlRashi]
        kootas += Koota("Varna", 1, if (vb >= vg) 1.0 else 0.0,
            "boy ${varnaName(vb)} / girl ${varnaName(vg)}")

        // 2. Vashya (2) - simplified to the same-group rule
        val sameVashya = vashyaGroup(boyRashi) == vashyaGroup(girlRashi)
        kootas += Koota("Vashya", 2, if (sameVashya) 2.0 else 1.0,
            if (sameVashya) "same group" else "different groups")

        // 3. Tara (3)
        val b2g = taraScore(boyNak, girlNak)
        val g2b = taraScore(girlNak, boyNak)
        val tara = when {
            b2g && g2b -> 3.0; b2g || g2b -> 1.5; else -> 0.0
        }
        kootas += Koota("Tara", 3, tara,
            (if (b2g) "favourable" else "not favourable") + " both ways")

        // 4. Yoni (4)
        val yb = yoniByNak[boyNak]; val yg = yoniByNak[girlNak]
        val yoni = when {
            yb == yg -> 4.0
            setOf(yb, yg) in yoniEnemies -> 0.0
            else -> 2.0
        }
        kootas += Koota("Yoni", 4, yoni,
            "${yoniNames[yb]} / ${yoniNames[yg]}" + if (setOf(yb, yg) in yoniEnemies) " (sworn enemies)" else "")

        // 5. Graha Maitri (5)
        val lb = lordByRashi[boyRashi]; val lg = lordByRashi[girlRashi]
        val maitri = when {
            lb == lg -> 5.0
            lg in friends[lb] && lb in friends[lg] -> 5.0
            lb in enemies[lg] || lg in enemies[lb] -> 0.0
            lb in friends[lg] || lg in friends[lb] -> 4.0
            else -> 3.0
        }
        kootas += Koota("Graha Maitri", 5, maitri, "rashi lords ${lordName(lb)} / ${lordName(lg)}")

        // 6. Gana (6)
        val gb = ganaByNak[boyNak]; val gg = ganaByNak[girlNak]
        val gana = when {
            gb == gg -> 6.0
            setOf(gb, gg) == setOf(0, 1) -> 6.0
            else -> 0.0
        }
        kootas += Koota("Gana", 6, gana, "${ganaName(gb)} / ${ganaName(gg)}")

        // 7. Bhakoot (7)
        val d1 = ((girlRashi - boyRashi + 12) % 12) + 1
        val d2 = ((boyRashi - girlRashi + 12) % 12) + 1
        val dosha = (d1 == 6 && d2 == 8) || (d1 == 8 && d2 == 6) ||
                (d1 == 2 && d2 == 12) || (d1 == 12 && d2 == 2)
        kootas += Koota("Bhakoot", 7, if (dosha) 0.0 else 7.0,
            if (dosha) "Bhakoot dosha ($d1/$d2)" else "no dosha")

        // 8. Nadi (8)
        val sameNadi = nadiByNak[boyNak] == nadiByNak[girlNak]
        kootas += Koota("Nadi", 8, if (sameNadi) 0.0 else 8.0,
            if (sameNadi) "same nadi - Nadi dosha" else "different nadi")

        val total = kootas.sumOf { it.score }
        val verdict = when {
            total >= 25 -> "Traditionally considered a strong match"
            total >= 18 -> "Traditionally considered acceptable"
            total >= 12 -> "Traditionally considered weak; the doshas above are usually read closely"
            else -> "Traditionally considered poor; most texts would advise against relying on the score alone"
        }
        return Result(kootas, total, verdict)
    }

    private fun varnaName(v: Int) = listOf("Shudra", "Vaishya", "Kshatriya", "Brahmin")[v]
    private fun ganaName(g: Int) = listOf("Deva", "Manushya", "Rakshasa")[g]
    private fun lordName(l: Int) = listOf("Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn")[l]
    private fun vashyaGroup(r: Int) = when (r) {
        in intArrayOf(0, 1) -> 0        // chatushpada
        4 -> 1                          // vanachara
        7 -> 2                          // keeta
        in intArrayOf(3, 11) -> 3       // jalachara
        else -> 4                       // manava
    }
}
