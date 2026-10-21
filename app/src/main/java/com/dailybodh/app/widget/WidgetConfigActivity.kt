package com.dailybodh.app.widget

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.lifecycle.lifecycleScope
import com.dailybodh.app.data.SettingsRepository
import com.dailybodh.app.data.WidgetSettings
import com.dailybodh.app.ui.MainViewModel
import com.dailybodh.app.ui.components.WidgetCustomizer
import com.dailybodh.app.ui.theme.DailyBodhTheme
import kotlinx.coroutines.launch

/**
 * Opened when a widget is first placed (and again whenever it is reconfigured).
 * Lets the user pick the pack and look for that specific widget instance.
 */
class WidgetConfigActivity : ComponentActivity() {

    private var appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        appWidgetId = intent?.extras?.getInt(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID
        ) ?: AppWidgetManager.INVALID_APPWIDGET_ID

        // Cancel by default, so backing out leaves the widget untouched.
        setResult(Activity.RESULT_CANCELED)

        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish()
            return
        }

        val defaults = SettingsRepository(this)
        setContent {
            DailyBodhTheme {
                Surface(Modifier.fillMaxSize()) {
                    ConfigContent(
                        onSave = { settings -> persistAndFinish(settings) },
                        loadDefaults = { defaults.current(MainViewModel.DEFAULT_WIDGET_ID) }
                    )
                }
            }
        }
    }

    private fun persistAndFinish(settings: WidgetSettings) {
        val id = appWidgetId
        lifecycleScope.launch {
            val glanceId = GlanceAppWidgetManager(this@WidgetConfigActivity).getGlanceIdBy(id)
            WidgetStateStore.writeSettings(this@WidgetConfigActivity, glanceId, settings)
            DailyBodhWidget().update(this@WidgetConfigActivity, glanceId)
            setResult(
                Activity.RESULT_OK,
                Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, id)
            )
            finish()
        }
    }
}

@Composable
private fun ConfigContent(
    onSave: (WidgetSettings) -> Unit,
    loadDefaults: suspend () -> WidgetSettings
) {
    var settings by remember { mutableStateOf(WidgetSettings()) }
    var loaded by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        settings = loadDefaults()
        loaded = true
    }

    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Text("Set up your widget", style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(4.dp))
        Text(
            "Pick a pack, a language and a look. You can change all of this later.",
            style = MaterialTheme.typography.bodyMedium
        )
        Spacer(Modifier.height(12.dp))

        if (loaded) {
            WidgetCustomizer(settings = settings, onSettingsChange = { settings = it })
        }

        Spacer(Modifier.height(20.dp))
        Button(
            modifier = Modifier.fillMaxWidth(),
            onClick = { onSave(settings) }
        ) { Text("Add widget") }
        Spacer(Modifier.height(24.dp))
    }
}
