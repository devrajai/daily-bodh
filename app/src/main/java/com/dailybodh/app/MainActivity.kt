package com.dailybodh.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.dailybodh.app.ui.DailyBodhNavHost
import com.dailybodh.app.ui.MainViewModel
import com.dailybodh.app.ui.theme.DailyBodhTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val vm: MainViewModel = viewModel()
            val globalTheme by vm.globalTheme.collectAsStateWithLifecycle(initialValue = "auto")
            val dark = when (globalTheme) {
                "light" -> false
                "dark" -> true
                else -> isSystemInDarkTheme()
            }
            // Only the updater build posts notifications, so only it asks.
            if (BuildConfig.UPDATE_CHECKS_ENABLED) {
                AskForNotificationPermission()
            }
            DailyBodhTheme(darkTheme = dark) {
                DailyBodhNavHost(vm = vm)
            }
        }
    }
}

@Composable
private fun AskForNotificationPermission() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return
    val context = LocalContext.current
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { /* the update notification simply will not show if declined */ }
    LaunchedEffect(Unit) {
        val granted = ContextCompat.checkSelfPermission(
            context, Manifest.permission.POST_NOTIFICATIONS
        ) == PackageManager.PERMISSION_GRANTED
        if (!granted) launcher.launch(Manifest.permission.POST_NOTIFICATIONS)
    }
}
