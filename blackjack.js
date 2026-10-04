const palos = ["♥", "♦", "♣", "♠"];

const valores = [
    { nombre: "A", puntos: 11 },
    { nombre: "2", puntos: 2 },
    { nombre: "3", puntos: 3 },
    { nombre: "4", puntos: 4 },
    { nombre: "5", puntos: 5 },
    { nombre: "6", puntos: 6 },
    { nombre: "7", puntos: 7 },
    { nombre: "8", puntos: 8 },
    { nombre: "9", puntos: 9 },
    { nombre: "10", puntos: 10 },
    { nombre: "J", puntos: 10 },
    { nombre: "Q", puntos: 10 },
    { nombre: "K", puntos: 10 }
];

let mazo = [];
let cartasJugador = [];
let cartasCrupier = [];
let juegoTerminado = false;


// Crear el mazo
function crearMazo() {

    mazo = [];

    for (let palo of palos) {
        for (let valor of valores) {
            mazo.push({
                palo: palo,
                nombre: valor.nombre,
                puntos: valor.puntos
            });
        }
    }
}


// Mezclar el mazo
function mezclar() {
    for (let i = mazo.length - 1; i > 0; i--) {
        let posicion = Math.floor(Math.random() * (i + 1));
        let temporal = mazo[i];
        mazo[i] = mazo[posicion];
        mazo[posicion] = temporal;
    }
}


// Sacar una carta
function sacarCarta() {
    return mazo.pop()
}


// Calcular puntaje
function calcularPuntaje(cartas) {
    let puntaje = 0;
    let ases = 0;
    for (let carta of cartas) {
        puntaje += carta.puntos;
        if (carta.nombre === "A") {
            ases++;
        }
    }


    // Si se pasa de 21 y hay un As,
    // el As vale 1 en lugar de 11
    while (puntaje > 21 && ases > 0) {
        puntaje -= 10;
        ases--;
    }
    return puntaje;
}


// Mostrar cartas del jugador
function mostrarJugador() {
    const contenedor = document.getElementById("cartas-jugador");
    contenedor.innerHTML = "";
    for (let carta of cartasJugador) {
        const elemento = document.createElement("div");
        elemento.classList.add("carta");
        if (carta.palo === "♥" || carta.palo === "♦") {
            elemento.classList.add("roja");
        }
        elemento.textContent = carta.nombre + carta.palo;
        contenedor.appendChild(elemento);
    }

    document.getElementById("puntaje-jugador").textContent =
        calcularPuntaje(cartasJugador);
}


// Mostrar cartas del crupier
function mostrarCrupier(mostrarTodas = false) {

    const contenedor = document.getElementById("cartas-crupier");

    contenedor.innerHTML = "";

    for (let i = 0; i < cartasCrupier.length; i++) {

        const carta = cartasCrupier[i];

        const elemento = document.createElement("div");

        elemento.classList.add("carta");

        if (i === 1 && !mostrarTodas) {

            elemento.textContent = "?";

        } else {

            if (carta.palo === "♥" || carta.palo === "♦") {
                elemento.classList.add("roja");
            }

            elemento.textContent = carta.nombre + carta.palo;
        }

        contenedor.appendChild(elemento);
    }

    if (mostrarTodas) {

        document.getElementById("puntaje-crupier").textContent =
            calcularPuntaje(cartasCrupier);

    } else {

        document.getElementById("puntaje-crupier").textContent = "?";

    }
}


// Comenzar una partida
function iniciarJuego() {

    crearMazo();

    mezclar();

    cartasJugador = [];
    cartasCrupier = [];

    juegoTerminado = false;

    document.getElementById("resultado").textContent = "";

    // Repartir dos cartas a cada uno
    cartasJugador.push(sacarCarta());
    cartasCrupier.push(sacarCarta());
    cartasJugador.push(sacarCarta());
    cartasCrupier.push(sacarCarta());

    mostrarJugador();
    mostrarCrupier();

    comprobarBlackjack();
}


// Comprobar Blackjack
function comprobarBlackjack() {

    let jugador = calcularPuntaje(cartasJugador);
    let crupier = calcularPuntaje(cartasCrupier);

    if (jugador === 21 && crupier === 21) {
        terminarJuego("Empate. Ambos tienen Blackjack.");
    } else if (jugador === 21) {
        terminarJuego("Blackjack, Ganaste.");
    } else if (crupier === 21) {
        terminarJuego("El crupier tiene Blackjack. Perdiste.");
    }
}


// Pedir una carta
function pedirCarta() {
    if (juegoTerminado) {
        return;
    }

    cartasJugador.push(sacarCarta());
    mostrarJugador();

    let puntaje = calcularPuntaje(cartasJugador);

    if (puntaje > 21) {
        terminarJuego("Te pasaste de 21. Perdiste.");
    } else if (puntaje === 21) {
        turnoCrupier();
    }
}


// Plantarse
function plantarse() {
    if (juegoTerminado) {
        return;
    }
    turnoCrupier();

}


// Turno del crupier
function turnoCrupier() {

    while (calcularPuntaje(cartasCrupier) < 17) {
        cartasCrupier.push(sacarCarta());
    }
    mostrarCrupier(true);
    compararResultados();
}


// Comparar resultados
function compararResultados() {

    let jugador = calcularPuntaje(cartasJugador);
    let crupier = calcularPuntaje(cartasCrupier);

    if (crupier > 21) {
        terminarJuego("El crupier se paso, Ganaste.");
    } else if (jugador > crupier) {
        terminarJuego("Ganaste");
    } else if (jugador < crupier) {
        terminarJuego("Perdiste");
    } else {
        terminarJuego("Empate.");
    }
}


// Terminar partida
function terminarJuego(mensaje) {

    juegoTerminado = true;
    document.getElementById("resultado").textContent = mensaje;
    mostrarJugador();
    mostrarCrupier(true);
}


// Botones
document.getElementById("btn-pedir").addEventListener("click", function() {
    pedirCarta();
});

document.getElementById("btn-plantarse").addEventListener("click", function() {
    plantarse();
});

document.getElementById("btn-reiniciar").addEventListener("click", function() {
    iniciarJuego();
});


// Iniciar automáticamente
iniciarJuego();