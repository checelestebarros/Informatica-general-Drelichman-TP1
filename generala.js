// generala

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

// dibuja los dados en pantalla utilizando imágenes dinámicas
function mostrarDados() {
  dadosHTML.innerText = ""; // limpiamos el contenedor

  for (let i = 0; i < 5; i++) {
    let dadoBoton = document.createElement("button");

    // si el dado todavia no se tiro (vale 0 al inicio), mostramos dado1.png por defecto
    let numeroCara = dados[i] === 0 ? 1 : dados[i];

    // creamos la etiqueta de imagen dinámicamente según la cara obtenida
    let imagenDado = document.createElement("img");
    imagenDado.src = "img/dado" + numeroCara + ".png"; // Construye ej: "img/dado1.png"
    imagenDado.alt = "Dado " + numeroCara;
    imagenDado.width = 60; // Tamaño de la imagen

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


function finalizarTurno() {
  // 1. Sumamos los 5 dados que sacó en esta ronda
  let suma = 0;
  for (let i = 0; i < 5; i++) {
    suma += dados[i];
  }

  
  if (turnoJugador === 1) {
    
    puntosJ1 = suma; // guardamos los puntos en puntosJ1
    document.getElementById("puntos-j1").textContent = puntosJ1; // Los mostramos en pantalla

   
    turnoJugador = 2;
    document.getElementById("indicador-turno").innerHTML = "Turno actual: <strong>Jugador 2</strong>";
    document.getElementById("mensaje").textContent = "¡J1 terminó sus 3 tiradas! Ahora le toca al Jugador 2.";

    //(limpiamos los dados a 0 y las tiradas a 0/3
    prepararSiguienteTurno();

  } else {
    /
    puntosJ2 = suma; // guardamos los puntos en puntosJ2
    document.getElementById("puntos-j2").textContent = puntosJ2; // Los mostramos en pantalla

    // llamamos a determinar quien gano
    determinarGanador();
  }
}

//  genera números aleatorios (1-6) para los dados que NO esten guardados
function tirarDados() {
  if (tiradas < 3) {
    tiradas++;

    for (let i = 0; i < 5; i++) {
      if (!guardados[i]) {
        dados[i] = Math.floor(Math.random() * 6) + 1;
      }
    }

    mostrarDados();
    textoTiradas.innerText = "Tiradas: " + tiradas + " / 3";

    // llega a la 3ra tirada se bloquea el botón y se calcula el record
    if (tiradas === 3) {
      finalizarTurno();
    }
  }
}

// reinicia la partida para volver a jugar
function reiniciar() {
  dados = [0, 0, 0, 0, 0];
  guardados = [false, false, false, false, false];
  tiradas = 0;
  puntajeTotal = 0;

  mostrarDados();

  textoTiradas.innerText = "Tiradas: 0 / 3";
  document.getElementById("mensaje").textContent = "";
  btnTirar.disabled = false;
}


btnTirar.onclick = tirarDados;
btnReiniciar.onclick = reiniciar;


mostrarDados();