// trivia (borrador)

// 1  decodificar html (a veces las preguntas vienen con caracteres html que el js no interpreta)

function decodificarHTML(texto) {
  const elementoTemporal = document.createElement("textarea");
  elementoTemporal.innerHTML = texto;
  return elementoTemporal.value;
}

  // 2 esto es para que las opciones de respuesta se mezclen
  // reasigna los valores de las posiciones "j" e "i"

  function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
              }
  return array;
}

// 3 

let preguntas = [];
let indiceActual = 0;

function mostrarPregunta() { 
  const preguntaActual = preguntas[indiceActual];
document.getElementById("pregunta").textContent = decodificarHTML(preguntaActual.question);
document.getElementById("resultado").textContent = "";
 const todasLasOpciones = mezclarArray([preguntaActual.correct_answer, ...preguntaActual.incorrect_answers]);
  const contenedorOpciones = document.getElementById("opciones");
  contenedorOpciones.innerHTML = "";
 todasLasOpciones.forEach(function(opcion) {
    const boton = document.createElement("button");
    boton.textContent = decodificarHTML(opcion);

    boton.addEventListener("click", function() {
  if (opcion === preguntaActual.correct_answer) {
    document.getElementById("resultado").textContent = "¡Correcto!";
  } else {
    document.getElementById("resultado").textContent = "Incorrecto. La respuesta correcta es: " + preguntaActual.correct_answer;
  }
  setTimeout(function() {
    indiceActual = indiceActual + 1;
    if (indiceActual < preguntas.length) {
      mostrarPregunta();
    } else {
      document.getElementById("resultado").textContent = "¡Fin!";
document.getElementById("pregunta").textContent = "";
    }
  }, 2000);
});
    contenedorOpciones.appendChild(boton);
  });
}

async function probarFetch() {
  const respuesta = await fetch("https://opentdb.com/api.php?amount=10&category=25&difficulty=easy&type=multiple");
  const datos = await respuesta.json();
  console.log(datos);

  preguntas = datos.results; 
  mostrarPregunta();
}
probarFetch();
// 
