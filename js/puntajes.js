document.addEventListener("DOMContentLoaded", function() {
  // recuperamos los records almacenados
  const recordTrivia = localStorage.getItem("record_trivia") || 0;
  const recordDados = localStorage.getItem("record_dados") || 0; 
  const recordJugadorDados = localStorage.getItem("record_jugador") || "";
  const recordCartas = localStorage.getItem("record_blackjack") || 0;

  // mostramos los puntajes de trivia y blackjack
  document.getElementById("record-trivia").textContent = recordTrivia + " pts";
  document.getElementById("record-blackjack").textContent = recordCartas + " pts";

  // leemos la ultima partida guardada de la generala con los datos de ambos jugadores
  const ultimaPartidaGenerala = localStorage.getItem("ultima_partida_generala");

  if (ultimaPartidaGenerala) {
    const datos = JSON.parse(ultimaPartidaGenerala);

    // opcion 1: si tienes elementos separados en el html para cada jugador
    const elemJ1 = document.getElementById("puntos-j1-generala");
    const elemJ2 = document.getElementById("puntos-j2-generala");

    if (elemJ1 && elemJ2) {
      elemJ1.textContent = datos.jugador1.nombre + ": " + datos.jugador1.puntos + " pts";
      elemJ2.textContent = datos.jugador2.nombre + ": " + datos.jugador2.puntos + " pts";
    }

    // opcion 2: mostramos los puntajes de ambos jugadores juntos en el elemento principal
    const elemGenerala = document.getElementById("record-generala");
    if (elemGenerala) {
      elemGenerala.textContent = datos.jugador1.nombre + " (" + datos.jugador1.puntos + " pts) - " + datos.jugador2.nombre + " (" + datos.jugador2.puntos + " pts)";
    }

  } else {
    // si no hay partida guardada mostramos el record individual o 0
    const elemGenerala = document.getElementById("record-generala");
    if (elemGenerala) {
      elemGenerala.textContent = recordJugadorDados !== "" ? recordDados + " pts (" + recordJugadorDados + ")" : recordDados + " pts";
    }
  }

  // evento para borrar todos los datos guardados
  document.getElementById("btn-borrar-records").addEventListener("click", function() {
    localStorage.removeItem("record_trivia");
    localStorage.removeItem("record_dados");
    localStorage.removeItem("record_jugador");
    localStorage.removeItem("ultima_partida_generala");
    localStorage.removeItem("record_blackjack");
    location.reload(); // recargamos la pagina para actualizar la vista en 0
  });
});

// funcion para guardar el puntaje si supera el record previo
function guardarRecord(juego, nuevoPuntaje, nombreJugador = "") {
  let clave = "";
  if (juego === "trivia") clave = "record_trivia";
  if (juego === "generala") clave = "record_dados";
  if (juego === "blackjack") clave = "record_blackjack";

  if (clave !== "") {
    const recordActual = parseInt(localStorage.getItem(clave)) || 0;
    if (nuevoPuntaje > recordActual) {
      localStorage.setItem(clave, nuevoPuntaje);
      if (juego === "generala" && nombreJugador !== "") {
        localStorage.setItem("record_jugador", nombreJugador);
      }
    }
  }
}