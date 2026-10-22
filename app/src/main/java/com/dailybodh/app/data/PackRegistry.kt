package com.dailybodh.app.data

/**
 * The list of content packs that ship with the app. Each pack maps to one JSON
 * file under assets/content/. To add a new pack: drop a JSON file in that folder,
 * add one entry here, and (optionally) a language entry in [AppLanguage].
 */
data class PackInfo(
    val id: String,
    val assetFile: String,
    val displayName: String
)

object PackRegistry {
    val packs: List<PackInfo> = listOf(
        PackInfo("gita", "content/gita.json", "Bhagavad Gita"),
        PackInfo("aarti", "content/aarti.json", "Aarti & Prayers"),
        PackInfo("mantras", "content/mantras.json", "Mantras"),
        PackInfo("puja", "content/puja.json", "Puja & Rituals"),
        PackInfo("remedies", "content/remedies.json", "Remedies"),
        PackInfo("business", "content/business_quotes.json", "Business"),
        PackInfo("leadership", "content/leadership.json", "Leadership"),
        PackInfo("discipline", "content/self_discipline.json", "Self-Discipline"),
        PackInfo("gentleman", "content/gentleman.json", "Be a Gentleman"),
        PackInfo("motivation", "content/motivation.json", "Motivation"),
        PackInfo("osho", "content/osho.json", "Inner Thoughts")
    )

    fun byId(id: String): PackInfo = packs.firstOrNull { it.id == id } ?: packs.first()
    fun displayName(id: String): String = byId(id).displayName
}

/**
 * Languages available for display. Add an entry here and add the matching key
 * under "translations" in your JSON files to support a new language.
 */
data class AppLanguage(val code: String, val displayName: String, val devanagari: Boolean = false)

object Languages {
    val all: List<AppLanguage> = listOf(
        AppLanguage("en", "English"),
        AppLanguage("hi", "Hindi (हिन्दी)", devanagari = true),
        AppLanguage("sa", "Sanskrit (संस्कृतम्)", devanagari = true),
        AppLanguage("mr", "Marathi (मराठी)", devanagari = true),
        AppLanguage("gu", "Gujarati (ગુજરાતી)", devanagari = false)
    )

    fun byCode(code: String): AppLanguage = all.firstOrNull { it.code == code } ?: all.first()
}
