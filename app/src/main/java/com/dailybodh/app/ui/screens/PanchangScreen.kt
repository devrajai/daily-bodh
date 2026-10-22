package com.dailybodh.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dailybodh.app.data.PanchangRepository
import com.dailybodh.app.data.panchang.Festival
import com.dailybodh.app.data.panchang.PanchangDay
import com.dailybodh.app.ui.MainViewModel
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Composable
fun PanchangScreen(vm: MainViewModel, nav: NavController) {
    val context = LocalContext.current
    val repo = remember { PanchangRepository(context) }
    val today = remember { LocalDate.now() }
    val pretty = remember { DateTimeFormatter.ofPattern("d MMMM yyyy") }

    val day by produceState<PanchangDay?>(initialValue = null) { value = repo.day(today) }
    val upcoming by produceState<List<Festival>>(initialValue = emptyList()) {
        value = repo.upcoming(today, 40)
    }
    val location by produceState<String>(initialValue = "") { value = repo.panchang().location }

    Scaffold(bottomBar = { BottomBar(nav, current = "panchang") }) { pad ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(pad).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            item {
                Text("Panchang", style = MaterialTheme.typography.headlineMedium)
                Spacer(Modifier.height(4.dp))
                Text(
                    "$location \u00b7 ${today.format(pretty)}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            item {
                val d = day
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp)) {
                        if (d == null) {
                            Text("No panchang for today (the bundled range may have ended).")
                        } else {
                            Text(
                                "${d.vara} \u00b7 ${d.paksha} ${d.tithi}",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold
                            )
                            Spacer(Modifier.height(10.dp))
                            PLine("Tithi", "${d.tithi}  (till ${d.tithiEnd})")
                            PLine("Nakshatra", "${d.nakshatra}  (till ${d.nakEnd})")
                            PLine("Yoga", d.yoga)
                            PLine("Karana", d.karana)
                            PLine("Masa", d.masa)
                            PLine("Sunrise", d.sunrise)
                            PLine("Sunset", d.sunset)
                        }
                    }
                }
            }

            item {
                val d = day
                if (d != null) {
                    Card(Modifier.fillMaxWidth()) {
                        Column(Modifier.padding(16.dp)) {
                            Text("Timings", style = MaterialTheme.typography.titleMedium)
                            Spacer(Modifier.height(8.dp))
                            PLine("Brahma muhurta", d.brahma)
                            PLine("Abhijit", d.abhijit)
                            PLine("Rahu kalam", d.rahu)
                            PLine("Yamaganda", d.yamaganda)
                            PLine("Gulika", d.gulika)
                            Spacer(Modifier.height(8.dp))
                            Text(
                                "Rahu kalam, Yamaganda and Gulika are the windows traditionally avoided for new starts.",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            item {
                Spacer(Modifier.height(4.dp))
                Text("Festivals ahead", style = MaterialTheme.typography.titleMedium)
            }
            items(upcoming) { f ->
                Row(Modifier.fillMaxWidth()) {
                    Text(
                        f.d,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(end = 12.dp)
                    )
                    Column {
                        Text(f.n, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
                        if (f.k.isNotBlank()) {
                            Text(
                                f.k,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            item {
                Spacer(Modifier.height(8.dp))
                Text(
                    "Computed from positional astronomy (kalagana, MIT) for $location. " +
                        "Regional panchangs can differ by a day on some observances - " +
                        "check your local authority for anything that matters.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun PLine(label: String, value: String) {
    if (value.isBlank()) return
    Row(Modifier.fillMaxWidth().padding(vertical = 2.dp)) {
        Text(
            label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(end = 12.dp)
        )
        Text(value, style = MaterialTheme.typography.bodyMedium)
    }
}
