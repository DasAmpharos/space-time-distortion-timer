package io.github.dylmeadows.distortion.timer.util

import io.kvision.state.MutableState
import io.kvision.state.ObservableState
import kotlin.reflect.KProperty

fun <T1, T2> ObservableState<T1>.joinWith(other: ObservableState<T2>): ObservableState<Tuple2<T1, T2>> =
    object : ObservableState<Tuple2<T1, T2>> {
        override fun getState(): Tuple2<T1, T2> =
            Tuple2(this@joinWith.getState(), other.getState())

        override fun subscribe(observer: (Tuple2<T1, T2>) -> Unit): () -> Unit {
            val s1 = this@joinWith.subscribe { observer(Tuple2(it, other.getState())) }
            val s2 = other.subscribe { observer(Tuple2(this@joinWith.getState(), it)) }
            return { s1(); s2() }
        }
    }

operator fun <T> ObservableState<T>.getValue(thisRef: Any?, property: KProperty<*>): T = getState()

operator fun <T> MutableState<T>.setValue(thisRef: Any?, property: KProperty<*>, newValue: T) {
    setState(newValue)
}
