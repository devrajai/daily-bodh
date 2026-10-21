package com.dailybodh.app.data.model

import kotlinx.serialization.Serializable

/**
 * The top-level shape of every JSON file in app/src/main/assets/content/.
 *
 * ordering:
 *   "sequential" -> advance one item per day in file order, looping (Gita).
 *   "daily"      -> pick by day-of-year, index = dayOfYear % items.size (other packs).
 */
@Serializable
data class PackFile(
    val packId: String,
    val packName: String,
    val description: String = "",
    val version: Int = 1,
    val ordering: String = "daily",
    val items: List<ContentItem> = emptyList()
)
