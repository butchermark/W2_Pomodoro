// ---------------- DOM Cache ----------------
const timer_p = document.querySelector(".timer");

const pomodoroSettings_div = document.querySelector(".pomodoro-settings");
const shortBreakSettings_div = document.querySelector(".short-break-settings");
const longBreakSettings_div = document.querySelector(".long-break-settings");

let pomodoroTime_p = pomodoroSettings_div.querySelector(".pomodoro-time");
let shortBreak_p = shortBreakSettings_div.querySelector(".short-break-time");
let longBreak_p = longBreakSettings_div.querySelector(".long-break-time");

const pomodoroPlus_btn = document.querySelector("#pomodoro-plus-button");
const pomodoroMinus_btn = document.querySelector("#pomodoro-minus-button");
const shortBreakPlus_btn = document.querySelector("#short-break-plus-button");
const shortBreakMinus_btn = document.querySelector("#short-break-minus-button");
const longBreakPlus_btn = document.querySelector("#long-break-plus-button");
const longBreakMinus_btn = document.querySelector("#long-break-minus-button");

const start_btn = document.querySelector(".start-button");
const pause_btn = document.querySelector(".pause-button");

//---------------- Variables ----------------
let pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
let shortBreakTime = parseInt(shortBreak_p.innerHTML) * 60000;
let longBreakTime = parseInt(longBreak_p.innerHTML) * 60000;
let isTimerPaused = false;
let interval, temp;
let pomodoroCount = 1;
let currentPeriod = "pomodoro";

//---------------- Functions ----------------

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function convertMsToMinutesSeconds(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.round((milliseconds % 60000) / 1000);

  return seconds === 60
    ? `${minutes + 1}:00`
    : `${minutes}:${padTo2Digits(seconds)}`;
}

function convertMinSecToMS(string) {
  let stringParts = string.split(":");

  return (stringParts[0] * 60 + stringParts[1]) * 10;
}

function calculatePercentage(percentageValue, maxPercentageValue) {
  return 100 - (percentageValue / convertMinSecToMS(maxPercentageValue)) * 100;
}

function setProgressBar(percentage) {
  const circles = document.querySelectorAll(".circle-set");
  const circleTop = document.querySelector("#circle-top");
  let degreeBasedOnPercentage = (percentage / 100) * 360;

  circles.forEach((el) => {
    el.style.transform = `rotate(${degreeBasedOnPercentage}deg)`;

    if (degreeBasedOnPercentage >= 180) {
      circles[0].style.transform = "rotate(180deg)";
      circleTop.style.opacity = "0";
    } else {
      circleTop.style.opacity = "1";
    }
  });
}

function startCountdown() {
  start_btn.hidden = true;
  pause_btn.hidden = false;

  disableSettings();

  if (isTimerPaused) {
    isTimerPaused = false;
    pomodoroTime = temp;
  }

  interval = setInterval(function () {
    const periodTitle_p = document.querySelector("#period-title");

    let percentage = 100;
    if (!isTimerPaused && currentPeriod === "pomodoro") {
      pomodoroTime -= 1000;
      percentage = calculatePercentage(pomodoroTime, pomodoroTime_p.innerHTML);
      setProgressBar(percentage);

      periodTitle_p.innerHTML = "Pomodoro " + pomodoroCount;
      timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
      if (pomodoroTime === 0 && !(pomodoroCount % 4)) {
        new Audio("beep.mp3").play();
        currentPeriod = "longbreak";
        longBreakTime = parseInt(longBreak_p.innerHTML) * 60000;
      } else if (pomodoroTime === 0) {
        new Audio("beep.mp3").play();
        currentPeriod = "shortbreak";
        shortBreakTime = parseInt(shortBreak_p.innerHTML) * 60000;
      }
    } else if (!isTimerPaused && currentPeriod === "shortbreak") {
      shortBreakTime -= 1000;
      percentage = calculatePercentage(shortBreakTime, shortBreak_p.innerHTML);
      setProgressBar(percentage);

      periodTitle_p.innerHTML = "Short Break";
      timer_p.innerHTML = convertMsToMinutesSeconds(shortBreakTime);
      if (shortBreakTime === 0) {
        new Audio("beep.mp3").play();
        currentPeriod = "pomodoro";
        pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
        pomodoroCount++;
      }
    } else if (!isTimerPaused && currentPeriod === "longbreak") {
      longBreakTime -= 1000;
      percentage = calculatePercentage(longBreakTime, longBreak_p.innerHTML);
      setProgressBar(percentage);

      periodTitle_p.innerHTML = "Long Break";
      timer_p.innerHTML = convertMsToMinutesSeconds(longBreakTime);
      if (longBreakTime === 0) {
        new Audio("beep.mp3").play();
        currentPeriod = "pomodoro";
        pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
        pomodoroCount++;
      }
    }
  }, 1000);
}

