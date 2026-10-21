package com.dailybodh.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val Indigo = Color(0xFF1A237E)
private val IndigoLight = Color(0xFF534BAE)
private val Sand = Color(0xFFF6F3EC)

private val LightColors = lightColorScheme(
    primary = Indigo,
    onPrimary = Color.White,
    secondary = IndigoLight,
    background = Sand,
    surface = Color.White,
    onBackground = Color(0xFF1B1B1F),
    onSurface = Color(0xFF1B1B1F)
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFB9C3FF),
    onPrimary = Color(0xFF12143A),
    secondary = Color(0xFFC5C6D8),
    background = Color(0xFF121317),
    surface = Color(0xFF1B1C21),
    onBackground = Color(0xFFE4E1E6),
    onSurface = Color(0xFFE4E1E6)
)

@Composable
fun DailyBodhTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        content = content
    )
}
