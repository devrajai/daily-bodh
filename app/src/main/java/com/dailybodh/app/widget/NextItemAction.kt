package com.dailybodh.app.widget

import android.content.Context
import androidx.glance.GlanceId
import androidx.glance.appwidget.action.ActionCallback

/** Handles the "next" tap on a widget: advances to the following item. */
class NextItemAction : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: androidx.glance.action.ActionParameters
    ) {
        WidgetStateStore.bumpOffset(context, glanceId)
        DailyBodhWidget().update(context, glanceId)
    }
}
