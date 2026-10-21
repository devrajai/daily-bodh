package com.dailybodh.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dailybodh.app.data.Languages
import com.dailybodh.app.data.PackRegistry
import com.dailybodh.app.data.WidgetSettings

private val bgPresets = listOf(
    0xFF1A237E, 0xFF000000, 0xFF1B5E20, 0xFF4A148C,
    0xFF37474F, 0xFFF6F3EC, 0xFFFFFFFF, 0xFF5D4037
).map { it }

private val fontPresets = listOf(
    0xFFFFFFFF, 0xFF000000, 0xFFFFF8E1, 0xFFFFD54F,
    0xFFB3E5FC, 0xFFC8E6C9, 0xFFF8BBD0, 0xFFFFCC80
).map { it }

@Composable
fun WidgetCustomizer(
    settings: WidgetSettings,
    onSettingsChange: (WidgetSettings) -> Unit
) {
    Column(Modifier.fillMaxWidth()) {

        Group("Content pack") {
            ChipRow(
                options = PackRegistry.packs.map { it.id to it.displayName },
                selected = settings.packId,
                onSelect = { onSettingsChange(settings.copy(packId = it)) }
            )
        }

        Group("Display mode") {
            ChipRow(
                options = listOf(
                    "original" to "Original",
                    "transliteration" to "Transliteration",
                    "translation" to "Translation",
                    "summary1" to "1-line",
                    "summary2to3" to "2-3 line",
                    "bodh" to "Bodh"
                ),
                selected = settings.displayMode,
                onSelect = { onSettingsChange(settings.copy(displayMode = it)) }
            )
        }

        Group("Language") {
            ChipRow(
                options = Languages.all.map { it.code to it.displayName },
                selected = settings.language,
                onSelect = { onSettingsChange(settings.copy(language = it)) }
            )
        }

        Group("Theme") {
            ChipRow(
                options = listOf("light" to "Light", "dark" to "Dark", "auto" to "Auto"),
                selected = settings.theme,
                onSelect = { onSettingsChange(settings.copy(theme = it)) }
            )
        }

        Group("Background colour") {
            ColorRow(
                presets = bgPresets,
                selected = settings.bgColor,
                onSelect = { onSettingsChange(settings.copy(bgColor = it)) }
            )
            RgbSliders(settings.bgColor) { onSettingsChange(settings.copy(bgColor = it)) }
        }

        Group("Transparency") {
            Slider(
                value = settings.bgAlpha.toFloat(),
                onValueChange = { onSettingsChange(settings.copy(bgAlpha = it.toInt())) },
                valueRange = 0f..100f
            )
            Text("${settings.bgAlpha}%", style = MaterialTheme.typography.bodySmall)
        }

        Group("Shadow") {
            ChipRow(
                options = listOf("none" to "None", "low" to "Low", "medium" to "Medium"),
                selected = settings.shadow,
                onSelect = { onSettingsChange(settings.copy(shadow = it)) }
            )
        }

        Group("Corner radius") {
            Slider(
                value = settings.cornerRadius.toFloat(),
                onValueChange = { onSettingsChange(settings.copy(cornerRadius = it.toInt())) },
                valueRange = 0f..40f
            )
            Text("${settings.cornerRadius} dp", style = MaterialTheme.typography.bodySmall)
        }

        Group("Font colour") {
            ColorRow(
                presets = fontPresets,
                selected = settings.fontColor,
                onSelect = { onSettingsChange(settings.copy(fontColor = it)) }
            )
            RgbSliders(settings.fontColor) { onSettingsChange(settings.copy(fontColor = it)) }
        }

        Group("Font size") {
            ChipRow(
                options = listOf("small" to "Small", "medium" to "Medium", "large" to "Large", "custom" to "Custom"),
                selected = settings.fontSize,
                onSelect = { onSettingsChange(settings.copy(fontSize = it)) }
            )
            if (settings.fontSize == "custom") {
                Slider(
                    value = settings.customFontSize,
                    onValueChange = { onSettingsChange(settings.copy(customFontSize = it)) },
                    valueRange = 10f..32f
                )
                Text("${settings.customFontSize.toInt()} sp", style = MaterialTheme.typography.bodySmall)
            }
        }

        Group("Font style") {
            ChipRow(
                options = listOf(
                    "default" to "Default",
                    "serif" to "Serif",
                    "devanagari" to "Devanagari"
                ),
                selected = settings.fontStyle,
                onSelect = { onSettingsChange(settings.copy(fontStyle = it)) }
            )
        }

        Group("Widget size") {
            ChipRow(
                options = listOf("2x2" to "2x2", "4x2" to "4x2", "4x4" to "4x4"),
                selected = settings.widgetSize,
                onSelect = { onSettingsChange(settings.copy(widgetSize = it)) }
            )
        }

        Group("Behaviour") {
            ToggleRow("Change on tap", settings.changeOnTap) {
                onSettingsChange(settings.copy(changeOnTap = it))
            }
            ToggleRow("Repeat from the start", settings.repeat) {
                onSettingsChange(settings.copy(repeat = it))
            }
        }

        Group("Live preview") {
            WidgetPreview(settings)
        }
    }
}

