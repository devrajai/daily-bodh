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
import androidx.compose.material3.OutlinedButton
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
import com.dailybodh.app.data.GunaMilan
import com.dailybodh.app.data.Vimshottari
import com.dailybodh.app.data.PanchangRepository
import com.dailybodh.app.ui.MainViewModel
import kotlinx.coroutines.launch
import java.time.LocalDate

@Composable
fun MatchScreen(vm: MainViewModel, nav: NavController) {
    val context = LocalContext.current
    val repo = remember { PanchangRepository(context) }
    val scope = rememberCoroutineScope()

    var boyRashi by remember { mutableStateOf(0) }
    var boyNak by remember { mutableStateOf(0) }
    var girlRashi by remember { mutableStateOf(0) }
    var girlNak by remember { mutableStateOf(0) }

    var boyDate by remember { mutableStateOf("") }
    var girlDate by remember { mutableStateOf("") }
    var warning by remember { mutableStateOf<String?>(null) }

    var result by remember { mutableStateOf<GunaMilan.Result?>(null) }
    var boyChart by remember { mutableStateOf<String?>(null) }
    var girlChart by remember { mutableStateOf<String?>(null) }

    Scaffold(bottomBar = { BottomBar(nav, current = "match") }) { pad ->
        Column(
            Modifier.fillMaxSize().padding(pad).padding(16.dp).verticalScroll(rememberScrollState())
        ) {
            Text("Match", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(4.dp))
            Text(
                "Ashtakoota, the classical 36-point system, from both birth stars.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(14.dp))

            PersonPicker("Boy", boyRashi, boyNak,
                { boyRashi = it }, { boyNak = it },
                boyDate, { boyDate = it },
                chart = boyChart,
                onUseDate = {
                    scope.launch {
                        val d = runCatching { LocalDate.parse(boyDate.trim()) }.getOrNull()
                        val n = d?.let { repo.approximateNakshatra(it) }
                        if (n == null) {
                            warning = "Could not read that date. Use YYYY-MM-DD, between 1930 and 2035."
                        } else {
                            boyNak = n
                            boyRashi = (n * 4) / 9
                            boyChart = describe(d!!, repo)
                            warning = "Approximated from the Moon's position at noon on that date. " +
                                "The Moon changes nakshatra about once a day, so if you were born late " +
                                "or early it may be the neighbouring one. Use the exact star if you know it."
                        }
                    }
                })

            Spacer(Modifier.height(16.dp))

            PersonPicker("Girl", girlRashi, girlNak,
                { girlRashi = it }, { girlNak = it },
                girlDate, { girlDate = it },
                chart = girlChart,
                onUseDate = {
                    scope.launch {
                        val d = runCatching { LocalDate.parse(girlDate.trim()) }.getOrNull()
                        val n = d?.let { repo.approximateNakshatra(it) }
                        if (n == null) {
                            warning = "Could not read that date. Use YYYY-MM-DD, between 1930 and 2035."
                        } else {
                            girlNak = n
                            girlRashi = (n * 4) / 9
                            girlChart = describe(d!!, repo)
                            warning = "Approximated from the Moon's position at noon on that date."
                        }
                    }
                })

            warning?.let {
                Spacer(Modifier.height(12.dp))
                Card(Modifier.fillMaxWidth()) {
                    Text(
                        it,
                        Modifier.padding(14.dp),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(Modifier.height(16.dp))
            Button(
                modifier = Modifier.fillMaxWidth(),
                onClick = { result = GunaMilan.compute(boyNak, boyRashi, girlNak, girlRashi) }
            ) { Text("Calculate") }

            result?.let { r ->
                Spacer(Modifier.height(18.dp))
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp)) {
                        Text(
                            "${r.total} of ${r.maxTotal}",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.SemiBold
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(r.verdict, style = MaterialTheme.typography.bodyMedium)
                        Spacer(Modifier.height(14.dp))
                        r.kootas.forEach { k ->
                            Row(Modifier.fillMaxWidth().padding(vertical = 3.dp)) {
                                Text(
                                    k.name,
                                    Modifier.padding(end = 10.dp),
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Medium
                                )
                                Text(
                                    "${k.score} / ${k.max}",
                                    Modifier.padding(end = 10.dp),
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Text(
                                    k.note,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(16.dp))
            Text(
                "The tables behind this differ between lineages and printed sources, and the " +
                    "classical texts treat the per-koota breakdown, not the total, as the useful " +
                    "output. A score is one traditional input among many - never a verdict on two " +
                    "people. Nadi and Bhakoot doshas have classical cancelling remedies (parihara); " +
                    "ask someone who knows your tradition rather than acting on the number.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun PersonPicker(
    label: String,
    rashi: Int,
    nak: Int,
    onRashi: (Int) -> Unit,
    onNak: (Int) -> Unit,
    dateText: String,
    onDate: (String) -> Unit,
    chart: String?,
    onUseDate: () -> Unit
) {
    Card(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(14.dp)) {
            Text(label, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(8.dp))

            Text("Rashi (Moon sign)", style = MaterialTheme.typography.labelMedium)
            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                items(GunaMilan.rashiNames) { name ->
                    val i = GunaMilan.rashiNames.indexOf(name)
                    AssistChip(
                        onClick = { onRashi(i) },
                        label = { Text(if (rashi == i) "\u2713 $name" else name) }
                    )
                }
            }
            Spacer(Modifier.height(8.dp))

            Text("Nakshatra (birth star)", style = MaterialTheme.typography.labelMedium)
            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                items(GunaMilan.nakshatraNames) { name ->
                    val i = GunaMilan.nakshatraNames.indexOf(name)
                    AssistChip(
                        onClick = { onNak(i) },
                        label = { Text(if (nak == i) "\u2713 $name" else name) }
                    )
                }
            }
            Spacer(Modifier.height(10.dp))

            Text(
                "Don't know the star? Enter a birth date (YYYY-MM-DD).",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(6.dp))
            Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                OutlinedTextField(
                    value = dateText,
                    onValueChange = onDate,
                    singleLine = true,
                    label = { Text("Birth date") },
                    modifier = Modifier.weight(1f)
                )
                Spacer(Modifier.height(0.dp))
                OutlinedButton(onClick = onUseDate, modifier = Modifier.padding(start = 8.dp)) {
                    Text("Use")
                }
            }
            chart?.let {
                Spacer(Modifier.height(8.dp))
                Text(
                    it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

/** Nakshatra, pada and the running Vimshottari dasha from the Moon's longitude. */
private suspend fun describe(birth: LocalDate, repo: PanchangRepository): String? {
    val lon = repo.moonLongitude(birth) ?: return null
    val span = 360.0 / 27.0
    val nak = (lon / span).toInt() % 27
    val within = lon % span
    val pada = (within / (span / 4.0)).toInt() + 1
    val age = java.time.temporal.ChronoUnit.DAYS.between(birth, LocalDate.now()) / 365.25
    val md = Vimshottari.current(nak, within / span, age)
    val ad = Vimshottari.antardasha(md.lord, age - md.startYear)
    val name = GunaMilan.nakshatraNames.getOrNull(nak) ?: "?"
    return "$name, pada $pada \u00b7 ${md.lord} mahadasha, $ad antardasha"
}
