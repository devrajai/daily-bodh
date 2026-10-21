package com.dailybodh.app.data

import com.dailybodh.app.data.model.ContentItem
import com.dailybodh.app.data.model.PackFile
import java.time.LocalDate
import java.time.temporal.ChronoUnit

/**
 * Decides which item a pack shows on a given day.
 *
 *  - sequential (Gita): advance one item per day starting from an anchor date,
 *    looping back to the first item when the list ends (if repeat is on).
 *  - daily: index by day-of-year so every device shows the same item on the
 *    same calendar day.
 */
object ContentPicker {

    private val anchor: LocalDate = LocalDate.of(2024, 1, 1)

    fun itemForDay(pack: PackFile, date: LocalDate, repeat: Boolean): ContentItem? {
        if (pack.items.isEmpty()) return null
        val index = indexForDay(pack, date, repeat)
        return pack.items[index]
    }

    fun indexForDay(pack: PackFile, date: LocalDate, repeat: Boolean): Int {
        val count = pack.items.size
        if (count == 0) return 0
        return when (pack.ordering) {
            "sequential" -> {
                val days = ChronoUnit.DAYS.between(anchor, date)
                val idx = (days % count).toInt()
                if (repeat) ((idx % count) + count) % count
                else idx.coerceIn(0, count - 1)
            }
            else -> date.dayOfYear % count
        }
    }
}
