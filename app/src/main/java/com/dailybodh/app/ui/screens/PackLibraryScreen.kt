package com.dailybodh.app.ui.screens

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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dailybodh.app.data.model.ContentItem
import com.dailybodh.app.ui.MainViewModel
import com.dailybodh.app.ui.favKey

@Composable
fun PackLibraryScreen(vm: MainViewModel, nav: NavController) {
    var packId by remember { mutableStateOf("gita") }
    var query by remember { mutableStateOf("") }
    val favorites by vm.favorites.collectAsStateCompat()

    val all by produceState<List<ContentItem>>(initialValue = emptyList(), packId) {
        value = vm.content.items(packId)
    }
    val shown = remember(all, query) {
        if (query.isBlank()) all
        else all.filter { it.matches(query) }
    }

    Scaffold(bottomBar = { BottomBar(nav, current = "library") }) { pad ->
        Column(Modifier.fillMaxSize().padding(pad).padding(16.dp)) {
            Text("Pack library", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(12.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(vm.packNames) { (id, name) ->
                    AssistChip(onClick = { packId = id }, label = { Text(name) })
                }
            }
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                label = { Text("Search this pack") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(12.dp))
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(shown, key = { it.id }) { item ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { nav.navigate("detail/$packId/${item.id}") }
                            .padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(Modifier.weight(1f)) {
                            Text(
                                item.reference ?: item.id,
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                item.summary1 ?: item.text ?: item.translations["en"] ?: "",
                                style = MaterialTheme.typography.bodyLarge,
                                fontWeight = FontWeight.Medium,
                                maxLines = 2
                            )
                        }
                        IconButton(onClick = { vm.toggleFavorite(packId, item.id) }) {
                            val fav = favKey(packId, item.id) in favorites
                            Icon(
                                if (fav) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                                contentDescription = "Favorite"
                            )
                        }
                    }
                }
            }
        }
    }
}

fun ContentItem.matches(q: String): Boolean {
    val needle = q.trim().lowercase()
    if (needle.isEmpty()) return true
    return listOfNotNull(sanskrit, transliteration, text, author, summary1, translations["en"])
        .any { it.lowercase().contains(needle) }
}
