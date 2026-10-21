package com.dailybodh.app.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.serialization.json.Json

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "daily_bodh")

/**
 * All persistent state, stored locally with DataStore. No values leave the device.
 */
class SettingsRepository(private val context: Context) {

    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }

    private fun widgetKey(id: Int) = stringPreferencesKey("widget_$id")
    private val favoritesKey = stringSetPreferencesKey("favorites")
    private val globalThemeKey = stringPreferencesKey("global_theme")

    fun settingsFlow(widgetId: Int): Flow<WidgetSettings> =
        context.dataStore.data.map { prefs ->
            prefs[widgetKey(widgetId)]?.let {
                runCatching { json.decodeFromString(WidgetSettings.serializer(), it) }.getOrNull()
            } ?: WidgetSettings()
        }

    suspend fun current(widgetId: Int): WidgetSettings = settingsFlow(widgetId).first()

    suspend fun save(widgetId: Int, settings: WidgetSettings) {
        context.dataStore.edit { prefs ->
            prefs[widgetKey(widgetId)] = json.encodeToString(WidgetSettings.serializer(), settings)
        }
    }

    suspend fun update(widgetId: Int, transform: (WidgetSettings) -> WidgetSettings) {
        save(widgetId, transform(current(widgetId)))
    }

    /** Called when a widget is removed so stale config does not linger. */
    suspend fun clear(widgetId: Int) {
        context.dataStore.edit { it.remove(widgetKey(widgetId)) }
    }

    // ---- Favorites ----------------------------------------------------------

    val favorites: Flow<Set<String>> =
        context.dataStore.data.map { it[favoritesKey] ?: emptySet() }

    suspend fun toggleFavorite(itemId: String) {
        context.dataStore.edit { prefs ->
            val cur = prefs[favoritesKey] ?: emptySet()
            prefs[favoritesKey] = if (itemId in cur) cur - itemId else cur + itemId
        }
    }

    suspend fun isFavorite(itemId: String): Boolean = favorites.first().contains(itemId)

    // ---- Global theme -------------------------------------------------------

    val globalTheme: Flow<String> =
        context.dataStore.data.map { it[globalThemeKey] ?: "auto" }

    suspend fun setGlobalTheme(theme: String) {
        context.dataStore.edit { it[globalThemeKey] = theme }
    }
}
