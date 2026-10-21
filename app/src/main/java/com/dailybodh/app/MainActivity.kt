package com.dailybodh.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.dailybodh.app.data.SettingsRepository
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
            DailyBodhTheme(darkTheme = dark) {
                DailyBodhNavHost(vm = vm)
            }
        }
    }
}
