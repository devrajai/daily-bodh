package com.dailybodh.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dailybodh.app.data.model.ContentItem
import com.dailybodh.app.ui.MainViewModel
import com.dailybodh.app.ui.favItem
import com.dailybodh.app.ui.favPack

@Composable
fun FavoritesScreen(vm: MainViewModel, nav: NavController) {
    val favorites by vm.favorites.collectAsStateCompat()

    val resolved by produceState<List<Pair<String, ContentItem>>>(initialValue = emptyList(), favorites) {
        val out = mutableListOf<Pair<String, ContentItem>>()
        for (key in favorites) {
            val pid = favPack(key)
            vm.content.item(pid, favItem(key))?.let { out.add(pid to it) }
        }
        value = out
    }

    Scaffold(bottomBar = { BottomBar(nav, current = "favorites") }) { pad ->
        Column(Modifier.fillMaxSize().padding(pad).padding(16.dp)) {
            Text("Favorites", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(12.dp))
            if (resolved.isEmpty()) {
                Text("Nothing saved yet. Tap the heart on any item to keep it here.")
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(resolved, key = { it.first + it.second.id }) { (pid, item) ->
                        Column(
                            Modifier
                                .fillMaxWidth()
                                .clickable { nav.navigate("detail/$pid/${item.id}") }
                        ) {
                            Text(
                                item.reference ?: item.id,
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                item.summary1 ?: item.text ?: item.translations["en"] ?: "",
                                style = MaterialTheme.typography.bodyLarge,
                                maxLines = 2
                            )
                        }
                    }
                }
            }
        }
    }
}
