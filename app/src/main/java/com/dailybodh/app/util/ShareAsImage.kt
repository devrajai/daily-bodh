package com.dailybodh.app.util

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.text.StaticLayout
import android.text.TextPaint
import androidx.core.content.FileProvider
import com.dailybodh.app.data.model.ContentItem
import java.io.File
import java.io.FileOutputStream

/**
 * Renders an item to a square PNG in the app cache and hands it to the system
 * share sheet. No network is involved; the image is written to local storage.
 */
object ShareAsImage {

    private const val SIZE = 1080

    fun share(context: Context, item: ContentItem) {
        val bitmap = render(item)
        val dir = File(context.cacheDir, "images").apply { mkdirs() }
        val file = File(dir, "daily_bodh_${item.id}.png")
        FileOutputStream(file).use { bitmap.compress(Bitmap.CompressFormat.PNG, 100, it) }

        val uri = FileProvider.getUriForFile(
            context,
            context.packageName + ".fileprovider",
            file
        )
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "image/png"
            putExtra(Intent.EXTRA_STREAM, uri)
            putExtra(Intent.EXTRA_TEXT, "Shared from Daily Bodh")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(Intent.createChooser(intent, "Share as image"))
    }

    private fun render(item: ContentItem): Bitmap {
        val bmp = Bitmap.createBitmap(SIZE, SIZE, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bmp)
        canvas.drawColor(Color.parseColor("#1A237E"))

        val margin = 90f
        var y = 150f

        val head = TextPaint().apply {
            color = Color.WHITE
            textSize = 40f
            isAntiAlias = true
        }
        val body = TextPaint().apply {
            color = Color.parseColor("#EDEAF6")
            textSize = 48f
            isAntiAlias = true
        }
        val small = TextPaint().apply {
            color = Color.parseColor("#B9C3FF")
            textSize = 34f
            isAntiAlias = true
        }

        item.reference?.let {
            canvas.drawText(it, margin, y, head)
            y += 70f
        }

        val primary = item.sanskrit ?: item.text ?: item.translations["en"] ?: ""
        if (primary.isNotBlank()) {
            y = drawWrapped(canvas, primary, body, margin, y, (SIZE - 2 * margin).toInt())
            y += 30f
        }
        val meaning = item.translations["en"] ?: ""
        if (meaning.isNotBlank() && meaning != primary) {
            y = drawWrapped(canvas, meaning, body, margin, y, (SIZE - 2 * margin).toInt())
            y += 24f
        }
        item.summary1?.let {
            y = drawWrapped(canvas, it, small, margin, y, (SIZE - 2 * margin).toInt())
        }

        val footer = Paint().apply { color = Color.parseColor("#B9C3FF"); textSize = 30f; isAntiAlias = true }
        canvas.drawText("Daily Bodh", margin, SIZE - 60f, footer)
        return bmp
    }

    private fun drawWrapped(
        canvas: Canvas,
        text: String,
        paint: TextPaint,
        x: Float,
        y: Float,
        width: Int
    ): Float {
        val layout = StaticLayout.Builder
            .obtain(text, 0, text.length, paint, width)
            .setLineSpacing(0f, 1.15f)
            .build()
        canvas.save()
        canvas.translate(x, y)
        layout.draw(canvas)
        canvas.restore()
        return y + layout.height + 10f
    }
}
