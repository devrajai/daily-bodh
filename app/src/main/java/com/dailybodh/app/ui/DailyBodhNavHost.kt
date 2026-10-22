package com.dailybodh.app.ui

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.dailybodh.app.ui.screens.AboutScreen
import com.dailybodh.app.ui.screens.DetailScreen
import com.dailybodh.app.ui.screens.FavoritesScreen
import com.dailybodh.app.ui.screens.HomeScreen
import com.dailybodh.app.ui.screens.MatchScreen
import com.dailybodh.app.ui.screens.NumerologyScreen
import com.dailybodh.app.ui.screens.PackLibraryScreen
import com.dailybodh.app.ui.screens.PanchangScreen
import com.dailybodh.app.ui.screens.RashifalScreen
import com.dailybodh.app.ui.screens.SoundsScreen
import com.dailybodh.app.ui.screens.WidgetSettingsScreen

@Composable
fun DailyBodhNavHost(vm: MainViewModel) {
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = "home") {
        composable("home") { HomeScreen(vm, nav) }
        composable("library") { PackLibraryScreen(vm, nav) }
        composable("widget") { WidgetSettingsScreen(vm, nav) }
        composable("favorites") { FavoritesScreen(vm, nav) }
        composable("sounds") { SoundsScreen(vm, nav) }
        composable("panchang") { PanchangScreen(vm, nav) }
        composable("rashifal") { RashifalScreen(vm, nav) }
        composable("match") { MatchScreen(vm, nav) }
        composable("numerology") { NumerologyScreen(vm, nav) }
        composable("about") { AboutScreen(vm, nav) }
        composable(
            "detail/{packId}/{itemId}",
            arguments = listOf(
                navArgument("packId") { type = NavType.StringType },
                navArgument("itemId") { type = NavType.StringType }
            )
        ) { entry ->
            val packId = entry.arguments?.getString("packId") ?: "gita"
            val itemId = entry.arguments?.getString("itemId") ?: ""
            DetailScreen(vm, nav, packId, itemId)
        }
    }
}
