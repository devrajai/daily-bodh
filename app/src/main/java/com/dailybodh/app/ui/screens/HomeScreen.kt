package com.dailybodh.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.produceState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dailybodh.app.data.ContentPicker
import com.dailybodh.app.data.model.ContentItem
import com.dailybodh.app.ui.MainViewModel
import com.dailybodh.app.ui.favKey
import java.time.LocalDate

@Composable
fun HomeScreen(vm: MainViewModel, nav: NavController) {
    var packId by remember { mutableStateOf("gita") }
    val today = remember { LocalDate.now() }

    val item by produceState<ContentItem?>(initialValue = null, packId) {
        val pack = vm.content.pack(packId)
        value = ContentPicker.itemForDay(pack, today, repeat = true)
    }
    val favorites by vm.favorites.collectAsStateCompat()

    Scaffold(
        bottomBar = { BottomBar(nav, current = "home") }
    ) { pad ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(pad)
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text("Today", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(4.dp))
            Text(
                today.toString(),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(12.dp))

            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(vm.packNames) { (id, name) ->
                    AssistChip(
                        onClick = { packId = id },
                        label = { Text(name) }
                    )
                }
            }
            Spacer(Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                AssistChip(onClick = { nav.navigate("panchang") }, label = { Text("Panchang") })
                AssistChip(onClick = { nav.navigate("rashifal") }, label = { Text("Rashifal") })
                AssistChip(onClick = { nav.navigate("match") }, label = { Text("Match") })
                AssistChip(onClick = { nav.navigate("numerology") }, label = { Text("Numerology") })
            }
            Spacer(Modifier.height(16.dp))

            val current = item
            if (current == null) {
                Text("Loading content...")
            } else {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(18.dp)) {
                        Text(
                            current.reference ?: vm.packNames.first { it.first == packId }.second,
                            style = MaterialTheme.typography.labelLarge,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(Modifier.height(10.dp))
                        Text(
                            text = current.sanskrit ?: current.text ?: "",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                        if (!current.transliteration.isNullOrBlank()) {
                            Spacer(Modifier.height(8.dp))
                            Text(
                                current.transliteration!!,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Spacer(Modifier.height(12.dp))
                        Text(
                            current.translations["en"] ?: "",
                            style = MaterialTheme.typography.bodyLarge
                        )
                        Spacer(Modifier.height(16.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(onClick = { vm.toggleFavorite(packId, current.id) }) {
                                val fav = favKey(packId, current.id) in favorites
                                Icon(
                                    if (fav) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                                    contentDescription = "Favorite",
                                    tint = MaterialTheme.colorScheme.primary
                                )
                            }
                            Spacer(Modifier.weight(1f))
                            AssistChip(
                                onClick = { nav.navigate("detail/$packId/${current.id}") },
                                label = { Text("Open") }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun BottomBar(nav: NavController, current: String) {
    val items = listOf(
        Triple("home", "Home", Icons.Filled.FavoriteBorder),
        Triple("library", "Library", Icons.Filled.FavoriteBorder),
        Triple("widget", "Widget", Icons.Filled.FavoriteBorder),
        Triple("favorites", "Favorites", Icons.Filled.Favorite),
        Triple("sounds", "Sounds", Icons.Filled.FavoriteBorder),
        Triple("about", "About", Icons.Filled.FavoriteBorder)
    )
    NavigationBar {
        items.forEach { (route, label, icon) ->
            NavigationBarItem(
                selected = current == route,
                onClick = { nav.navigate(route) { launchSingleTop = true } },
                icon = { Icon(icon, contentDescription = label) },
                label = { Text(label) }
            )
        }
    }
}
