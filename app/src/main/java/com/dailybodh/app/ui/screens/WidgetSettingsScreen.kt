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
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.glance.GlanceId
import androidx.navigation.NavController
import com.dailybodh.app.data.WidgetSettings
import com.dailybodh.app.ui.MainViewModel
import com.dailybodh.app.ui.components.WidgetCustomizer
import com.dailybodh.app.widget.DailyBodhWidget
import com.dailybodh.app.widget.WidgetStateStore
import kotlinx.coroutines.launch

@Composable
fun WidgetSettingsScreen(vm: MainViewModel, nav: NavController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var targets by remember { mutableStateOf<List<GlanceId>>(emptyList()) }
    var selected by remember { mutableIntStateOf(-1) } // -1 = defaults
    var settings by remember { mutableStateOf(WidgetSettings()) }

    LaunchedEffect(Unit) {
        targets = WidgetStateStore.glanceIds(context)
        settings = vm.defaultSettings()
    }
    LaunchedEffect(selected, targets) {
        settings = if (selected < 0 || selected >= targets.size) vm.defaultSettings()
        else WidgetStateStore.readSettings(context, targets[selected])
    }

    Scaffold(bottomBar = { BottomBar(nav, current = "widget") }) { pad ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(pad)
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text("Widget settings", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(6.dp))
            Text(
                "Choose what to style. Every widget on your home screen can look different.",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(Modifier.height(12.dp))

            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                item {
                    AssistChip(
                        onClick = { selected = -1 },
                        label = { Text("Defaults") }
                    )
                }
                items(targets.size) { idx ->
                    AssistChip(
                        onClick = { selected = idx },
                        label = { Text("Widget ${idx + 1}") }
                    )
                }
            }

            Spacer(Modifier.height(16.dp))
            WidgetCustomizer(
                settings = settings,
                onSettingsChange = { settings = it }
            )

            Spacer(Modifier.height(20.dp))
            Button(
                modifier = Modifier.fillMaxWidth(),
                onClick = {
                    scope.launch {
                        if (selected < 0 || selected >= targets.size) {
                            vm.saveDefaultSettings(settings)
                        } else {
                            val id = targets[selected]
                            WidgetStateStore.writeSettings(context, id, settings)
                            DailyBodhWidget().update(context, id)
                        }
                    }
                }
            ) { Text("Save") }
        }
    }
}
