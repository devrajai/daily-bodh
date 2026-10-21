package com.dailybodh.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.AssistChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dailybodh.app.ui.MainViewModel

@Composable
fun AboutScreen(vm: MainViewModel, nav: NavController) {
    val theme by vm.globalTheme.collectAsStateCompat()
    Scaffold(bottomBar = { BottomBar(nav, current = "about") }) { pad ->
        Column(Modifier.fillMaxSize().padding(pad).padding(20.dp)) {
            Text("About Daily Bodh", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(16.dp))
            Text(
                "No data is collected. Works fully offline.",
                style = MaterialTheme.typography.titleMedium
            )
            Spacer(Modifier.height(12.dp))
            Text(
                "This app has no internet permission. It cannot send anything anywhere. " +
                    "All content ships inside the app and all your settings stay on this device. " +
                    "There are no accounts, no ads, no trackers and no analytics.",
                style = MaterialTheme.typography.bodyLarge
            )
            Spacer(Modifier.height(24.dp))
            Text("Appearance", style = MaterialTheme.typography.titleMedium)
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("light" to "Light", "dark" to "Dark", "auto" to "Auto").forEach { (v, label) ->
                    AssistChip(
                        onClick = { vm.setGlobalTheme(v) },
                        label = { Text(if (theme == v) "$label *" else label) }
                    )
                }
            }
        }
    }
}
