package com.dailybodh.app.data

import android.content.Context
import com.dailybodh.app.data.panchang.Festival
import com.dailybodh.app.data.panchang.FestivalFile
import com.dailybodh.app.data.panchang.PanchangDay
import com.dailybodh.app.data.panchang.PanchangFile
import com.dailybodh.app.data.panchang.RashifalFile
import android.util.Base64
import org.json.JSONObject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import java.time.LocalDate

/**
 * Reads the panchang, festival and rashifal files that ship in assets/content.
 * All of it was precomputed at build time, so nothing is fetched at runtime.
 */
class PanchangRepository(private val context: Context) {

    private val json = Json { ignoreUnknownKeys = true; isLenient = true }

    private var panchangCache: PanchangFile? = null
    private var festivalCache: FestivalFile? = null
    private var rashifalCache: RashifalFile? = null

    private suspend fun text(name: String): String = withContext(Dispatchers.IO) {
        context.assets.open("content/$name").bufferedReader().use { it.readText() }
    }

    suspend fun panchang(): PanchangFile = panchangCache ?: withContext(Dispatchers.IO) {
        json.decodeFromString(PanchangFile.serializer(), text("panchang.json"))
    }.also { panchangCache = it }

    suspend fun festivals(): FestivalFile = festivalCache ?: withContext(Dispatchers.IO) {
        json.decodeFromString(FestivalFile.serializer(), text("festivals.json"))
    }.also { festivalCache = it }

    suspend fun rashifal(): RashifalFile = rashifalCache ?: withContext(Dispatchers.IO) {
        json.decodeFromString(RashifalFile.serializer(), text("rashifal.json"))
    }.also { rashifalCache = it }

    suspend fun day(date: LocalDate): PanchangDay? =
        panchang().days.firstOrNull { it.d == date.toString() }

    /** Festivals from today onwards, in date order. */
    suspend fun upcoming(from: LocalDate, limit: Int = 40): List<Festival> =
        festivals().festivals.filter { it.d >= from.toString() }.take(limit)

    // ---- approximate birth star (nakshatra) from a birth date ----
    private var moonStars: ByteArray? = null
    private var moonStart: LocalDate? = null

    private suspend fun loadMoonStars() {
        if (moonStars != null) return
        val raw = text("moonstars.json")
        withContext(Dispatchers.IO) {
            val o = JSONObject(raw)
            moonStart = LocalDate.parse(o.getString("from"))
            moonStars = Base64.decode(o.getString("stars"), Base64.DEFAULT)
        }
    }

    /**
     * Nakshatra index (0..26) for a birth date, taken at local noon. The Moon changes
     * nakshatra about once a day, so this is an approximation - not a birth chart.
     */
    suspend fun approximateNakshatra(birth: LocalDate): Int? {
        loadMoonStars()
        val start = moonStart ?: return null
        val idx = java.time.temporal.ChronoUnit.DAYS.between(start, birth).toInt()
        val bytes = moonStars ?: return null
        return if (idx in bytes.indices) bytes[idx].toInt() else null
    }

    /** Sidereal longitude of the Moon (0..360) at local noon on that date. */
    suspend fun moonLongitude(birth: LocalDate): Double? {
        loadMoonStars()
        val start = moonStart ?: return null
        val idx = java.time.temporal.ChronoUnit.DAYS.between(start, birth).toInt()
        val bytes = moonStars ?: return null
        val at = idx * 2
        if (at < 0 || at + 1 >= bytes.size) return null
        val centi = (bytes[at].toInt() and 0xFF) or ((bytes[at + 1].toInt() and 0xFF) shl 8)
        return centi / 100.0
    }

    suspend fun festivalsInMonth(year: Int, month: Int): List<Festival> {
        val prefix = "%04d-%02d".format(year, month)
        return festivals().festivals.filter { it.d.startsWith(prefix) }
    }
}
