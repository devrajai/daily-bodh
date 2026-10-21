package com.dailybodh.app.update

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.FileProvider
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.dailybodh.app.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.time.Duration
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.concurrent.TimeUnit

/**
 * Updater flavour only. Once a day (shortly after 2am, and only when there is a
 * connection) it fetches download/latest.json, and if the published build is
 * newer than this one it downloads the APK and posts a notification.
 *
 * Android never lets an app install an APK silently, so the last step is always
 * the user tapping the notification and confirming in the system installer.
 */
object Updater {
    const val isEnabled: Boolean = true

    private const val WORK_NAME = "daily_bodh_update_check"
    private const val CHANNEL_ID = "updates"
    private const val NOTIFICATION_ID = 4711

    fun onAppStart(context: Context) {
        val request = PeriodicWorkRequestBuilder<UpdateWorker>(1, TimeUnit.DAYS)
            .setInitialDelay(minutesUntilNightlyCheck(), TimeUnit.MINUTES)
            .setConstraints(
                Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()
            )
            .build()
        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            WORK_NAME, ExistingPeriodicWorkPolicy.KEEP, request
        )
    }

    private fun minutesUntilNightlyCheck(): Long {
        val now = LocalDateTime.now()
        var next = now.toLocalDate().atTime(LocalTime.of(2, 0))
        if (!next.isAfter(now)) next = next.plusDays(1)
        return Duration.between(now, next).toMinutes().coerceAtLeast(1)
    }

    /** Returns a short human-readable status for the About screen. */
    suspend fun checkNow(context: Context): String = withContext(Dispatchers.IO) {
        try {
            val info = fetchManifest() ?: return@withContext "Could not reach the update server."
            if (info.versionCode <= BuildConfig.VERSION_CODE) {
                return@withContext "You are on the latest version (${BuildConfig.VERSION_NAME})."
            }
            val apk = download(context, info) ?: return@withContext "Download failed."
            notifyReady(context, info, apk)
            "Downloaded ${info.versionName}. Tap the notification to install."
        } catch (t: Throwable) {
            "Update check failed: ${t.message ?: t.javaClass.simpleName}"
        }
    }

    private fun fetchManifest(): UpdateInfo? {
        val conn = (URL(UpdateConfig.MANIFEST_URL).openConnection() as HttpURLConnection).apply {
            connectTimeout = 15_000
            readTimeout = 15_000
            requestMethod = "GET"
        }
        conn.inputStream.use { stream ->
            val text = stream.bufferedReader().readText()
            return Json { ignoreUnknownKeys = true }
                .decodeFromString(UpdateInfo.serializer(), text)
        }
    }

    private fun download(context: Context, info: UpdateInfo): File? {
        val dir = File(context.cacheDir, "updates").apply { mkdirs() }
        val fileName = info.apk.ifBlank { UpdateConfig.APK_FILE }
        val out = File(dir, "DailyBodh-${info.versionName}.apk")
        if (out.exists() && out.length() > 0) return out
        val conn = (URL(UpdateConfig.BASE_URL + fileName).openConnection() as HttpURLConnection).apply {
            connectTimeout = 20_000
            readTimeout = 60_000
        }
        if (conn.responseCode != HttpURLConnection.HTTP_OK) return null
        conn.inputStream.use { input -> out.outputStream().use { input.copyTo(it) } }
        return out.takeIf { it.length() > 0 }
    }

    private fun notifyReady(context: Context, info: UpdateInfo, apk: File) {
        ensureChannel(context)
        val uri = FileProvider.getUriForFile(context, context.packageName + ".fileprovider", apk)
        val intent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, "application/vnd.android.package-archive")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        val pending = PendingIntent.getActivity(
            context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.stat_sys_download_done)
            .setContentTitle("Daily Bodh ${info.versionName} is ready")
            .setContentText("Tap to install the update.")
            .setAutoCancel(true)
            .setContentIntent(pending)
            .build()
        runCatching { NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification) }
    }

    private fun ensureChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = context.getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(
                NotificationChannel(CHANNEL_ID, "App updates", NotificationManager.IMPORTANCE_DEFAULT)
            )
        }
    }
}
