package com.dailybodh.app.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dailybodh.app.data.Numerology
import com.dailybodh.app.data.model.ContentItem
import com.dailybodh.app.ui.MainViewModel
import java.time.LocalDate

@Composable
fun NumerologyScreen(vm: MainViewModel, nav: NavController) {
    var name by remember { mutableStateOf("") }
    var birth by remember { mutableStateOf("") }

    // the meanings live in the numerology pack, so you can edit them in the JSON
    val pack by produceState<Map<Int, ContentItem>>(initialValue = emptyMap()) {
        val loaded = vm.content.pack("numerology")
        value = loaded.items.mapNotNull { i ->
            val n = i.id.removePrefix("num-").toIntOrNull()
            if (n == null) null else n to i
        }.toMap()
    }

    val date = runCatching { LocalDate.parse(birth.trim()) }.getOrNull()
    val psychic = date?.let { Numerology.psychic(it.dayOfMonth) }
    val destiny = date?.let { Numerology.destiny(it.year, it.monthValue, it.dayOfMonth) }
    val nameNum = if (name.isNotBlank()) Numerology.nameNumber(name) else null

    Scaffold(bottomBar = { BottomBar(nav, current = "numerology") }) { pad ->
        Column(
            Modifier.fillMaxSize().padding(pad).padding(16.dp).verticalScroll(rememberScrollState())
        ) {
            Text("Numerology", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(4.dp))
            Text(
                "Cheiro's system: arithmetic on your name and birth date.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(14.dp))

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                singleLine = true,
                label = { Text("Full name") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(10.dp))
            OutlinedTextField(
                value = birth,
                onValueChange = { birth = it },
                singleLine = true,
                label = { Text("Birth date (YYYY-MM-DD)") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(16.dp))

            Card(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    NumberLine("Psychic number (mulank)", psychic, pack)
                    NumberLine("Destiny number (bhagyank)", destiny, pack)
                    NumberLine("Name number (Chaldean)", nameNum, pack)
                }
            }

            Spacer(Modifier.height(16.dp))
            Text(
                "Cheiro's number meanings come from his Book of Numbers. The arithmetic is exact; " +
                    "the meanings on top of it are one man's system, published in the 1920s, and are " +
                    "presented here as that - not as a fact about you.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun NumberLine(label: String, number: Int?, pack: Map<Int, ContentItem>) {
    Row(Modifier.fillMaxWidth().padding(vertical = 5.dp)) {
        Text(
            label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(end = 10.dp)
        )
        Column {
            Text(
                number?.toString() ?: "\u2014",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            val entry = number?.let { pack[it] }
            if (entry != null) {
                Text(
                    entry.summary1 ?: "",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(entry.summary2to3 ?: "", style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}
