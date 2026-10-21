package com.dailybodh.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dailybodh.app.BuildConfig
import com.dailybodh.app.ui.MainViewModel
import com.dailybodh.app.update.Updater
import kotlinx.coroutines.launch

@Composable
fun AboutScreen(vm: MainViewModel, nav: NavController) {
    val theme by vm.globalTheme.collectAsStateCompat()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var status by remember { mutableStateOf<String?>(null) }
    var checking by remember { mutableStateOf(false) }

    Scaffold(bottomBar = { BottomBar(nav, current = "about") }) { pad ->
        Column(Modifier.fillMaxSize().padding(pad).padding(20.dp)) {
            Text("About Daily Bodh", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(16.dp))

            if (BuildConfig.UPDATE_CHECKS_ENABLED) {
                Text(
                    "Your content is fully offline. This build also checks for updates.",
                    style = MaterialTheme.typography.titleMedium
                )
                Spacer(Modifier.height(12.dp))
                Text(
                    "Every shloka and thought ships inside the app, and your settings stay on " +
                        "this device. The only network use is the update check: once a night it " +
                        "fetches a small version file and, if a newer build exists, downloads it " +
                        "and asks you to install it. There are no accounts, no ads, no trackers " +
                        "and no analytics.",
                    style = MaterialTheme.typography.bodyLarge
                )
                Spacer(Modifier.height(24.dp))
                Text("Updates", style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.height(6.dp))
                Text(
                    "Version ${BuildConfig.VERSION_NAME} (${BuildConfig.VERSION_CODE})",
                    style = MaterialTheme.typography.bodyMedium
                )
                Spacer(Modifier.height(10.dp))
                Button(
                    onClick = {
                        checking = true
                        scope.launch {
                            status = Updater.checkNow(context)
                            checking = false
                        }
                    },
                    enabled = !checking
                ) {
                    Text(if (checking) "Checking\u2026" else "Check for updates now")
                }
                status?.let {
                    Spacer(Modifier.height(10.dp))
                    Text(it, style = MaterialTheme.typography.bodyMedium)
                }
            } else {
                Text(
                    "No data is collected. Works fully offline.",
                    style = MaterialTheme.typography.titleMedium
                )
                Spacer(Modifier.height(12.dp))
                Text(
                    "This build has no internet permission. It cannot send anything anywhere. " +
                        "All content ships inside the app and all your settings stay on this " +
                        "device. There are no accounts, no ads, no trackers and no analytics.",
                    style = MaterialTheme.typography.bodyLarge
                )
            }

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
