const btnCrono = document.getElementById("btnCronometro");
const btnTimer = document.getElementById("btnTemporizador");
const cronometro = document.getElementById("cronometro");
const temporizador = document.getElementById("temporizador");
const menu = document.getElementById("menu");
const regresar = document.getElementById("btnRegresar");

let cronoInterval,
  cronoStart = 0,
  cronoRunning = false,
  cronoElapsed = 0;

// --- Mostrar / ocultar secciones ---
btnCrono.addEventListener("click", () => {
  menu.classList.add("hidden");
  cronometro.classList.remove("hidden");
  regresar.classList.remove("hidden");
});

btnTimer.addEventListener("click", () => {
  menu.classList.add("hidden");
  temporizador.classList.remove("hidden");
  regresar.classList.remove("hidden");
});

regresar.addEventListener("click", () => {
  // Reiniciar cronómetro
  clearInterval(cronoInterval);
  cronoRunning = false;
  cronoStart = 0;
  cronoElapsed = 0;
  cronoDisplay.innerHTML = "00:00:00.<span class=\"milliseconds\">000</span>";
  startCrono.classList.remove("hidden");
  pauseCrono.classList.add("hidden");
  resumeCrono.classList.add("hidden");
  
  // Reiniciar temporizador
  clearInterval(countdownInterval);
  timerRunning = false;
  inputTime = "";
  countdown = 0;
  initialTime = 0;
  temporizadorDisplay.innerHTML = "00:00:00.<span class=\"milliseconds\">000</span>";
  temporizadorDisplay.classList.remove("alerta");
  startTimer.classList.remove("hidden");
  pauseTimer.classList.add("hidden");
  resumeTimer.classList.add("hidden");
  
  // Ocultar/mostrar elementos de UI
  cronometro.classList.add("hidden");
  temporizador.classList.add("hidden");
  menu.classList.remove("hidden");
  regresar.classList.add("hidden");
  document.getElementById("numpad").classList.remove("hidden");
  document.getElementById("timerControls").classList.add("hidden");
});

// --- Cronómetro ---
const cronoDisplay = document.getElementById("cronometroDisplay");
const startCrono = document.getElementById("startCrono");
const pauseCrono = document.getElementById("pauseCrono");
const resumeCrono = document.getElementById("resumeCrono");
const resetCrono = document.getElementById("resetCrono");

startCrono.addEventListener("click", () => {
  if (!cronoRunning) {
    cronoStart = Date.now();
    cronoRunning = true;
    cronoInterval = setInterval(actualizarCrono, 10);
    startCrono.classList.add("hidden");
    pauseCrono.classList.remove("hidden");
  }
});

pauseCrono.addEventListener("click", () => {
  cronoRunning = false;
  clearInterval(cronoInterval);
  cronoElapsed += Date.now() - cronoStart;
  pauseCrono.classList.add("hidden");
  resumeCrono.classList.remove("hidden");
});

resumeCrono.addEventListener("click", () => {
  cronoRunning = true;
  cronoStart = Date.now();
  cronoInterval = setInterval(actualizarCrono, 10);
  resumeCrono.classList.add("hidden");
  pauseCrono.classList.remove("hidden");
});

resetCrono.addEventListener("click", () => {
  cronoRunning = false;
  clearInterval(cronoInterval);
  cronoStart = 0;
  cronoElapsed = 0;
  cronoDisplay.innerHTML = "00:00:00.<span class=\"milliseconds\">000</span>";
  startCrono.classList.remove("hidden");
  pauseCrono.classList.add("hidden");
  resumeCrono.classList.add("hidden");
});

function actualizarCrono() {
  let elapsed = cronoElapsed + (Date.now() - cronoStart);
  let ms = elapsed % 1000;
  let s = Math.floor(elapsed / 1000) % 60;
  let m = Math.floor(elapsed / 60000) % 60;
  let h = Math.floor(elapsed / 3600000);
  cronoDisplay.innerHTML = `${formato(h)}:${formato(m)}:${formato(s)}.<span class="milliseconds">${ms
    .toString()
    .padStart(3, "0")}</span>`;
}

