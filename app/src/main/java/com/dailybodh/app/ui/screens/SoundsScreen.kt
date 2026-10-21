package com.dailybodh.app.ui.screens

import android.content.Context
import android.content.Intent
import android.media.MediaPlayer
import android.net.Uri
import android.provider.OpenableColumns
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.content.FileProvider
import androidx.navigation.NavController
import com.dailybodh.app.ui.MainViewModel
import com.dailybodh.app.ui.sounds.SoundItem
import com.dailybodh.app.ui.sounds.SoundLibrary
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

@Composable
fun SoundsScreen(vm: MainViewModel, nav: NavController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var sounds by remember { mutableStateOf<List<SoundItem>>(emptyList()) }
    var playing by remember { mutableStateOf<String?>(null) }
    var player by remember { mutableStateOf<MediaPlayer?>(null) }
    var message by remember { mutableStateOf<String?>(null) }

    fun refresh() {
        sounds = SoundLibrary.all(context)
    }

    LaunchedEffect(Unit) { refresh() }
    DisposableEffect(Unit) {
        onDispose { player?.release() }
    }

    val importer = rememberLauncherForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri ->
        if (uri != null) {
            scope.launch {
                val saved = importSound(context, uri)
                message = if (saved != null) "Added ${saved.name}" else "Could not read that file."
                refresh()
            }
        }
    }

    fun play(item: SoundItem) {
        player?.release()
        player = null
        playing = null
        try {
            val mp = MediaPlayer()
            if (item.bundled) {
                context.assets.openFd(item.path).use { afd ->
                    mp.setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                }
            } else {
                mp.setDataSource(item.path)
            }
            mp.prepare()
            mp.setOnCompletionListener { playing = null }
            mp.start()
            player = mp
            playing = item.path
        } catch (t: Throwable) {
            message = "Could not play that: ${t.message ?: t.javaClass.simpleName}"
        }
    }

    Scaffold(bottomBar = { BottomBar(nav, current = "sounds") }) { pad ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(pad)
                .padding(16.dp)
        ) {
            Text("Temple sounds", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(6.dp))
            Text(
                "Bell, gong and conch tones synthesised for this app, plus anything you add yourself.",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(Modifier.height(14.dp))

            Button(onClick = { importer.launch(arrayOf("audio/*")) }) {
                Text("Add a sound from my device")
            }
            message?.let {
                Spacer(Modifier.height(8.dp))
                Text(it, style = MaterialTheme.typography.bodySmall)
            }
            Spacer(Modifier.height(14.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(sounds, key = { it.path }) { item ->
                    Card(Modifier.fillMaxWidth()) {
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .clickable { play(item) }
                                .padding(horizontal = 14.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Filled.PlayArrow,
                                contentDescription = "Play",
                                tint = MaterialTheme.colorScheme.primary
                            )
                            Column(Modifier.weight(1f).padding(start = 10.dp)) {
                                Text(
                                    item.displayName,
                                    fontWeight = FontWeight.Medium,
                                    style = MaterialTheme.typography.bodyLarge
                                )
                                Text(
                                    if (item.bundled) "Bundled tone" else "Your own file",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            if (playing == item.path) {
                                Text("playing", style = MaterialTheme.typography.labelSmall)
                            }
                            IconButton(onClick = { shareSound(context, item) }) {
                                Icon(Icons.Filled.Share, contentDescription = "Share")
                            }
                        }
                    }
                }
            }
        }
    }
}

private suspend fun importSound(context: Context, uri: Uri): File? = withContext(Dispatchers.IO) {
    runCatching {
        val name = displayName(context, uri) ?: "imported_${System.currentTimeMillis()}.audio"
        val target = File(SoundLibrary.userDir(context), name)
        context.contentResolver.openInputStream(uri)?.use { input ->
            target.outputStream().use { output -> input.copyTo(output) }
        }
        target.takeIf { it.exists() && it.length() > 0 }
    }.getOrNull()
}

private fun displayName(context: Context, uri: Uri): String? =
    runCatching {
        context.contentResolver.query(uri, null, null, null, null)?.use { cursor ->
            val index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            if (index >= 0 && cursor.moveToFirst()) cursor.getString(index) else null
        }
    }.getOrNull()

private fun shareSound(context: Context, item: SoundItem) {
    runCatching {
        val dir = File(context.cacheDir, "sounds").apply { mkdirs() }
        val file = File(dir, File(item.path).name)
        if (item.bundled) {
            context.assets.open(item.path).use { input ->
                file.outputStream().use { output -> input.copyTo(output) }
            }
        } else {
            File(item.path).copyTo(file, overwrite = true)
        }
        val uri = FileProvider.getUriForFile(context, context.packageName + ".fileprovider", file)
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "audio/*"
            putExtra(Intent.EXTRA_STREAM, uri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(Intent.createChooser(intent, "Share sound"))
    }
}
