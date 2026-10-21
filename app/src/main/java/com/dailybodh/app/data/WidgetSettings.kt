package com.dailybodh.app.data

import kotlinx.serialization.Serializable

/**
 * Per-widget configuration. One of these is stored for every widget instance on
 * the home screen, so each widget can have its own pack, language and look.
 */
@Serializable
data class WidgetSettings(
    val packId: String = "gita",
    val displayMode: String = "translation",   // original | transliteration | translation | summary1 | summary2to3 | bodh
    val language: String = "en",
    val theme: String = "auto",                // light | dark | auto
    val bgColor: Long = 0xFF1A237E,            // ARGB packed into a Long
    val bgAlpha: Int = 90,                     // 0..100
    val shadow: String = "low",                // none | low | medium
    val cornerRadius: Int = 18,
    val fontColor: Long = 0xFFFFFFFF,
    val fontColorPreset: Int = 0,
    val fontSize: String = "medium",           // small | medium | large | custom
    val customFontSize: Float = 16f,
    val fontStyle: String = "default",         // default | serif | devanagari
    val widgetSize: String = "4x2",            // 2x2 | 4x2 | 4x4
    val changeOnTap: Boolean = true,
    val repeat: Boolean = true
) {
    val effectiveFontSize: Float
        get() = when (fontSize) {
            "small" -> 13f
            "medium" -> 16f
            "large" -> 20f
            else -> customFontSize
        }
}
