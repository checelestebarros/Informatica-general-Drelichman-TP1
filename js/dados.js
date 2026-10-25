let puntajeJ1 = 0;
let puntajeJ2 = 0;
let turnoActual = 1;
let tiradas = 0;
const MAX_TIRADAS = 3;

// Declaramos las funciones tradicionales con 'function' para que el HTML (onclick) las reconozca siempre
function obtenerNombreJ1() {
  const inputJ1 = document.getElementById("nombreJ1");
  return inputJ1 && inputJ1.value.trim() !== "" ? inputJ1.value : "Jugador 1";
}

function obtenerNombreJ2() {
  const inputJ2 = document.getElementById("nombreJ2");
  return inputJ2 && inputJ2.value.trim() !== "" ? inputJ2.value : "Jugador 2";
}

function actualizarInterfaz() {
  const elNombreJ1 = document.getElementById("nombreJugador1");
  const elNombreJ2 = document.getElementById("nombreJugador2");
  const elPuntosJ1 = document.getElementById("puntosJ1");
  const elPuntosJ2 = document.getElementById("puntosJ2");
  const elTurno = document.getElementById("turnoActual");
  const elTiradas = document.getElementById("tiradasHechas");

  if (elNombreJ1) elNombreJ1.innerText = obtenerNombreJ1();
  if (elNombreJ2) elNombreJ2.innerText = obtenerNombreJ2();
  if (elPuntosJ1) elPuntosJ1.innerText = puntajeJ1;
  if (elPuntosJ2) elPuntosJ2.innerText = puntajeJ2;
  
  if (elTurno) {
    elTurno.innerText = turnoActual === 1 ? obtenerNombreJ1() : obtenerNombreJ2();
  }
  if (elTiradas) {
    elTiradas.innerText = tiradas;
  }
}

function mostrarDados(dados) {
  const contenedor = document.querySelector(".resultado-dados");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  dados.forEach(valor => {
    const img = document.createElement("img");
    img.src = `img/dado${valor}.png`;
    img.alt = `Dado ${valor}`;
    img.style.width = "60px";
    img.style.margin = "5px";
    contenedor.appendChild(img);
  });
}

function tirarDados() {
  if (tiradas >= MAX_TIRADAS) {
    alert("Ya completaste las 3 tiradas de tu turno.");
    return;
  }

  const dado1 = Math.floor(Math.random() * 6) + 1;
  const dado2 = Math.floor(Math.random() * 6) + 1;
  const suma = dado1 + dado2;

  mostrarDados([dado1, dado2]);

  tiradas++;

  if (turnoActual === 1) {
    puntajeJ1 += suma;
  } else {
    puntajeJ2 += suma;
  }

  actualizarInterfaz();

  if (tiradas === MAX_TIRADAS) {
    setTimeout(finalizarTurno, 300);
  }
}

function finalizarTurno() {
  if (turnoActual === 1) {
    turnoActual = 2;
    tiradas = 0;
    actualizarInterfaz();
    alert(`Turno de ${obtenerNombreJ1()} finalizado. Ahora le toca a ${obtenerNombreJ2()}`);
  } else {
    determinarGanador();
  }
}

function determinarGanador() {
  const n1 = obtenerNombreJ1();
  const n2 = obtenerNombreJ2();
  let msj = "";

  if (puntajeJ1 > puntajeJ2) {
    msj = `¡Ganó ${n1} con ${puntajeJ1} puntos!`;
  } else if (puntajeJ2 > puntajeJ1) {
    msj = `¡Ganó ${n2} con ${puntajeJ2} puntos!`;
  } else {
    msj = `¡Empate entre ${n1} y ${n2} con ${puntajeJ1} puntos!`;
  }

  alert(msj);
}

function reiniciarJuego() {
  puntajeJ1 = 0;
  puntajeJ2 = 0;
  turnoActual = 1;
  tiradas = 0;

  const contenedor = document.querySelector(".resultado-dados");
  if (contenedor) contenedor.innerHTML = "";

  actualizarInterfaz();
}

// Escuchadores de eventos cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  const inputJ1 = document.getElementById("nombreJ1");
  const inputJ2 = document.getElementById("nombreJ2");

  if (inputJ1) inputJ1.addEventListener("input", actualizarInterfaz);
  if (inputJ2) inputJ2.addEventListener("input", actualizarInterfaz);

  actualizarInterfaz();
});