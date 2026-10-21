package com.dailybodh.app.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.dailybodh.app.data.ContentRepository
import com.dailybodh.app.data.PackRegistry
import com.dailybodh.app.data.SettingsRepository
import com.dailybodh.app.data.WidgetSettings
import com.dailybodh.app.data.model.ContentItem
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/** Composite favorite key: "packId::itemId". */
fun favKey(packId: String, itemId: String) = "$packId::$itemId"
fun favPack(key: String) = key.substringBefore("::")
fun favItem(key: String) = key.substringAfter("::")

class MainViewModel(app: Application) : AndroidViewModel(app) {

    val settings = SettingsRepository(app)
    val content = ContentRepository(app)

    val favorites: StateFlow<Set<String>> = settings.favorites
        .stateIn(viewModelScope, SharingStarted.Eagerly, emptySet())

    val globalTheme: StateFlow<String> = settings.globalTheme
        .stateIn(viewModelScope, SharingStarted.Eagerly, "auto")

    val packNames: List<Pair<String, String>> =
        PackRegistry.packs.map { it.id to it.displayName }

    fun toggleFavorite(packId: String, itemId: String) {
        viewModelScope.launch { settings.toggleFavorite(favKey(packId, itemId)) }
    }

    fun setGlobalTheme(theme: String) {
        viewModelScope.launch { settings.setGlobalTheme(theme) }
    }

    suspend fun item(packId: String, itemId: String): ContentItem? =
        content.item(packId, itemId)

    suspend fun saveDefaultSettings(s: WidgetSettings) {
        settings.save(DEFAULT_WIDGET_ID, s)
    }

    suspend fun defaultSettings(): WidgetSettings = settings.current(DEFAULT_WIDGET_ID)

    companion object {
        /** Negative id used to store the "defaults for new widgets" settings. */
        const val DEFAULT_WIDGET_ID = -1
    }
}
