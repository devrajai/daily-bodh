package com.dailybodh.app.data.panchang

import kotlinx.serialization.Serializable

/** One day of the precomputed panchang (times are local, IST). */
@Serializable
data class PanchangDay(
    val d: String = "",
    val vara: String = "",
    val paksha: String = "",
    val masa: String = "",
    val tithi: String = "",
    val tithiNum: Int = 0,
    val tithiEnd: String = "",
    val nakshatra: String = "",
    val nakNum: Int = -1,
    val nakEnd: String = "",
    val yoga: String = "",
    val karana: String = "",
    val sunrise: String = "",
    val sunset: String = "",
    val rahu: String = "",
    val yamaganda: String = "",
    val gulika: String = "",
    val abhijit: String = "",
    val brahma: String = ""
)

@Serializable
data class PanchangFile(
    val location: String = "",
    val timezone: String = "",
    val from: String = "",
    val to: String = "",
    val source: String = "",
    val note: String = "",
    val days: List<PanchangDay> = emptyList()
)

@Serializable
data class Festival(val d: String = "", val n: String = "", val k: String = "")

@Serializable
data class FestivalFile(
    val location: String = "",
    val from: Int = 0,
    val to: Int = 0,
    val note: String = "",
    val festivals: List<Festival> = emptyList()
)

/** One rashi's reading for a day, month or year. */
@Serializable
data class RashiEntry(
    val h: String = "",
    val s: Double = 0.0,
    val b: String = "",
    val f: List<String> = emptyList(),
    val c: List<String> = emptyList()
)

@Serializable
data class RashiInfo(val key: String = "", val en: String = "")

@Serializable
data class RashifalFile(
    val rashis: List<RashiInfo> = emptyList(),
    val dailyFrom: String = "",
    val dailyTo: String = "",
    val monthlyFrom: Int = 0,
    val monthlyTo: Int = 0,
    val yearlyFrom: Int = 0,
    val yearlyTo: Int = 0,
    val source: String = "",
    val disclaimer: String = "",
    val daily: Map<String, List<RashiEntry>> = emptyMap(),
    val monthly: Map<String, List<RashiEntry>> = emptyMap(),
    val yearly: Map<String, List<RashiEntry>> = emptyMap()
)

@Serializable
data class MuhuratFunction(
    val id: String = "",
    val name: String = "",
    val varas: List<String> = emptyList(),
    val tithis: List<Int> = emptyList(),
    val nakshatras: List<Int> = emptyList(),
    val avoidYogas: List<String> = emptyList(),
    val avoidKaranas: List<String> = emptyList(),
    val note: String = ""
)

@Serializable
data class MuhuratFile(
    val note: String = "",
    val taras: List<String> = emptyList(),
    val goodTaras: List<Int> = emptyList(),
    val goodMoonHouses: List<Int> = emptyList(),
    val functions: List<MuhuratFunction> = emptyList()
)
