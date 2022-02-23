package io.github.dylmeadows.distortion.timer

import io.github.dylmeadows.distortion.timer.util.joinWith
import io.kvision.Application
import io.kvision.BootstrapCssModule
import io.kvision.BootstrapModule
import io.kvision.CoreModule
import io.kvision.core.CssSize
import io.kvision.core.UNIT
import io.kvision.html.Align
import io.kvision.html.button
import io.kvision.html.div
import io.kvision.html.label
import io.kvision.module
import io.kvision.panel.hPanel
import io.kvision.panel.root
import io.kvision.panel.vPanel
import io.kvision.require
import io.kvision.startApplication
import io.kvision.state.bind
import org.w3c.dom.Audio
import kotlin.math.roundToInt
import kotlin.time.Duration
import kotlin.time.DurationUnit
import kotlin.time.ExperimentalTime

@ExperimentalTime
class App : Application() {
    override fun start() {
        val state = State()
        val timer = Timer(state)
        with(state) {
            root("kvapp") {
                div {
                    padding = CssSize(10, UNIT.pt)
                    vPanel(spacing = 10) {
                        align = Align.CENTER
                        hPanel(spacing = 5) {
                            label(content = "Remaining:")
                            label {
                                bind(elapsedProperty) {
                                    content = remaining.toDisplayString()
                                }
                            }
                        }

                        hPanel(spacing = 5) {
                            label(content = "Total Time:")
                            label {
                                bind(totalElapsedProperty) {
                                    content = totalElapsed.toDisplayString()
                                }
                            }
                        }

                        hPanel(spacing = 10) {
                            button(text = "Start") {
                                bind(runningProperty) {
                                    text = if (running) "Stop" else "Start"
                                }
                                onClick {
                                    if (running) {
                                        timer.stop()
                                    } else {
                                        timer.start()
                                    }
                                }
                            }

                            button(text = "Pause") {
                                bind(runningProperty.joinWith(pausedProperty)) {
                                    text = if (paused) "Resume" else "Pause"
                                    disabled = !running
                                }
                                onClick {
                                    if (paused) {
                                        timer.resume()
                                    } else {
                                        timer.pause()
                                    }
                                }
                            }

                            button(text = "Reset") {
                                onClick {
                                    timer.reset()
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private fun Duration.toDisplayString(): String =
        toComponents { minutes, seconds, nanoseconds ->
            val secondsPart = (seconds.toDouble() + (nanoseconds.toDouble() / 1_000_000_000.0)).roundToInt()
            val secondsPartString = secondsPart.toString()
                .padStart(length = 2, padChar = '0')
            "${minutes}m ${secondsPartString}s"
        }
}

@ExperimentalTime
fun main() {
    startApplication(
        ::App,
        module.hot,
        BootstrapModule,
        BootstrapCssModule,
        CoreModule
    )
}
