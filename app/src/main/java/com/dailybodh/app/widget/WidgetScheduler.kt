package com.dailybodh.app.widget

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.time.Duration
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.concurrent.TimeUnit

object WidgetScheduler {

    private const val WORK_NAME = "daily_bodh_midnight_refresh"

    fun scheduleMidnightRefresh(context: Context) {
        val now = LocalDateTime.now()
        var next = now.toLocalDate().atTime(LocalTime.of(0, 5))
        if (!next.isAfter(now)) next = next.plusDays(1)
        val delayMinutes = Duration.between(now, next).toMinutes().coerceAtLeast(1)

        val request = PeriodicWorkRequestBuilder<WidgetUpdateWorker>(1, TimeUnit.DAYS)
            .setInitialDelay(delayMinutes, TimeUnit.MINUTES)
            .setConstraints(Constraints.NONE)
            .build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            WORK_NAME,
            ExistingPeriodicWorkPolicy.KEEP,
            request
        )
    }
}
