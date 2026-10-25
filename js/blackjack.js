let mazo = [];
let cartasJugador = [];
let cartasCrupier = [];
let juegoEnCurso = false;
let nombreJugadorBlackjack = ""; // Variable para guardar el nombre ingresado

// Referencias del DOM
const contCartasJugador = document.getElementById("cartas-jugador");
const contCartasCrupier = document.getElementById("cartas-crupier");
const elemPuntajeJugador = document.getElementById("puntaje-jugador");
const elemPuntajeCrupier = document.getElementById("puntaje-crupier");
const elemResultado = document.getElementById("resultado");

const btnPedir = document.getElementById("pedir");
const btnPlantar = document.getElementById("plantar");
const btnIniciar = document.getElementById("btn-iniciar");
const btnNuevoJuego = document.getElementById("btn-nuevo-juego");
const inputNombre = document.getElementById("nombre-jugador");
const tituloJugador = document.getElementById("titulo-jugador");

// Crear mazo
function crearMazo() {
    const palos = ["♠", "♥", "♦", "♣"];
    const valores = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    mazo = [];

    for (let palo of palos) {
        for (let valor of valores) {
            mazo.push({ valor, palo });
        }
    }
    mazo.sort(() => Math.random() - 0.5);
}

// Obtener valor de carta
function obtenerValorCarta(carta) {
    if (["J", "Q", "K"].includes(carta.valor)) return 10;
    if (carta.valor === "A") return 11;
    return parseInt(carta.valor);
}

// Calcular puntaje acumulado
function calcularPuntaje(mano) {
    let puntos = 0;
    let ases = 0;

    for (let carta of mano) {
        puntos += obtenerValorCarta(carta);
        if (carta.valor === "A") ases++;
    }

    while (puntos > 21 && ases > 0) {
        puntos -= 10;
        ases--;
    }

    return puntos;
}

// Renderizar cartas en pantalla
function renderizarCartas(contenedor, mano, ocultarSegunda = false) {
    contenedor.innerHTML = "";
    mano.forEach((carta, index) => {
        const divCarta = document.createElement("div");
        divCarta.classList.add("carta");

        if (ocultarSegunda && index === 1) {
            divCarta.textContent = "?";
        } else {
            divCarta.textContent = `${carta.valor}${carta.palo}`;
            if (carta.palo === "♥" || carta.palo === "♦") {
                divCarta.classList.add("roja");
            }
        }
        contenedor.appendChild(divCarta);
    });
}

// Evento para validar e iniciar
btnIniciar.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    if (nombre === "") {
        alert("Por favor ingresá tu nombre antes de comenzar.");
        return;
    }

    nombreJugadorBlackjack = nombre; // Guardamos el nombre localmente
    tituloJugador.textContent = `Cartas de ${nombre}`;
    inputNombre.disabled = true;
    btnIniciar.disabled = true;
    btnPedir.disabled = false;
    btnPlantar.disabled = false;
    btnNuevoJuego.classList.add("oculto");

    iniciarJuego();
});

// Iniciar juego
function iniciarJuego() {
    crearMazo();
    cartasJugador = [mazo.pop(), mazo.pop()];
    cartasCrupier = [mazo.pop(), mazo.pop()];
    juegoEnCurso = true;

    elemResultado.classList.add("oculto");
    elemResultado.textContent = "";

    renderizarCartas(contCartasJugador, cartasJugador);
    renderizarCartas(contCartasCrupier, cartasCrupier, true);

    const ptsJugador = calcularPuntaje(cartasJugador);
    elemPuntajeJugador.textContent = `Puntaje: ${ptsJugador}`;
    elemPuntajeCrupier.textContent = `Puntaje Crupier: ?`;

    if (ptsJugador === 21) {
        finalizarJuego("Blackjack, Ganaste.");
    }
}

// Pedir carta
btnPedir.addEventListener("click", () => {
    if (!juegoEnCurso) return;

    cartasJugador.push(mazo.pop());
    renderizarCartas(contCartasJugador, cartasJugador);

    const ptsJugador = calcularPuntaje(cartasJugador);
    elemPuntajeJugador.textContent = `Puntaje: ${ptsJugador}`;

    if (ptsJugador > 21) {
        finalizarJuego("Te pasaste de 21. Perdiste.");
    } else if (ptsJugador === 21) {
        plantarse();
    }
});

// Plantarse
btnPlantar.addEventListener("click", plantarse);

function plantarse() {
    if (!juegoEnCurso) return;
    juegoEnCurso = false;

    renderizarCartas(contCartasCrupier, cartasCrupier);
    let ptsCrupier = calcularPuntaje(cartasCrupier);

    while (ptsCrupier < 17) {
        cartasCrupier.push(mazo.pop());
        renderizarCartas(contCartasCrupier, cartasCrupier);
        ptsCrupier = calcularPuntaje(cartasCrupier);
    }

    const ptsJugador = calcularPuntaje(cartasJugador);
    elemPuntajeCrupier.textContent = `Puntaje Crupier: ${ptsCrupier}`;

    if (ptsCrupier > 21) {
        finalizarJuego("El crupier se pasó de 21. Ganaste.");
    } else if (ptsJugador > ptsCrupier) {
        finalizarJuego("Ganaste.");
    } else if (ptsJugador < ptsCrupier) {
        finalizarJuego("Gana la casa.");
    } else {
        finalizarJuego("Empate.");
    }
}

// Finalizar juego y registrar récord
function finalizarJuego(mensaje) {
    juegoEnCurso = false;
    btnPedir.disabled = true;
    btnPlantar.disabled = true;

    renderizarCartas(contCartasCrupier, cartasCrupier);
    elemPuntajeCrupier.textContent = `Puntaje Crupier: ${calcularPuntaje(cartasCrupier)}`;

    elemResultado.textContent = mensaje;
    elemResultado.classList.remove("oculto");
    btnNuevoJuego.classList.remove("oculto");

    if (mensaje.includes("Ganaste")) {
        let victorias = parseInt(localStorage.getItem("record_blackjack") || "0");
        let nombreActual = nombreJugadorBlackjack || document.getElementById("nombre-jugador").value.trim() || "Jugador";
        
        localStorage.setItem("record_blackjack", victorias + 10);
        localStorage.setItem("record_blackjack_jugador", nombreActual); // Guardamos el nombre asociado al récord
    }
}

// Boton nueva partida
btnNuevoJuego.addEventListener("click", () => {
    btnPedir.disabled = false;
    btnPlantar.disabled = false;
    iniciarJuego();
});