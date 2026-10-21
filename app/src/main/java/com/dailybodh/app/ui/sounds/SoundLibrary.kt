package com.dailybodh.app.ui.sounds

import android.content.Context
import java.io.File

/** One playable sound: either bundled in assets/sounds or imported by the user. */
data class SoundItem(
    val path: String,
    val displayName: String,
    val bundled: Boolean
)

/**
 * Bundled tones are synthesised originals that ship in assets/sounds.
 * Imported tones live in the app's private files/sounds directory, so the user
 * can add their own recordings without rebuilding the app and without any
 * storage permission.
 */
object SoundLibrary {

    private const val ASSET_DIR = "sounds"
    private val AUDIO_EXT = listOf(".ogg", ".wav", ".mp3", ".m4a", ".opus")

    fun bundled(context: Context): List<SoundItem> =
        (context.assets.list(ASSET_DIR) ?: emptyArray())
            .filter { name -> AUDIO_EXT.any { name.lowercase().endsWith(it) } }
            .sorted()
            .map { SoundItem("$ASSET_DIR/$it", pretty(it), bundled = true) }

    fun userDir(context: Context): File = File(context.filesDir, "sounds").apply { mkdirs() }

    fun imported(context: Context): List<SoundItem> =
        (userDir(context).listFiles() ?: emptyArray())
            .filter { it.isFile && AUDIO_EXT.any { ext -> it.name.lowercase().endsWith(ext) } }
            .sortedBy { it.name.lowercase() }
            .map { SoundItem(it.absolutePath, pretty(it.name), bundled = false) }

    fun all(context: Context): List<SoundItem> = bundled(context) + imported(context)

    private fun pretty(fileName: String): String =
        fileName.substringBeforeLast('.')
            .replace('_', ' ')
            .replace('-', ' ')
            .trim()
            .replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
}
