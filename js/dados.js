let puntajeJ1 = 0;
let puntajeJ2 = 0;
let turnoActual = 1;
let tiradas = 0;
const MAX_TIRADAS = 3;

function obtenerNombreJ1() {
  const inputJ1 = document.getElementById("j1");
  return inputJ1 && inputJ1.value.trim() !== "" ? inputJ1.value : "Jugador 1";
}

function obtenerNombreJ2() {
  const inputJ2 = document.getElementById("j2");
  return inputJ2 && inputJ2.value.trim() !== "" ? inputJ2.value : "Jugador 2";
}

function actualizarNombres() {
  const elP1 = document.getElementById("p1-name");
  const elP2 = document.getElementById("p2-name");
  const elCurrent = document.getElementById("current-player");

  if (elP1) elP1.innerText = obtenerNombreJ1();
  if (elP2) elP2.innerText = obtenerNombreJ2();
  if (elCurrent) {
    elCurrent.innerText = turnoActual === 1 ? obtenerNombreJ1() : obtenerNombreJ2();
  }
}

function mostrarDados(dados) {
  const contenedor = document.getElementById("dice-container");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  dados.forEach(valor => {
    const img = document.createElement("img");
    img.src = `img/dado${valor}.png`;
    img.alt = `Dado ${valor}`;
    img.className = "dado-img";
    contenedor.appendChild(img);
  });
}

function tirarDados() {
  if (tiradas >= MAX_TIRADAS) return;

  actualizarNombres();

  const dado1 = Math.floor(Math.random() * 6) + 1;
  const dado2 = Math.floor(Math.random() * 6) + 1;
  const suma = dado1 + dado2;

  mostrarDados([dado1, dado2]);

  tiradas++;
  const elTiradas = document.getElementById("roll-count");
  if (elTiradas) elTiradas.innerText = tiradas;

  if (turnoActual === 1) {
    puntajeJ1 += suma;
    const elP1Score = document.getElementById("p1-score");
    if (elP1Score) elP1Score.innerText = puntajeJ1;
  } else {
    puntajeJ2 += suma;
    const elP2Score = document.getElementById("p2-score");
    if (elP2Score) elP2Score.innerText = puntajeJ2;
  }

  if (tiradas === MAX_TIRADAS) {
    setTimeout(finalizarTurno, 500);
  }
}

function finalizarTurno() {
  if (turnoActual === 1) {
    turnoActual = 2;
    tiradas = 0;
    const elTiradas = document.getElementById("roll-count");
    if (elTiradas) elTiradas.innerText = "0";
    actualizarNombres();
    alert(`Turno de ${obtenerNombreJ1()} finalizado. Ahora le toca a ${obtenerNombreJ2()}`);
  } else {
    determinarGanador();
  }
}

function determinarGanador() {
  let mensaje = "";
  const nombre1 = obtenerNombreJ1();
  const nombre2 = obtenerNombreJ2();

  if (puntajeJ1 > puntajeJ2) {
    mensaje = `¡Ganó ${nombre1} con ${puntajeJ1} puntos!`;
  } else if (puntajeJ2 > puntajeJ1) {
    mensaje = `¡Ganó ${nombre2} con ${puntajeJ2} puntos!`;
  } else {
    mensaje = `¡Empate entre ${nombre1} y ${nombre2} con ${puntajeJ1} puntos!`;
  }

  alert(mensaje);
}

function reiniciarJuego() {
  puntajeJ1 = 0;
  puntajeJ2 = 0;
  turnoActual = 1;
  tiradas = 0;

  const elP1Score = document.getElementById("p1-score");
  const elP2Score = document.getElementById("p2-score");
  const elTiradas = document.getElementById("roll-count");
  const contenedor = document.getElementById("dice-container");

  if (elP1Score) elP1Score.innerText = "0";
  if (elP2Score) elP2Score.innerText = "0";
  if (elTiradas) elTiradas.innerText = "0";
  if (contenedor) contenedor.innerHTML = "";

  actualizarNombres();
}

document.addEventListener("DOMContentLoaded", () => {
  const btnTirar = document.getElementById("btn-tirar");
  const btnNueva = document.getElementById("btn-nueva");
  const inputJ1 = document.getElementById("j1");
  const inputJ2 = document.getElementById("j2");

  if (btnTirar) btnTirar.addEventListener("click", tirarDados);
  if (btnNueva) btnNueva.addEventListener("click", reiniciarJuego);

  if (inputJ1) inputJ1.addEventListener("input", actualizarNombres);
  if (inputJ2) inputJ2.addEventListener("input", actualizarNombres);

  actualizarNombres();
});