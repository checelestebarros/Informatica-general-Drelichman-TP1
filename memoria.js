//borrador
const numeros = ['1', '2', '3', '4', '5', '6', '7', '8'];
let cartas = [...numeros, ...numeros];

let cartasReveladas = [];
let paresEncontrados = 0;

const tablero = document.getElementById('tablero');
const btnReiniciar = document.getElementById('btn-reiniciar');

function iniciarJuego() {
    tablero.innerHTML = '';
    cartasReveladas = [];
    paresEncontrados = 0;
    
  // Mezclar cartas al azar
    cartas.sort(() => Math.random() - 0.5);

    cartas.forEach((numero) => {
    const carta = document.createElement('div');
    carta.classList.add('carta');
    carta.textContent = numero;
    
    // Al hacer clic, ejecuta la función revelarCarta
    carta.addEventListener('click', () => revelarCarta(carta));
    tablero.appendChild(carta);
    });
}

function revelarCarta(carta) {
  // Si ya hay 2 cartas abiertas o se hace clic en una ya abierta, no hace nada
    if (cartasReveladas.length === 2 || carta.classList.contains('revelada')) return;

  // CAMBIA el fondo de la carta para mostrar el número s
    carta.classList.add('revelada');
    cartasReveladas.push(carta);

    if (cartasReveladas.length === 2) {
    verificarPar();
    }
}

function verificarPar() {
    const [carta1, carta2] = cartasReveladas;

    if (carta1.textContent === carta2.textContent) {
    paresEncontrados++;
    cartasReveladas = [];
    if (paresEncontrados === numeros.length) {
        setTimeout(() => alert('¡Ganaste!'), 300);
    }
    } else {
    // si no es par se elimina lo q elegiste en 1 segundo y se vuelve a poner el fondo negro
    setTimeout(() => {
        carta1.classList.remove('revelada');
        carta2.classList.remove('revelada');
        cartasReveladas = [];
    }, 1000); 
    }
}

btnReiniciar.addEventListener('click', iniciarJuego);

iniciarJuego();