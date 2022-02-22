package io.github.dylmeadows.distortion.timer

import io.github.dylmeadows.distortion.timer.util.getValue
import io.github.dylmeadows.distortion.timer.util.setValue
import io.kvision.state.ObservableValue
import kotlin.time.Duration

class State {
    val pausedProperty = ObservableValue(false)
    var paused by pausedProperty

    val runningProperty = ObservableValue(false)
    var running by runningProperty

    val elapsedProperty = ObservableValue(Duration.ZERO)
    var elapsed by elapsedProperty

    val totalElapsedProperty = ObservableValue(Duration.ZERO)
    var totalElapsed by totalElapsedProperty

    val stageIdxProperty = ObservableValue(0)
    var stageIdx by stageIdxProperty

    val currentStage: Duration get() =
        stages[stageIdx]

    val remaining: Duration get() =
        currentStage - elapsed

    fun reset() {
        elapsed = Duration.ZERO
        totalElapsed = Duration.ZERO
        stageIdx = 0
    }
}