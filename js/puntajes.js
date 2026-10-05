document.addEventListener("DOMContentLoaded", function() {
  const recordTrivia = localStorage.getItem("record_trivia") || 0;
  const recordDados = localStorage.getItem("record_dados") || 0; // generala.js guarda con esta clave
  const recordCartas = localStorage.getItem("record_blackjack") || 0;

  document.getElementById("record-trivia").textContent = recordTrivia + " pts";
  document.getElementById("record-generala").textContent = recordDados + " pts";
  document.getElementById("record-blackjack").textContent = recordCartas + " pts";

  document.getElementById("btn-borrar-records").addEventListener("click", function() {
    localStorage.removeItem("record_trivia");
    localStorage.removeItem("record_dados");
    localStorage.removeItem("record_blackjack");
    location.reload(); // refrescar los valores en 0
  });
});

// Función para guardar el puntaje si supera el récord anterior
function guardarRecord(juego, nuevoPuntaje) {
  let clave = "";
  if (juego === "trivia") clave = "record_trivia";
  if (juego === "generala") clave = "record_dados";
  if (juego === "blackjack") clave = "record_blackjack";

  if (clave !== "") {
    const recordActual = parseInt(localStorage.getItem(clave)) || 0;
    if (nuevoPuntaje > recordActual) {
      localStorage.setItem(clave, nuevoPuntaje);
    }
  }
}