package com.dailybodh.app.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalSize
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.text.FontFamily
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextAlign
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import com.dailybodh.app.MainActivity
import com.dailybodh.app.data.ContentPicker
import com.dailybodh.app.data.ContentRepository
import com.dailybodh.app.data.Languages
import com.dailybodh.app.data.PackRegistry
import com.dailybodh.app.data.WidgetSettings
import com.dailybodh.app.data.model.ContentItem
import java.time.LocalDate

class DailyBodhWidget : GlanceAppWidget() {

    override val sizeMode: SizeMode = SizeMode.Exact

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val settings = WidgetStateStore.readSettings(context, id)
        val offset = WidgetStateStore.readOffset(context, id)
        val repo = ContentRepository(context)
        val pack = runCatching { repo.pack(settings.packId) }.getOrNull()
        val today = LocalDate.now()
        val item: ContentItem? = pack?.let {
            val base = ContentPicker.indexForDay(it, today, settings.repeat)
            val count = it.items.size
            if (count == 0) null else it.items[((base + offset) % count + count) % count]
        }

        provideContent {
            WidgetBody(settings = settings, item = item, packName = PackRegistry.displayName(settings.packId))
        }
    }

    @Composable
    private fun WidgetBody(settings: WidgetSettings, item: ContentItem?, packName: String) {
        val size: DpSize = LocalSize.current
        val compact = size.height < 150.dp
        val bg = Color(settings.bgColor.toInt())
        val bgWithAlpha = bg.copy(alpha = (settings.bgAlpha.coerceIn(0, 100)) / 100f)
        val fg = ColorProvider(Color(settings.fontColor.toInt()))

        Box(
            modifier = GlanceModifier
                .fillMaxSize()
                .cornerRadius(settings.cornerRadius.dp)
                .background(bgWithAlpha)
                .clickable(actionStartActivity<MainActivity>())
                .padding(if (compact) 8.dp else 14.dp),
            contentAlignment = Alignment.Center
        ) {
            if (item == null) {
                Text(
                    text = "No content yet. Open Daily Bodh to set up this widget.",
                    style = TextStyle(color = fg, fontSize = 14.sp, textAlign = TextAlign.Center)
                )
            } else {
                Column(
                    modifier = GlanceModifier.fillMaxSize(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    val (primary, secondary) = renderText(item, settings)
                    Text(
                        text = primary,
                        style = TextStyle(
                            color = fg,
                            fontSize = (settings.effectiveFontSize + if (compact) -2f else 0f).sp,
                            fontWeight = FontWeight.Medium,
                            textAlign = TextAlign.Center,
                            fontFamily = fontFamilyFor(settings.fontStyle)
                        ),
                        maxLines = if (compact) 4 else 8
                    )
                    if (!compact && secondary.isNotBlank()) {
                        Spacer(GlanceModifier.height(6.dp))
                        Text(
                            text = secondary,
                            style = TextStyle(
                                color = fg,
                                fontSize = (settings.effectiveFontSize - 3f).sp,
                                textAlign = TextAlign.Center,
                                fontFamily = fontFamilyFor(settings.fontStyle)
                            ),
                            maxLines = 4
                        )
                    }
                    Spacer(GlanceModifier.height(8.dp))
                    Row(
                        modifier = GlanceModifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = packName,
                            style = TextStyle(color = fg, fontSize = 11.sp),
                            modifier = GlanceModifier.defaultWeight()
                        )
                        if (settings.changeOnTap) {
                            Text(
                                text = "next \u203a",
                                style = TextStyle(color = fg, fontSize = 11.sp, fontWeight = FontWeight.Bold),
                                modifier = GlanceModifier
                                    .cornerRadius(10.dp)
                                    .background(bg.copy(alpha = 0.25f))
                                    .padding(horizontal = 8.dp, vertical = 2.dp)
                                    .clickable(actionRunCallback<NextItemAction>())
                            )
                        }
                    }
                }
            }
        }
    }

    private fun fontFamilyFor(style: String): FontFamily? = when (style) {
        "serif" -> FontFamily.Serif
        "devanagari" -> FontFamily.SansSerif
        else -> null
    }

    /** Returns (primary, secondary) for the chosen display mode + language. */
    private fun renderText(item: ContentItem, settings: WidgetSettings): Pair<String, String> {
        val lang = Languages.byCode(settings.language).code
        val translation = item.translations[lang] ?: item.translations["en"] ?: item.text ?: ""
        return when (settings.displayMode) {
            "original" -> (item.sanskrit ?: item.text ?: translation) to (item.reference ?: "")
            "transliteration" -> (item.transliteration ?: item.text ?: translation) to (item.reference ?: "")
            "summary1" -> (item.summary1 ?: translation) to (item.reference ?: "")
            "summary2to3" -> (item.summary2to3 ?: item.summary1 ?: translation) to (item.reference ?: "")
            "bodh" -> (item.bodh3to4 ?: item.summary2to3 ?: translation) to (item.reference ?: "")
            else -> translation to (item.reference ?: "")
        }
    }
}