function formato(num) {
  return num.toString().padStart(2, "0");
}

// --- Temporizador ---
const temporizadorDisplay = document.getElementById("temporizadorDisplay");
const numButtons = document.querySelectorAll(".num");
const setTime = document.getElementById("setTime");
const clearTime = document.getElementById("clearTime");
const numpad = document.getElementById("numpad");
const timerControls = document.getElementById("timerControls");
const startTimer = document.getElementById("startTimer");
const pauseTimer = document.getElementById("pauseTimer");
const resumeTimer = document.getElementById("resumeTimer");
const resetTimer = document.getElementById("resetTimer");

let inputTime = "";
let countdown = 0,
  countdownInterval,
  timerRunning = false,
  initialTime = 0;

numButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (inputTime.length < 6) {
      inputTime += btn.textContent;
      actualizarDisplayTimer();
    }
  });
});

function actualizarDisplayTimer() {
  let padded = inputTime.padStart(6, "0");
  let h = padded.substring(0, 2);
  let m = padded.substring(2, 4);
  let s = padded.substring(4, 6);
  temporizadorDisplay.innerHTML = `${h}:${m}:${s}.<span class="milliseconds">000</span>`;
}

clearTime.addEventListener("click", () => {
  inputTime = "";
  temporizadorDisplay.innerHTML = "00:00:00.<span class=\"milliseconds\">000</span>";
});

setTime.addEventListener("click", () => {
  if (inputTime.length === 0) return;
  let padded = inputTime.padStart(6, "0");
  let h = parseInt(padded.substring(0, 2));
  let m = parseInt(padded.substring(2, 4));
  let s = parseInt(padded.substring(4, 6));
  initialTime = (h * 3600 + m * 60 + s) * 1000;
  countdown = initialTime;
  numpad.classList.add("hidden");
  timerControls.classList.remove("hidden");
});

startTimer.addEventListener("click", () => {
  if (countdown <= 0) return;
  timerRunning = true;
  const end = Date.now() + countdown;
  countdownInterval = setInterval(() => {
    countdown = end - Date.now();
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      temporizadorDisplay.innerHTML = "00:00:00.<span class=\"milliseconds\">000</span>";
      temporizadorDisplay.classList.add("alerta");
      startTimer.classList.add("hidden");
      return;
    }
    actualizarTemporizadorDisplay(countdown);
  }, 10);
  startTimer.classList.add("hidden");
  pauseTimer.classList.remove("hidden");
});

pauseTimer.addEventListener("click", () => {
  clearInterval(countdownInterval);
  timerRunning = false;
  pauseTimer.classList.add("hidden");
  resumeTimer.classList.remove("hidden");
});

resumeTimer.addEventListener("click", () => {
  const end = Date.now() + countdown;
  timerRunning = true;
  countdownInterval = setInterval(() => {
    countdown = end - Date.now();
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      temporizadorDisplay.innerHTML = "00:00:00.<span class=\"milliseconds\">000</span>";
      temporizadorDisplay.classList.add("alerta");
      startTimer.classList.add("hidden");
      return;
    }
    actualizarTemporizadorDisplay(countdown);
  }, 10);
  resumeTimer.classList.add("hidden");
  pauseTimer.classList.remove("hidden");
});

resetTimer.addEventListener("click", () => {
  clearInterval(countdownInterval);
  countdown = initialTime;
  temporizadorDisplay.classList.remove("alerta");
  actualizarTemporizadorDisplay(countdown);
  startTimer.classList.remove("hidden");
  pauseTimer.classList.add("hidden");
  resumeTimer.classList.add("hidden");
});

function actualizarTemporizadorDisplay(ms) {
  let total = Math.max(0, ms);
  let milis = total % 1000;
  let s = Math.floor(total / 1000) % 60;
  let m = Math.floor(total / 60000) % 60;
  let h = Math.floor(total / 3600000);
  temporizadorDisplay.innerHTML = `${formato(h)}:${formato(m)}:${formato(
    s
  )}.<span class="milliseconds">${milis.toString().padStart(3, "0")}</span>`;
}
