// variables globales 
let dados = [0, 0, 0, 0, 0];
let guardados = [false, false, false, false, false];
let tiradas = 0;
let turnoJugador = 1; 
let puntosJ1 = 0;
let puntosJ2 = 0;

// referencias a los elementos del DOM
const dadosHTML = document.querySelector("#dados");
const btnTirar = document.querySelector("#btnTirar");
const btnReiniciar = document.querySelector("#btnReiniciar");
const textoTiradas = document.querySelector("#tiradas");

// nombres de los jugadores
function obtenerNombreJ1() {
  let input = document.getElementById("input-j1").value.trim();
  return input !== "" ? input : "Jugador 1";
}

function obtenerNombreJ2() {
  let input = document.getElementById("input-j2").value.trim();
  return input !== "" ? input : "Jugador 2";
}

// dibuja los dados en pantalla utilizando imágenes dinámicas
function mostrarDados() {
  dadosHTML.innerText = ""; // limpiamos el contenedor

  for (let i = 0; i < 5; i++) {
    let dadoBoton = document.createElement("button");

    // si el dado todavia no se tiro (vale 0 al inicio), mostramos dado1.png por defecto
    let numeroCara = dados[i] === 0 ? 1 : dados[i];

    // creamos la etiqueta de imagen dinámicamente según la cara obtenida
    let imagenDado = document.createElement("img");
    imagenDado.src = "img/dado" + numeroCara + ".png"; 
    imagenDado.alt = "Dado " + numeroCara;
    imagenDado.width = 40; 

    dadoBoton.appendChild(imagenDado);

    // si el dado fue seleccionado/guardado le agregamos la clase CSS
    if (guardados[i]) {
      dadoBoton.classList.add("guardado");
    }

    // al hacer clic sobre el dado, alternamos si se guarda o no
    dadoBoton.onclick = function () {
      // solo permitimos marcar dados si ya se hizo al menos 1 tirada y menos de 3
      if (tiradas > 0 && tiradas < 3) {
        guardados[i] = !guardados[i];
        mostrarDados();
      }
    };

    dadosHTML.appendChild(dadoBoton);
  }
}

// Prepara el tablero para el siguiente turno
function prepararSiguienteTurno() {
  dados = [0, 0, 0, 0, 0];
  guardados = [false, false, false, false, false];
  tiradas = 0;
  textoTiradas.innerText = "Tiradas: 0 / 3";
  mostrarDados();
}

// evalua si los 5 dados tienen el mismo valor
function esCombo() {
  let primerDado = dados[0];
  if (primerDado === 0) return false;
  return dados.every(function(dado) {
    return dado === primerDado;
  });
}

// evalua el ganador al finalizar los 2 turnos y guarda en localStorage
function determinarGanador() {
  btnTirar.disabled = true;

  let nombreJ1 = obtenerNombreJ1();
  let nombreJ2 = obtenerNombreJ2();

  // guardamos la partida completa de ambos jugadores en formato JSON
  let datosPartida = {
    jugador1: { nombre: nombreJ1, puntos: puntosJ1 },
    jugador2: { nombre: nombreJ2, puntos: puntosJ2 },
    fecha: new Date().toLocaleDateString()
  };

  localStorage.setItem("ultima_partida_generala", JSON.stringify(datosPartida));

  // calculamos el récord histórico
  let mayorPuntaje = Math.max(puntosJ1, puntosJ2);
  let recordPrevio = parseInt(localStorage.getItem("record_dados")) || 0;

  if (mayorPuntaje > recordPrevio) {
    let ganadorRecord = puntosJ1 >= puntosJ2 ? nombreJ1 : nombreJ2;
    localStorage.setItem("record_dados", mayorPuntaje);
    localStorage.setItem("record_jugador", ganadorRecord);
  }

  // cartel final
  if (puntosJ1 > puntosJ2) {
    document.getElementById("mensaje").textContent = "¡Fin del juego! ¡Ganó " + nombreJ1 + " con " + puntosJ1 + " pts!";
  } else if (puntosJ2 > puntosJ1) {
    document.getElementById("mensaje").textContent = "¡Fin del juego! ¡Ganó " + nombreJ2 + " con " + puntosJ2 + " pts!";
  } else {
    document.getElementById("mensaje").textContent = "¡Fin del juego! ¡Empate con " + puntosJ1 + " pts!";
  }
}

function finalizarTurno() {
  let suma = 0;
  for (let i = 0; i < 5; i++) {
    suma += dados[i];
  }

  // bonus: si los 5 dados son iguales sumamos 20 puntos extra
  if (esCombo()) {
    suma += 20; 
  }

  let nombreJ1 = obtenerNombreJ1();
  let nombreJ2 = obtenerNombreJ2();

  if (turnoJugador === 1) {
    puntosJ1 = suma;
    document.getElementById("puntos-j1").textContent = puntosJ1;
    document.getElementById("nombre-display-j1").textContent = nombreJ1;
    
    turnoJugador = 2;
    document.getElementById("indicador-turno").innerHTML = "Turno actual: <strong>" + nombreJ2 + "</strong>";
    document.getElementById("mensaje").textContent = "¡" + nombreJ1 + " terminó su turno! Le toca a " + nombreJ2 + ".";
    prepararSiguienteTurno();

  } else {
    puntosJ2 = suma;
    document.getElementById("puntos-j2").textContent = puntosJ2;
    document.getElementById("nombre-display-j2").textContent = nombreJ2;
    determinarGanador();
  }
}

// genera numeros aleatorios (1-6) para los dados que NO esten guardados
function tirarDados() {
  // VALIDACION DE NOMBRE 
  let valJ1 = document.getElementById("input-j1").value.trim();
  let valJ2 = document.getElementById("input-j2").value.trim();

  if (valJ1 === "" || valJ2 === "") {
    alert("¡Alto ahí! Por favor ingresen los nombres de ambos jugadores para poder jugar.");
    return; 
  }

  // tiradas
  if (tiradas === 3) {
    finalizarTurno();
    return;
  }

  tiradas++;

  for (let i = 0; i < 5; i++) {
    if (!guardados[i]) {
      dados[i] = Math.floor(Math.random() * 6) + 1;
    }
  }

  mostrarDados();
  textoTiradas.innerText = "Tiradas: " + tiradas + " / 3";

  if (tiradas === 3) {
    let nombreActual = turnoJugador === 1 ? obtenerNombreJ1() : obtenerNombreJ2();
    document.getElementById("mensaje").textContent = "¡" + nombreActual + " completó sus 3 tiradas! Presiona 'Tirar' para pasar de turno.";
  }
}

// reinicia la partida para volver a jugar
function reiniciar() {
  puntosJ1 = 0;
  puntosJ2 = 0;
  turnoJugador = 1;

  document.getElementById("puntos-j1").textContent = "0";
  document.getElementById("puntos-j2").textContent = "0";
  document.getElementById("indicador-turno").innerHTML = "Turno actual: <strong>Jugador 1</strong>";
  document.getElementById("mensaje").textContent = "";

  btnTirar.disabled = false;
  prepararSiguienteTurno();
}

// asigno de eventos e inicialización
btnTirar.onclick = tirarDados;
btnReiniciar.onclick = reiniciar;

mostrarDados();