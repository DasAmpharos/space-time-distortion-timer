let paused = false;
let running = false;
let timerHandle = -1;
let lastMark = null;

let elapsed = 0;
let totalElapsed = 0;
let stageIdx = 0;

const timerBtn = document.getElementById("timerBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const remainingLbl = document.getElementById("remainingLbl");
const totalElapsedLbl = document.getElementById("totalElapsedLbl");
const stages = Object.freeze([5, 10, 15, 25, 40].map(it => it * 60000));
const audio = new Audio("LevelUp.mp3");

class TimeMark {
    #mark = new Date();

    elapsedNow() {
        let now = new Date();
        return now.getTime() - this.#mark.getTime();
    }
}

timerBtn.onclick = () => {
    (!running ? start : stop)();
};

pauseBtn.onclick = () => {
    (!paused ? pause : resume)();
};

resetBtn.onclick = reset;

function start() {
    running = true;
    lastMark = new TimeMark();
    timerHandle = window.setInterval(() => {
        let delta = lastMark.elapsedNow();
        totalElapsedLbl.value = formatTime(totalElapsed + delta);
        if (!paused) {
            let remaining = stages[stageIdx] - (elapsed + delta);
            remainingLbl.value = formatTime(remaining);
            if (remaining <= 0) {
                audio.play();
                stageIdx++;
                if (stageIdx >= stages.length) {
                    stop(); reset();
                }
            }
        }
    }, 1000);

    timerBtn.textContent = "Stop"
    pauseBtn.disabled = false;
}

function stop() {
    running = false;
    window.clearInterval(timerHandle);
    let delta = lastMark.elapsedNow();
    totalElapsed += delta;
    elapsed += delta;

    timerBtn.textContent = "Start";
    pauseBtn.disabled = true;
}

function reset() {
    lastMark = new TimeMark();
    stageIdx = 0;
    totalElapsed = 0;
    elapsed = 0;

    totalElapsedLbl.value = formatTime(0);
    remainingLbl.value = formatTime(stages[stageIdx]);
}

function pause() {
    paused = true;
    elapsed += lastMark.elapsedNow();

    pauseBtn.textContent = "Resume";
}

function resume() {
    paused = false;
    totalElapsed += lastMark.elapsedNow();
    lastMark = new TimeMark();

    pauseBtn.textContent = "Pause";
}

function formatTime(milliseconds) {
    let asSeconds = Math.round(milliseconds / 1000);
    let minutesPart = Math.floor(asSeconds / 60);
    let secondsPart = (asSeconds % 60).toString().padStart(2, '0');
    return `${minutesPart}:${secondsPart}`;
}

reset();