function pauseCountdown() {
  if (isTimerPaused) {
    pomodoroTime = temp;
    pause_btn.innerHTML = "Pause";
    isTimerPaused = false;
  } else {
    temp = pomodoroTime;
    pause_btn.innerHTML = "Continue";
    isTimerPaused = true;
  }
}

function resetCountdown() {
  clearInterval(interval);

  isTimerPaused = false;
  start_btn.hidden = false;
  pause_btn.hidden = true;

  enableSettings();

  timer_p.innerHTML = pomodoroTime_p.innerHTML;
  pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
  pomodoroCount = 1;
  currentPeriod = "pomodoro";
}

function increasePomodoroSetting() {
  pomodoroTime += 60000;
  pomodoroTime_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
  timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
}
function decreasePomodoroSetting() {
  if (pomodoroTime > 60000) {
    pomodoroTime -= 60000;
    pomodoroTime_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
    timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
  }
}
function increaseShortBreakSetting() {
  shortBreakTime += 60000;
  shortBreak_p.innerHTML = convertMsToMinutesSeconds(shortBreakTime);
}
function decreaseShortBreakSetting() {
  if (shortBreakTime > 60000) {
    shortBreakTime -= 60000;
    shortBreak_p.innerHTML = convertMsToMinutesSeconds(shortBreakTime);
  }
}
function increaseLongBreakSetting() {
  longBreakTime += 60000;
  longBreak_p.innerHTML = convertMsToMinutesSeconds(longBreakTime);
}
function decreaseLongBreakSetting() {
  if (longBreakTime > 60000) {
    longBreakTime -= 60000;
    longBreak_p.innerHTML = convertMsToMinutesSeconds(longBreakTime);
  }
}

function disableSettings() {
  pomodoroPlus_btn.disabled = true;
  pomodoroMinus_btn.disabled = true;
  shortBreakPlus_btn.disabled = true;
  shortBreakMinus_btn.disabled = true;
  longBreakPlus_btn.disabled = true;
  longBreakMinus_btn.disabled = true;
}
function enableSettings() {
  pomodoroPlus_btn.disabled = false;
  pomodoroMinus_btn.disabled = false;
  shortBreakPlus_btn.disabled = false;
  shortBreakMinus_btn.disabled = false;
  longBreakPlus_btn.disabled = false;
  longBreakMinus_btn.disabled = false;
}

function startDateTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById("time-time").innerHTML = h + ":" + m + ":" + s;
  var t = setTimeout(startDateTime, 500);
}
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
//---------------- EventListeners ----------------
function addEventListeners() {
  const reset_btn = document.querySelector(".reset-button");

  start_btn.addEventListener("click", startCountdown);
  pause_btn.addEventListener("click", pauseCountdown);
  reset_btn.addEventListener("click", resetCountdown);

  pomodoroPlus_btn.addEventListener("click", increasePomodoroSetting);
  pomodoroMinus_btn.addEventListener("click", decreasePomodoroSetting);
  shortBreakPlus_btn.addEventListener("click", increaseShortBreakSetting);
  shortBreakMinus_btn.addEventListener("click", decreaseShortBreakSetting);
  longBreakPlus_btn.addEventListener("click", increaseLongBreakSetting);
  longBreakMinus_btn.addEventListener("click", decreaseLongBreakSetting);
}

function run() {
  addEventListeners();
}

run();
