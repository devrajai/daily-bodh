package com.dailybodh.app.update

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters

/** Nightly job: check for a newer build and download it if there is one. */
class UpdateWorker(
    appContext: Context,
    params: WorkerParameters
) : CoroutineWorker(appContext, params) {
    override suspend fun doWork(): Result {
        val status = Updater.checkNow(applicationContext)
        // A failed check is not worth retrying aggressively; we run again tomorrow.
        return if (status.startsWith("Update check failed")) Result.retry() else Result.success()
    }
}
