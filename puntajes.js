document.addEventListener("DOMContentLoaded", function() {
  const recordTrivia = localStorage.getItem("record_trivia") || 0;
  const recordDados = localStorage.getItem("record_generala") || 0;
  const recordCartas = localStorage.getItem("record_blackjack") || 0;

  document.getElementById("record-trivia").textContent = recordTrivia + " pts";
  document.getElementById("record-generala").textContent = recordDados + " pts";
  document.getElementById("record-blackjack").textContent = recordCartas + " pts";

  document.getElementById("btn-borrar-records").addEventListener("click", function() {
    localStorage.removeItem("record_trivia");
    localStorage.removeItem("record_generala");
    localStorage.removeItem("record_blackjack");
    location.reload(); //  refrescar los valores en 0
  });
});