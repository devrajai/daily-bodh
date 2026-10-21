package com.dailybodh.app.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * A single unit of content. Different packs use different subsets of fields:
 *  - Gita items use chapter/verse/sanskrit/transliteration/translations/summary/bodh.
 *  - Quote packs use text + author (and may also fill translations/summaries).
 *
 * Unknown JSON fields are ignored on read, so you can add fields to a pack
 * without breaking older versions of the app.
 */
@Serializable
data class ContentItem(
    val id: String,
    val chapter: Int? = null,
    val verse: Int? = null,
    val sanskrit: String? = null,
    val transliteration: String? = null,
    // Keyed by language code, e.g. {"en": "...", "hi": "..."}
    val translations: Map<String, String> = emptyMap(),
    @SerialName("summary_1line") val summary1: String? = null,
    @SerialName("summary_2to3line") val summary2to3: String? = null,
    @SerialName("bodh_3to4line") val bodh3to4: String? = null,
    // Generic text used by non-Gita packs (quotes, thoughts).
    val text: String? = null,
    val author: String? = null,
    val tags: List<String> = emptyList()
) {
    /** Best-effort title for lists, e.g. "Chapter 2, Verse 47". */
    val reference: String?
        get() = when {
            chapter != null && verse != null -> "Chapter $chapter, Verse $verse"
            author != null -> author
            else -> null
        }
}
