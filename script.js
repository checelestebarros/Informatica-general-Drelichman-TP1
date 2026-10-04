// trivia (borrador)

// decodificar HTML
function decodificarHTML(texto) {
  const elementoTemporal = document.createElement("textarea");
  elementoTemporal.innerHTML = texto;
  return elementoTemporal.value;
}

// mezclar opciones
function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// variables globales
let preguntas = [];
let indiceActual = 0;
let tokenSession = "";
let tiempoRestante = 10;
let idIntervalo = null;

// pedir token de sesion (para q no repita preguntas)
async function obtenerToken() {
  const respuesta = await fetch("https://opentdb.com/api_token.php?command=request");
  const datos = await respuesta.json();
  tokenSession = datos.token;
}

// funcion para el temporizador de 10 segundos
function iniciarTimer() {
  tiempoRestante = 10;
  document.getElementById("tiempo").textContent = tiempoRestante;

  clearInterval(idIntervalo);

  idIntervalo = setInterval(function() {
    tiempoRestante--;
    document.getElementById("tiempo").textContent = tiempoRestante;

    if (tiempoRestante === 0) {
      clearInterval(idIntervalo);
      document.getElementById("resultado").textContent = "Se acabó el tiempo!. La respuesta correcta es: " + decodificarHTML(preguntas[indiceActual].correct_answer);

      const botones = document.querySelectorAll("#opciones button");
      botones.forEach(b => b.disabled = true);

      setTimeout(function() {
        indiceActual++;
        if (indiceActual < preguntas.length) {
          mostrarPregunta();
        } else {
          document.getElementById("resultado").textContent = "¡Fin!";
          document.getElementById("pregunta").textContent = "";
          document.getElementById("opciones").innerHTML = "";
          document.getElementById("tiempo").textContent = "0";
        }
      }, 2000);
    }
  }, 1000);
} 

function mostrarPregunta() { 
  const preguntaActual = preguntas[indiceActual];

  // iniciar el reloj al mostrar cada pregunta
  iniciarTimer();

  document.getElementById("pregunta").textContent = decodificarHTML(preguntaActual.question);
  document.getElementById("resultado").textContent = "";
  const todasLasOpciones = mezclarArray([preguntaActual.correct_answer, ...preguntaActual.incorrect_answers]);
  const contenedorOpciones = document.getElementById("opciones");
  contenedorOpciones.innerHTML = "";

  todasLasOpciones.forEach(function(opcion) {
    const boton = document.createElement("button");
    boton.textContent = decodificarHTML(opcion);

    boton.addEventListener("click", function() {
      // Frenar el reloj cuando responde a tiempo
      clearInterval(idIntervalo);

      if (opcion === preguntaActual.correct_answer) {
        document.getElementById("resultado").textContent = "¡Correcto!";
      } else {
        document.getElementById("resultado").textContent = "Incorrecto. La respuesta correcta es: " + decodificarHTML(preguntaActual.correct_answer);
      }

      const botones = document.querySelectorAll("#opciones button");
      botones.forEach(b => b.disabled = true);

      setTimeout(function() {
        indiceActual++;
        if (indiceActual < preguntas.length) {
          mostrarPregunta();
        } else {
          document.getElementById("resultado").textContent = "¡Fin!";
          document.getElementById("pregunta").textContent = "";
          document.getElementById("opciones").innerHTML = "";
        }
      }, 2000);
    });
    contenedorOpciones.appendChild(boton);
  });
}

async function cargarPreguntas(categoria, dificultad) {
  if (tokenSession === "") {
    await obtenerToken();
  } 

  const respuesta = await fetch("https://opentdb.com/api.php?amount=10&category=" + categoria + "&difficulty=" + dificultad + "&type=multiple&token=" + tokenSession);
  const datos = await respuesta.json();

  preguntas = datos.results; 
  indiceActual = 0;
  mostrarPregunta();
}

// Evento para el botón de iniciar 
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("btn-iniciar").addEventListener("click", function() {
    const categoriaElegida = document.getElementById("select-categoria").value;
    const dificultadElegida = document.getElementById("select-dificultad").value;

    cargarPreguntas(categoriaElegida, dificultadElegida);
  });
});
//