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
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dailybodh.app.data.Muhurat
import com.dailybodh.app.data.PanchangRepository
import com.dailybodh.app.data.panchang.MuhuratFile
import com.dailybodh.app.ui.MainViewModel
import kotlinx.coroutines.launch
import java.time.LocalDate

@Composable
fun MuhuratScreen(vm: MainViewModel, nav: NavController) {
    val context = LocalContext.current
    val repo = remember { PanchangRepository(context) }
    val scope = rememberCoroutineScope()

    var file by remember { mutableStateOf<MuhuratFile?>(null) }
    var fnIndex by remember { mutableStateOf(0) }
    var dateA by remember { mutableStateOf("") }
    var dateB by remember { mutableStateOf("") }
    var results by remember { mutableStateOf<List<Muhurat.Verdict>>(emptyList()) }
    var message by remember { mutableStateOf<String?>(null) }
    var busy by remember { mutableStateOf(false) }

    Scaffold(bottomBar = { BottomBar(nav, current = "muhurat") }) { pad ->
        Column(
            Modifier.fillMaxSize().padding(pad).padding(16.dp).verticalScroll(rememberScrollState())
        ) {
            Text("Muhurat", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(4.dp))
            Text(
                "Auspicious days for a function, from the classical rules.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(14.dp))

            val functions = file?.functions ?: emptyList()
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(functions) { f ->
                    val i = functions.indexOf(f)
                    AssistChip(
                        onClick = { fnIndex = i },
                        label = { Text(if (fnIndex == i) "${f.name} \u2713" else f.name) }
                    )
                }
            }

            file?.functions?.getOrNull(fnIndex)?.note?.let {
                Spacer(Modifier.height(8.dp))
                Text(
                    it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(Modifier.height(14.dp))
            Text(
                "Optional: add the birth dates of the two people. The tradition then also " +
                    "applies Tara Bala (from each birth star) and Chandra Bala (from each Moon sign).",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = dateA, onValueChange = { dateA = it }, singleLine = true,
                    label = { Text("First (YYYY-MM-DD)") }, modifier = Modifier.weight(1f)
                )
                OutlinedTextField(
                    value = dateB, onValueChange = { dateB = it }, singleLine = true,
                    label = { Text("Second") }, modifier = Modifier.weight(1f)
                )
            }

            Spacer(Modifier.height(12.dp))
            Button(
                modifier = Modifier.fillMaxWidth(),
                enabled = !busy,
                onClick = {
                    busy = true
                    scope.launch {
                        val mf = file ?: repo.muhurat().also { file = it }
                        val fn = mf.functions.getOrNull(fnIndex)
                        if (fn == null) {
                            busy = false; return@launch
                        }
                        val persons = buildList {
                            listOf(dateA to "First", dateB to "Second").forEach { (raw, label) ->
                                val d = runCatching { LocalDate.parse(raw.trim()) }.getOrNull()
                                if (d != null) {
                                    val n = repo.approximateNakshatra(d)
                                    val lon = repo.moonLongitude(d)
                                    if (n != null && lon != null) {
                                        add(Muhurat.Person(label, n, (lon / 30.0).toInt() % 12))
                                    }
                                }
                            }
                        }
                        val today = LocalDate.now()
                        val days = repo.daysFrom(today, 120)
                        results = days.mapNotNull { d ->
                            val lon = repo.moonLongitude(LocalDate.parse(d.d))
                            Muhurat.evaluate(mf, fn, d, lon, persons).takeIf { it.auspicious }
                        }.take(20)
                        message = when {
                            days.isEmpty() -> "No panchang bundled from today onwards."
                            results.isEmpty() -> "No day in the next 120 days passes every rule for this function."
                            else -> "${results.size} auspicious days in the next 120 days."
                        }
                        busy = false
                    }
                }
            ) { Text(if (busy) "Checking\u2026" else "Find auspicious days") }

            message?.let {
                Spacer(Modifier.height(10.dp))
                Text(it, style = MaterialTheme.typography.bodyMedium)
            }

            results.forEach { r ->
                Spacer(Modifier.height(10.dp))
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(14.dp)) {
                        Text(
                            "${r.day}  \u00b7  ${r.vara}",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            "${r.tithi}  \u00b7  ${r.nakshatra}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(Modifier.height(6.dp))
                        r.reasons.forEach {
                            Text("\u2713  $it", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }

            Spacer(Modifier.height(16.dp))
            Text(
                "These are the classical tabulations, and regional and sampradaya practice " +
                    "differs. The day is only part of it - the lagna and the actual hour are " +
                    "chosen with a pandit, and this screen does not know your birth time or " +
                    "place. Treat it as a shortlist, not a final date.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
