package com.dailybodh.app.update

import kotlinx.serialization.Serializable

/** Shape of download/latest.json published by the build. */
@Serializable
data class UpdateInfo(
    val versionCode: Int = 0,
    val versionName: String = "",
    val apk: String = "",
    val notes: String = ""
)
