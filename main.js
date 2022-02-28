let paused = false;
let running = false;
let timerHandle = -1;
let lastMark = null;

let elapsed = 0;
let totalElapsed = 0;
let stageIdx = 0;

let timerBtn = document.getElementById("timerBtn");
let pauseBtn = document.getElementById("pauseBtn");
let resetBtn = document.getElementById("resetBtn");
let remainingLbl = document.getElementById("remainingLbl");
let totalElapsedLbl = document.getElementById("totalElapsedLbl");

const stages = Object.freeze([5, 10, 15, 25, 40].map(it => it * 60000));

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
        totalElapsedLbl.innerHTML = formatTime(totalElapsed + delta);
        if (!paused) {
            let remaining = stages[stageIdx] - (elapsed + delta);
            remainingLbl.innerHTML = formatTime(remaining);
            if (remaining <= 0) {
                stageIdx++;
                if (stageIdx >= stages.length) {
                    stop(); reset();
                }
            }
        }
    }, 1000);

    timerBtn.innerHTML = "Stop"
    pauseBtn.disabled = false;
}

function stop() {
    running = false;
    window.clearInterval(timerHandle);
    let delta = lastMark.elapsedNow();
    totalElapsed += delta;
    elapsed += delta;

    timerBtn.innerHTML = "Start";
    pauseBtn.disabled = true;
}

function reset() {
    lastMark = new TimeMark();
    stageIdx = 0;
    totalElapsed = 0;
    elapsed = 0;

    totalElapsedLbl.innerHTML = formatTime(0);
    remainingLbl.innerHTML = formatTime(stages[stageIdx]);
}

function pause() {
    paused = true;
    elapsed += lastMark.elapsedNow();

    pauseBtn.innerHTML = "Resume";
}

function resume() {
    paused = false;
    totalElapsed += lastMark.elapsedNow();
    lastMark = new TimeMark();

    pauseBtn.innerHTML = "Pause";
}

function formatTime(milliseconds) {
    let asSeconds = Math.round(milliseconds / 1000);
    let minutesPart = Math.floor(asSeconds / 60);
    let secondsPart = (asSeconds % 60).toString().padStart(2, '0');
    return `${minutesPart}:${secondsPart}`;
}

reset();