package com.dailybodh.app.widget

import android.content.Context
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.GlanceId
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.getAppWidgetState
import androidx.glance.appwidget.state.updateAppWidgetState
import androidx.glance.state.PreferencesGlanceStateDefinition
import com.dailybodh.app.data.WidgetSettings
import kotlinx.serialization.json.Json
import java.time.LocalDate

/**
 * Per-widget state lives in the widget's own Glance Preferences store, so each
 * widget instance on the home screen keeps its own pack, language and look.
 * Nothing here touches the network.
 */
object WidgetStateStore {

    private val settingsKey = stringPreferencesKey("settings_json")
    private val offsetKey = intPreferencesKey("manual_offset")
    private val offsetDayKey = longPreferencesKey("manual_offset_day")

    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }

    suspend fun readSettings(context: Context, glanceId: GlanceId): WidgetSettings {
        val prefs = getAppWidgetState(context, PreferencesGlanceStateDefinition, glanceId)
        val raw = prefs[settingsKey] ?: return WidgetSettings()
        return runCatching { json.decodeFromString(WidgetSettings.serializer(), raw) }
            .getOrDefault(WidgetSettings())
    }

    suspend fun writeSettings(context: Context, glanceId: GlanceId, settings: WidgetSettings) {
        val encoded = json.encodeToString(WidgetSettings.serializer(), settings)
        updateAppWidgetState(context, glanceId) { prefs -> prefs[settingsKey] = encoded }
    }

    /** The "change on tap" offset, reset automatically when the day changes. */
    suspend fun readOffset(context: Context, glanceId: GlanceId): Int {
        val prefs = getAppWidgetState(context, PreferencesGlanceStateDefinition, glanceId)
        val today = LocalDate.now().toEpochDay()
        return if (prefs[offsetDayKey] == today) (prefs[offsetKey] ?: 0) else 0
    }

    suspend fun bumpOffset(context: Context, glanceId: GlanceId) {
        val today = LocalDate.now().toEpochDay()
        val prefs = getAppWidgetState(context, PreferencesGlanceStateDefinition, glanceId)
        val current = if (prefs[offsetDayKey] == today) (prefs[offsetKey] ?: 0) else 0
        updateAppWidgetState(context, glanceId) { p ->
            p[offsetDayKey] = today
            p[offsetKey] = current + 1
        }
    }

    suspend fun glanceIds(context: Context): List<GlanceId> =
        GlanceAppWidgetManager(context).getGlanceIds(DailyBodhWidget::class.java)
}
