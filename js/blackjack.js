// Estado de la partida.
let mazo = [];
let cartasJugador = [];
let cartasCrupier = [];
let juegoEnCurso = false;
let nombreJugadorBlackjack = "";

// Elementos de la página que se actualizan durante el juego.
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

// Crea un mazo estándar y lo mezcla.
function crearMazo() {
    const palos = ["♠", "♥", "♦", "♣"];
    const valores = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    mazo = [];

    // Recorre cada palo para crear todas las combinaciones de cartas.
    for (let palo of palos) {
        // Agrega al mazo cada valor posible del palo actual.
        for (let valor of valores) {
            mazo.push({ valor, palo });
        }
    }
    mazo.sort(() => Math.random() - 0.5);
}

// Las figuras valen 10, el as comienza valiendo 11 y las demás cartas su número.
function obtenerValorCarta(carta) {
    // Las figuras comparten el mismo valor en Blackjack.
    if (["J", "Q", "K"].includes(carta.valor)) return 10;
    // El as se cuenta inicialmente como 11; luego puede ajustarse en el puntaje total.
    if (carta.valor === "A") return 11;
    return parseInt(carta.valor);
}

// Calcula el puntaje; ajusta los ases de 11 a 1 si la mano supera 21.
function calcularPuntaje(mano) {
    let puntos = 0;
    let ases = 0;

    // Suma los valores y cuenta los ases para poder corregirlos si se supera 21.
    for (let carta of mano) {
        puntos += obtenerValorCarta(carta);
        // Registra los ases, que son los únicos que pueden cambiar de valor.
        if (carta.valor === "A") ases++;
    }

    // Cada as puede bajar de 11 a 1 hasta que el puntaje deje de superar 21.
    while (puntos > 21 && ases > 0) {
        puntos -= 10;
        ases--;
    }

    return puntos;
}

// Dibuja las cartas de una mano y puede ocultar la segunda.
function renderizarCartas(contenedor, mano, ocultarSegunda = false) {
    contenedor.innerHTML = "";
    // Crea un elemento visual por cada carta de la mano.
    mano.forEach((carta, index) => {
        const divCarta = document.createElement("div");
        divCarta.classList.add("carta");

        // Muestra "?" solo para la segunda carta oculta del crupier.
        if (ocultarSegunda && index === 1) {
            divCarta.textContent = "?";
        } else {
            divCarta.textContent = `${carta.valor}${carta.palo}`;
            // Marca corazones y diamantes para que el CSS los muestre en rojo.
            if (carta.palo === "♥" || carta.palo === "♦") {
                divCarta.classList.add("roja");
            }
        }
        contenedor.appendChild(divCarta);
    });
}

// Valida el nombre y comienza la primera partida.
btnIniciar.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    // Si no hay nombre, avisa y detiene el inicio; de lo contrario continúa.
    if (nombre === "") {
        alert("Por favor ingresá tu nombre antes de comenzar.");
        return;
    }

    nombreJugadorBlackjack = nombre;
    tituloJugador.textContent = `Cartas de ${nombre}`;
    inputNombre.disabled = true;
    btnIniciar.disabled = true;
    btnPedir.disabled = false;
    btnPlantar.disabled = false;
    btnNuevoJuego.classList.add("oculto");

    iniciarJuego();
});

// Prepara una partida repartiendo dos cartas a cada mano.
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

    // Si las dos cartas iniciales suman 21, finaliza sin esperar otra acción.
    if (ptsJugador === 21) {
        finalizarJuego("Blackjack, Ganaste.");
    }
}

// Pide una carta y comprueba si el jugador supera 21.
btnPedir.addEventListener("click", () => {
    // Ignora el pedido cuando no hay una partida activa.
    if (!juegoEnCurso) return;

    cartasJugador.push(mazo.pop());
    renderizarCartas(contCartasJugador, cartasJugador);

    const ptsJugador = calcularPuntaje(cartasJugador);
    elemPuntajeJugador.textContent = `Puntaje: ${ptsJugador}`;

    // Más de 21 significa derrota; con 21 exactos el jugador se planta automáticamente.
    if (ptsJugador > 21) {
        finalizarJuego("Te pasaste de 21. Perdiste.");
    } else if (ptsJugador === 21) {
        plantarse();
    }
});

btnPlantar.addEventListener("click", plantarse);

// El crupier pide hasta llegar a 17; luego se comparan los puntajes.
function plantarse() {
    // Evita que el turno del crupier se ejecute más de una vez.
    if (!juegoEnCurso) return;
    juegoEnCurso = false;

    renderizarCartas(contCartasCrupier, cartasCrupier);
    let ptsCrupier = calcularPuntaje(cartasCrupier);

    // Según la regla del juego, el crupier debe pedir mientras tenga menos de 17.
    while (ptsCrupier < 17) {
        cartasCrupier.push(mazo.pop());
        renderizarCartas(contCartasCrupier, cartasCrupier);
        ptsCrupier = calcularPuntaje(cartasCrupier);
    }

    const ptsJugador = calcularPuntaje(cartasJugador);
    elemPuntajeCrupier.textContent = `Puntaje Crupier: ${ptsCrupier}`;

    // Decide el resultado comparando puntajes y considerando primero si el crupier se pasó.
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

// Muestra el resultado y suma puntos al récord si el jugador ganó.
function finalizarJuego(mensaje) {
    juegoEnCurso = false;
    btnPedir.disabled = true;
    btnPlantar.disabled = true;

    renderizarCartas(contCartasCrupier, cartasCrupier);
    elemPuntajeCrupier.textContent = `Puntaje Crupier: ${calcularPuntaje(cartasCrupier)}`;

    elemResultado.textContent = mensaje;
    elemResultado.classList.remove("oculto");
    btnNuevoJuego.classList.remove("oculto");

    // Solo las victorias suman 10 puntos y guardan el nombre del jugador.
    if (mensaje.includes("Ganaste")) {
        let victorias = parseInt(localStorage.getItem("record_blackjack") || "0");
        let nombreActual = nombreJugadorBlackjack || document.getElementById("nombre-jugador").value.trim() || "Jugador";
        
        localStorage.setItem("record_blackjack", victorias + 10);
        localStorage.setItem("record_blackjack_jugador", nombreActual);
    }
}

// Vuelve a habilitar las acciones y reparte cartas nuevas.
btnNuevoJuego.addEventListener("click", () => {
    btnPedir.disabled = false;
    btnPlantar.disabled = false;
    iniciarJuego();
});