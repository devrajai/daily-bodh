package com.dailybodh.app.data

import android.content.Context
import com.dailybodh.app.data.model.ContentItem
import com.dailybodh.app.data.model.PackFile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json

/**
 * Loads content packs from bundled assets. Everything is read from disk on the
 * device; nothing is ever fetched from a network.
 */
class ContentRepository(private val context: Context) {

    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        explicitNulls = false
    }

    private val cache = mutableMapOf<String, PackFile>()
    private val mutex = Mutex()

    suspend fun pack(packId: String): PackFile = mutex.withLock {
        cache[packId] ?: withContext(Dispatchers.IO) {
            val info = PackRegistry.byId(packId)
            val text = context.assets.open(info.assetFile).bufferedReader().use { it.readText() }
            json.decodeFromString(PackFile.serializer(), text)
        }.also { cache[packId] = it }
    }

    suspend fun items(packId: String): List<ContentItem> = pack(packId).items

    suspend fun item(packId: String, itemId: String): ContentItem? =
        items(packId).firstOrNull { it.id == itemId }

    /** Simple in-memory search across the given packs. */
    suspend fun search(packIds: List<String>, query: String): List<Pair<String, ContentItem>> {
        if (query.isBlank()) return emptyList()
        val q = query.trim().lowercase()
        val out = mutableListOf<Pair<String, ContentItem>>()
        for (pid in packIds) {
            for (item in items(pid)) {
                val haystack = buildString {
                    append(item.sanskrit ?: ""); append(' ')
                    append(item.transliteration ?: ""); append(' ')
                    append(item.text ?: ""); append(' ')
                    append(item.author ?: ""); append(' ')
                    append(item.summary1 ?: ""); append(' ')
                    append(item.translations.values.joinToString(" "))
                }.lowercase()
                if (haystack.contains(q)) out.add(pid to item)
            }
        }
        return out
    }
}
