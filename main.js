var paused = false;
var running = false;
var timerHandle = -1;
var lastMark = null;

var elapsed = 0;
var totalElapsed = 0;

var timerBtn = document.getElementById("timerBtn");
var pauseBtn = document.getElementById("pauseBtn");
var remainingLbl = document.getElementById("remainingLbl");
var totalElapsedLbl = document.getElementById("totalElapsedLbl");

timerBtn.onclick = () => {
    if (!running) {
        start();
     } else {
         stop();
     }
};

pauseBtn.onclick = () => {
    if (!paused) {
        pause();
    } else {
        resume();
    }
};

function start() {
    running = true;
    lastMark = new Date();
    timerBtn.innerHTML = "Stop"

    timerHandle = window.setInterval(() => {
        var now = new Date();
        var delta = now.getTime() - lastMark.getTime();
        totalElapsedLbl.innerHTML = totalElapsed + delta;
        if (!paused) {
            remainingLbl.innerHTML = elapsed + delta;
        }
    }, 1000);

    pauseBtn.disabled = false;
}

function stop() {
    running = false;
    window.clearInterval(timerHandle);
    totalElapsedLbl.innerHTML = 0;
    remainingLbl.innerHTML = 0;

    timerBtn.innerHTML = "Start";
    pauseBtn.disabled = true;
}

function pause() {
    paused = true;
    var now = new Date();
    elapsed += now.getTime() - lastMark.getTime()
    pauseBtn.innerHTML = "Resume";
}

function resume() {
    paused = false;
    lastMark = new Date();
    pauseBtn.innerHTML = "Pause";
}

function reset() {

}