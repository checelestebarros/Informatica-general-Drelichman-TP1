// trivia (borrador)

//  decodificar html (a veces las preguntas vienen con caracteres html que el js no interpreta)

function decodificarHTML(texto) {
  const elementoTemporal = document.createElement("textarea");
  elementoTemporal.innerHTML = texto;
  return elementoTemporal.value;
}

  // esto es para que las opciones de respuesta se mezclen
  // reasigna los valores de las posiciones "j" e "i"

  function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
              }
  return array;
}

// 

async function probarFetch() {
  const respuesta = await fetch("https://opentdb.com/api.php?amount=10&category=25&difficulty=easy&type=multiple");
  const datos = await respuesta.json();
  console.log(datos);

  const primeraPregunta = datos.results[0];
  document.getElementById("pregunta").textContent = decodificarHTML(primeraPregunta.question);

 const todasLasOpciones = mezclarArray([primeraPregunta.correct_answer, ...primeraPregunta.incorrect_answers]);
  const contenedorOpciones = document.getElementById("opciones");

  todasLasOpciones.forEach(function(opcion) {
    const boton = document.createElement("button");
    boton.textContent = decodificarHTML(opcion);

    boton.addEventListener("click", function() {
  if (opcion === primeraPregunta.correct_answer) {
    document.getElementById("resultado").textContent = "¡Correcto!";
  } else {
    document.getElementById("resultado").textContent = "Incorrecto. La respuesta correcta es: " + primeraPregunta.correct_answer;
  }
});
    contenedorOpciones.appendChild(boton);
  });
}

probarFetch();
// 
