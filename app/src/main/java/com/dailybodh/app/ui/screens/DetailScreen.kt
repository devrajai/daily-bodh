package com.dailybodh.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dailybodh.app.data.model.ContentItem
import com.dailybodh.app.ui.MainViewModel
import com.dailybodh.app.ui.favKey
import com.dailybodh.app.util.ShareAsImage

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailScreen(vm: MainViewModel, nav: NavController, packId: String, itemId: String) {
    val context = LocalContext.current
    val item by produceState<ContentItem?>(initialValue = null, itemId) {
        value = vm.item(packId, itemId)
    }
    val favorites by vm.favorites.collectAsStateCompat()
    val fav = favKey(packId, itemId) in favorites

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(item?.reference ?: item?.text?.take(48) ?: "Daily Bodh") },
                navigationIcon = {
                    IconButton(onClick = { nav.popBackStack() }) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { pad ->
        val current = item ?: return@Scaffold
        Column(
            Modifier
                .fillMaxSize()
                .padding(pad)
                .padding(20.dp)
                .verticalScroll(rememberScrollState())
        ) {
            if (!current.sanskrit.isNullOrBlank()) {
                Text(
                    current.sanskrit!!,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(Modifier.height(10.dp))
            }
            if (!current.transliteration.isNullOrBlank()) {
                Text(
                    current.transliteration!!,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(Modifier.height(14.dp))
            }
            Section("Meaning", current.translations["en"] ?: current.text ?: "")
            current.translations["hi"]?.takeIf { it.isNotBlank() }?.let { Section("हिन्दी", it) }
            current.summary1?.let { Section("In one line", it) }
            current.summary2to3?.let { Section("In brief", it) }
            current.bodh3to4?.let { Section("Bodh", it) }
            current.author?.let {
                Spacer(Modifier.height(8.dp))
                Text(it, style = MaterialTheme.typography.labelMedium)
            }

            if (current.samagri.isNotEmpty()) {
                Spacer(Modifier.height(18.dp))
                Text(
                    "You will need",
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(Modifier.height(6.dp))
                current.samagri.forEach { entry ->
                    Text("\u2022  $entry", style = MaterialTheme.typography.bodyMedium)
                }
            }
            if (current.steps.isNotEmpty()) {
                Spacer(Modifier.height(18.dp))
                Text(
                    "Steps",
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(Modifier.height(6.dp))
                current.steps.forEachIndexed { index, step ->
                    Text("${index + 1}.  $step", style = MaterialTheme.typography.bodyMedium)
                }
            }

            Spacer(Modifier.height(20.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedButton(onClick = { vm.toggleFavorite(packId, itemId) }) {
                    Icon(
                        if (fav) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                        contentDescription = null
                    )
                    Text(if (fav) "  Saved" else "  Favorite")
                }
                Button(onClick = { ShareAsImage.share(context, current) }) {
                    Icon(Icons.Filled.Share, contentDescription = null)
                    Text("  Share")
                }
            }
        }
    }
}

@Composable
private fun Section(title: String, body: String) {
    if (body.isBlank()) return
    Spacer(Modifier.height(14.dp))
    Text(
        title,
        style = MaterialTheme.typography.labelLarge,
        color = MaterialTheme.colorScheme.primary
    )
    Spacer(Modifier.height(4.dp))
    Text(body, style = MaterialTheme.typography.bodyLarge)
}
