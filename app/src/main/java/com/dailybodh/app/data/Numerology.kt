package com.dailybodh.app.data

/**
 * Numerology, following Cheiro (Count Louis Hamon, 1866-1936), whose Book of
 * Numbers is public domain in India. Everything here is arithmetic on a name and
 * a date - the interpretation on top of it is Cheiro's, not a fact.
 */
object Numerology {

    /** Add the digits until one remains. */
    fun reduce(value: Int): Int {
        var x = kotlin.math.abs(value)
        while (x > 9) {
            var sum = 0
            var v = x
            while (v > 0) { sum += v % 10; v /= 10 }
            x = sum
        }
        return if (x == 0) 0 else x
    }

    /** Psychic number (mulank): the day of the month. */
    fun psychic(day: Int): Int = reduce(day)

    /** Destiny number (bhagyank): the whole date. */
    fun destiny(year: Int, month: Int, day: Int): Int =
        reduce(reduce(year) + reduce(month) + reduce(day))

    /** Chaldean letter values. There is no 9 in the Chaldean table. */
    private val chaldean = mapOf(
        'a' to 1, 'i' to 1, 'j' to 1, 'q' to 1, 'y' to 1,
        'b' to 2, 'k' to 2, 'r' to 2,
        'c' to 3, 'g' to 3, 'l' to 3, 's' to 3,
        'd' to 4, 'm' to 4, 't' to 4,
        'e' to 5, 'h' to 5, 'n' to 5, 'x' to 5,
        'u' to 6, 'v' to 6, 'w' to 6,
        'o' to 7, 'z' to 7,
        'f' to 8, 'p' to 8
    )

    /** Name number, Chaldean system. */
    fun nameNumber(name: String): Int {
        val total = name.lowercase().sumOf { chaldean[it] ?: 0 }
        return reduce(total)
    }

    /** Name number, Pythagorean system (A=1 .. I=9, repeating). */
    fun nameNumberPythagorean(name: String): Int {
        val total = name.lowercase().filter { it in 'a'..'z' }
            .sumOf { ((it - 'a') % 9) + 1 }
        return reduce(total)
    }
}

/**
 * Vimshottari dasha. The sequence and its year-lengths are fixed by the tradition;
 * the starting point comes from the Moon's nakshatra at birth, so nothing here is
 * invented - it is arithmetic on the birth star.
 */
object Vimshottari {

    val lords = listOf("Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury")
    val years = listOf(7, 20, 6, 10, 7, 18, 16, 19, 17)   // total 120

    data class Period(val lord: String, val startYear: Double, val endYear: Double)

    /**
     * The mahadasha running [ageYears] after birth, given the birth nakshatra
     * (0..26) and the fraction of that nakshatra already elapsed at birth.
     */
    fun current(nakshatra: Int, fractionElapsed: Double, ageYears: Double): Period {
        val start = nakshatra % 9
        // balance of the first (birth) dasha
        val first = years[start] * (1.0 - fractionElapsed.coerceIn(0.0, 1.0))
        var cursor = 0.0
        var idx = start
        repeat(3) {                     // at most a few cycles cover a human life
            val len = if (cursor == 0.0) first else years[idx % 9].toDouble()
            if (ageYears < cursor + len) {
                return Period(lords[idx % 9], cursor, cursor + len)
            }
            cursor += len
            idx++
        }
        val len = years[idx % 9].toDouble()
        return Period(lords[idx % 9], cursor, cursor + len)
    }

    /** Antardasha (bhukti) inside a mahadasha, starting from the mahadasha lord. */
    fun antardasha(mahadashaLord: String, elapsedInMahadasha: Double): String {
        val start = lords.indexOf(mahadashaLord).coerceAtLeast(0)
        val total = years[start].toDouble()
        val position = elapsedInMahadasha.coerceIn(0.0, total - 0.0001)
        var cursor = 0.0
        for (k in 0 until 9) {
            val idx = (start + k) % 9
            val len = total * years[idx] / 120.0
            if (position < cursor + len) return lords[idx]
            cursor += len
        }
        return mahadashaLord
    }
}
