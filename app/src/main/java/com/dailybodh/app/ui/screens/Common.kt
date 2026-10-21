package com.dailybodh.app.ui.screens

import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.collectAsState
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kotlinx.coroutines.flow.StateFlow

/** Thin alias so screens do not need to import the lifecycle-compose helper each time. */
@Composable
fun <T> StateFlow<T>.collectAsStateCompat(): State<T> = collectAsStateWithLifecycle()
