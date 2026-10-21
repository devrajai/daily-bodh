package com.dailybodh.app

import android.app.Application
import com.dailybodh.app.update.Updater
import com.dailybodh.app.widget.WidgetScheduler

class DailyBodhApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Keep widgets rolling over at midnight even if the app is never opened.
        WidgetScheduler.scheduleMidnightRefresh(this)
        // No-op in the offline flavour; schedules the nightly check in the updater flavour.
        Updater.onAppStart(this)
    }
}