@Composable
private fun Group(title: String, content: @Composable () -> Unit) {
    Spacer(Modifier.height(16.dp))
    Text(title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
    Spacer(Modifier.height(8.dp))
    content()
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ChipRow(
    options: List<Pair<String, String>>,
    selected: String,
    onSelect: (String) -> Unit
) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        options.forEach { (value, label) ->
            FilterChip(
                selected = value == selected,
                onClick = { onSelect(value) },
                label = { Text(label) }
            )
        }
    }
}

@Composable
private fun ColorRow(presets: List<Long>, selected: Long, onSelect: (Long) -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        presets.forEach { argb ->
            Box(
                Modifier
                    .size(32.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(argb.toInt()))
                    .border(
                        width = if (argb == selected) 3.dp else 1.dp,
                        color = if (argb == selected) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.outline,
                        shape = RoundedCornerShape(8.dp)
                    )
                    .clickable { onSelect(argb) }
            )
        }
    }
}

@Composable
private fun RgbSliders(value: Long, onChange: (Long) -> Unit) {
    val a = ((value shr 24) and 0xFF).toInt()
    val r = ((value shr 16) and 0xFF).toInt()
    val g = ((value shr 8) and 0xFF).toInt()
    val b = (value and 0xFF).toInt()
    fun pack(rr: Int, gg: Int, bb: Int, aa: Int): Long =
        (aa.toLong() shl 24) or (rr.toLong() shl 16) or (gg.toLong() shl 8) or bb.toLong()

    Column {
        Text("R", style = MaterialTheme.typography.bodySmall)
        Slider(value = r.toFloat(), onValueChange = { onChange(pack(it.toInt(), g, b, a)) }, valueRange = 0f..255f)
        Text("G", style = MaterialTheme.typography.bodySmall)
        Slider(value = g.toFloat(), onValueChange = { onChange(pack(r, it.toInt(), b, a)) }, valueRange = 0f..255f)
        Text("B", style = MaterialTheme.typography.bodySmall)
        Slider(value = b.toFloat(), onValueChange = { onChange(pack(r, g, it.toInt(), a)) }, valueRange = 0f..255f)
    }
}

@Composable
private fun ToggleRow(label: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(
        Modifier.fillMaxWidth().padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, Modifier.weight(1f))
        Switch(checked = checked, onCheckedChange = onChange)
    }
}

@Composable
fun WidgetPreview(settings: WidgetSettings) {
    val bg = Color(settings.bgColor.toInt()).copy(alpha = settings.bgAlpha / 100f)
    val fg = Color(settings.fontColor.toInt())
    val radius = settings.cornerRadius.dp
    val padding = when (settings.widgetSize) {
        "2x2" -> 10.dp
        "4x4" -> 18.dp
        else -> 14.dp
    }
    val sample = when (settings.displayMode) {
        "original" -> "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"
        "transliteration" -> "karmaṇy-evādhikāras te mā phaleṣu kadācana"
        "summary1" -> "Do your duty; do not be attached to the result."
        "summary2to3" -> "Act with full effort, but release your grip on the outcome."
        "bodh" -> "Do the work well, then let it go."
        else -> "You have a right to your actions alone, never to the fruits of them."
    }
    val ff = when (settings.fontStyle) {
        "serif" -> FontFamily.Serif
        "devanagari" -> FontFamily.SansSerif
        else -> FontFamily.Default
    }
    Box(
        Modifier
            .fillMaxWidth()
            .height(if (settings.widgetSize == "4x4") 200.dp else 130.dp)
            .clip(RoundedCornerShape(radius))
            .background(bg)
            .padding(padding),
        contentAlignment = Alignment.Center
    ) {
        Text(
            sample,
            color = fg,
            fontSize = settings.effectiveFontSize.sp,
            fontFamily = ff,
            fontWeight = FontWeight.Medium
        )
    }
}
