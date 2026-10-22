package com.dailybodh.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dailybodh.app.data.PanchangRepository
import com.dailybodh.app.data.panchang.RashiEntry
import com.dailybodh.app.data.panchang.RashifalFile
import com.dailybodh.app.ui.MainViewModel
import java.time.LocalDate

@Composable
fun RashifalScreen(vm: MainViewModel, nav: NavController) {
    val context = LocalContext.current
    val repo = remember { PanchangRepository(context) }
    val today = remember { LocalDate.now() }

    var rashi by remember { mutableStateOf(0) }
    var period by remember { mutableStateOf("Daily") }

    val file by produceState<RashifalFile?>(initialValue = null) { value = repo.rashifal() }

    Scaffold(bottomBar = { BottomBar(nav, current = "rashifal") }) { pad ->
        Column(
            Modifier.fillMaxSize().padding(pad).padding(16.dp).verticalScroll(rememberScrollState())
        ) {
            Text("Rashifal", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(4.dp))
            Text(
                "Transit (gochar) readings for your Moon sign.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(12.dp))

            val names = file?.rashis?.map { it.key } ?: emptyList()
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(names) { name ->
                    val idx = names.indexOf(name)
                    AssistChip(
                        onClick = { rashi = idx },
                        label = { Text(if (rashi == idx) "$name \u2713" else name) }
                    )
                }
            }
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("Daily", "Monthly", "Yearly").forEach { p ->
                    AssistChip(
                        onClick = { period = p },
                        label = { Text(if (period == p) "$p \u2713" else p) }
                    )
                }
            }
            Spacer(Modifier.height(16.dp))

            val entry: RashiEntry? = remember(file, rashi, period) {
                val f = file ?: return@remember null
                when (period) {
                    "Monthly" -> f.monthly["%04d-%02d".format(today.year, today.monthValue)]?.getOrNull(rashi)
                    "Yearly" -> f.yearly[today.year.toString()]?.getOrNull(rashi)
                    else -> f.daily[today.toString()]?.getOrNull(rashi)
                }
            }

            Card(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    val info = file?.rashis?.getOrNull(rashi)
                    Text(
                        info?.let { "${it.key} \u00b7 ${it.en}" } ?: "",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(Modifier.height(10.dp))
                    if (entry == null) {
                        Text(
                            "No reading bundled for this period. Daily readings cover " +
                                "${file?.dailyFrom} to ${file?.dailyTo}; monthly and yearly cover " +
                                "${file?.monthlyFrom} to ${file?.monthlyTo}.",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    } else {
                        if (entry.h.isNotBlank()) {
                            Text(entry.h, style = MaterialTheme.typography.bodyLarge)
                            Spacer(Modifier.height(8.dp))
                        }
                        Text(
                            "Score ${entry.s} of 5" + if (entry.b.isNotBlank()) " \u00b7 ${entry.b}" else "",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                        if (entry.f.isNotEmpty()) {
                            Spacer(Modifier.height(10.dp))
                            Text("Favourable", style = MaterialTheme.typography.labelLarge)
                            Text(entry.f.joinToString(", "), style = MaterialTheme.typography.bodyMedium)
                        }
                        if (entry.c.isNotEmpty()) {
                            Spacer(Modifier.height(8.dp))
                            Text("Needs care", style = MaterialTheme.typography.labelLarge)
                            Text(entry.c.joinToString(", "), style = MaterialTheme.typography.bodyMedium)
                        }
                    }
                }
            }

            Spacer(Modifier.height(16.dp))
            Text(
                file?.disclaimer ?: "",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
