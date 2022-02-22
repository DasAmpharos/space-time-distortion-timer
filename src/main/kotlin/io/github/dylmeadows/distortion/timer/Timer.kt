package io.github.dylmeadows.distortion.timer

import kotlinx.browser.window
import kotlin.time.Duration
import kotlin.time.ExperimentalTime
import kotlin.time.TimeMark
import kotlin.time.TimeSource

@ExperimentalTime
class Timer(
    private val state: State
) {
    private var mElapsed = Duration.ZERO
    private var mTotalElapsed = Duration.ZERO
    private lateinit var lastMark: TimeMark
    private var timerHandle = -1

    private val now: TimeMark get() = TimeSource.Monotonic.markNow()

    fun start() = with(state) {
        running = true
        lastMark = now
        timerHandle = window.setInterval(timeout = 1000, handler = {
            val delta = lastMark.elapsedNow()
            totalElapsed = mTotalElapsed + delta
            if (!paused) {
                elapsed = mElapsed + delta
                if (remaining <= Duration.ZERO) {
                    stageIdx += 1
                }
            }
        })
    }

    fun stop() {
        state.running = false
        window.clearInterval(timerHandle)
        val delta = lastMark.elapsedNow()
        mTotalElapsed += delta
        mElapsed += delta
    }

    fun reset() {
        lastMark = now
        mTotalElapsed = Duration.ZERO
        mElapsed = Duration.ZERO
        state.reset()
    }

    fun pause() {
        state.paused = true
        mElapsed += lastMark.elapsedNow()
    }

    fun resume() {
        state.paused = false
        lastMark = now
    }
}