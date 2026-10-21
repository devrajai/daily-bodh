package com.dailybodh.app.update

import android.content.Context

/**
 * Offline flavour. Nothing here touches the network - in fact this build has no
 * INTERNET permission and no HTTP code compiled in at all.
 */
object Updater {
    const val isEnabled: Boolean = false

    fun onAppStart(context: Context) {
        // Intentionally empty.
    }

    suspend fun checkNow(context: Context): String =
        "This is the offline build, so it never checks for updates."
}
