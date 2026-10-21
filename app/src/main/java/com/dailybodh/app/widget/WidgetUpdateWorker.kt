package com.dailybodh.app.widget

import android.content.Context
import androidx.glance.appwidget.updateAll
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters

/** Re-renders every widget so the day's content rolls over at midnight. */
class WidgetUpdateWorker(
    appContext: Context,
    params: WorkerParameters
) : CoroutineWorker(appContext, params) {
    override suspend fun doWork(): Result {
        return runCatching {
            DailyBodhWidget().updateAll(applicationContext)
            Result.success()
        }.getOrElse { Result.retry() }
    }
}
