package com.dailybodh.app.data

import com.dailybodh.app.data.panchang.MuhuratFunction
import com.dailybodh.app.data.panchang.PanchangDay
import com.dailybodh.app.data.panchang.MuhuratFile

/**
 * Classical muhurat checking. The rules live in muhurat.json so you can edit them;
 * this file only applies them. Everything is arithmetic on the panchang plus, when
 * you give birth stars, the two classical personal filters: Tara Bala (from the
 * janma nakshatra) and Chandra Bala (from the janma rashi).
 *
 * No rule here is invented. They are the standard tabulations, and regional and
 * sampradaya practice differs - a family's own pandit is the final word.
 */
object Muhurat {

    /** A person as far as muhurat is concerned: just their birth star and Moon sign. */
    data class Person(val label: String, val janmaNak: Int, val janmaRashi: Int)

    data class Verdict(
        val day: String,
        val vara: String,
        val tithi: String,
        val nakshatra: String,
        val auspicious: Boolean,
        val reasons: List<String>,
        val blockers: List<String>
    )

    /** Tara Bala: the 9-fold count from the janma nakshatra to the day's nakshatra. */
    fun taraBala(janmaNak: Int, dayNak: Int): Int {
        val count = ((dayNak - janmaNak + 27) % 27) + 1
        return ((count - 1) % 9) + 1
    }

    /** Chandra Bala: the house the transiting Moon occupies from the janma rashi. */
    fun chandraBala(janmaRashi: Int, moonRashi: Int): Int =
        ((moonRashi - janmaRashi + 12) % 12) + 1

    /**
     * Judge one day for one function. [persons] may be empty, in which case only the
     * general rules apply.
     */
    fun evaluate(
        file: MuhuratFile,
        fn: MuhuratFunction,
        day: PanchangDay,
        moonLongitude: Double?,
        persons: List<Person>
    ): Verdict {
        val reasons = mutableListOf<String>()
        val blockers = mutableListOf<String>()

        // 1. weekday
        if (day.vara in fn.varas) reasons += "Weekday ${day.vara} is favourable"
        else blockers += "Weekday ${day.vara} is not one of the favourable days"

        // 2. tithi, judged within its paksha
        val within = if (day.tithiNum <= 0) 0 else ((day.tithiNum - 1) % 15) + 1
        if (within == 0) blockers += "Tithi could not be read"
        else if (within in fn.tithis) reasons += "Tithi ${day.tithi} is favourable"
        else blockers += "Tithi ${day.tithi} is not favourable for this"

        // 3. nakshatra
        if (day.nakNum in fn.nakshatras) reasons += "Nakshatra ${day.nakshatra} is favourable"
        else if (day.nakNum >= 0) blockers += "Nakshatra ${day.nakshatra} is not favourable for this"

        // 4. karana and yoga
        if (fn.avoidKaranas.any { it.equals(day.karana, ignoreCase = true) })
            blockers += "Karana ${day.karana} (Bhadra/Vishti) is avoided"
        if (fn.avoidYogas.any { it.equals(day.yoga, ignoreCase = true) })
            blockers += "Yoga ${day.yoga} is an inauspicious yoga"

        // 5. personal filters, only if birth stars were given
        val moonRashi = moonLongitude?.let { ((it / 30.0).toInt()) % 12 }
        persons.forEach { p ->
            if (day.nakNum >= 0) {
                val tara = taraBala(p.janmaNak, day.nakNum)
                val name = file.taras.getOrNull(tara - 1) ?: "Tara $tara"
                if (tara in file.goodTaras) reasons += "${p.label}: $name tara is favourable"
                else blockers += "${p.label}: $name tara is not favourable"
            }
            if (moonRashi != null) {
                val house = chandraBala(p.janmaRashi, moonRashi)
                if (house in file.goodMoonHouses) reasons += "${p.label}: Moon in house $house is favourable"
                else blockers += "${p.label}: Moon in house $house is not favourable"
            }
        }

        return Verdict(
            day = day.d, vara = day.vara, tithi = day.tithi, nakshatra = day.nakshatra,
            auspicious = blockers.isEmpty(), reasons = reasons, blockers = blockers
        )
    }
}
