package com.dailybodh.app.update

/**
 * Where the updater looks for a new version. The manifest and the APK are served
 * by the project's GitHub Pages site, so no API keys or tokens are involved.
 */
object UpdateConfig {
    const val BASE_URL = "https://devrajai.github.io/daily-bodh/download/"
    const val MANIFEST_URL = BASE_URL + "latest.json"
    const val APK_FILE = "DailyBodh-updater.apk"
}
