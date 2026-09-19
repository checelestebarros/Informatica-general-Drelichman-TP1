// trivia (borrador)


async function probarFetch() {
  const respuesta = await fetch("https://opentdb.com/api.php?amount=10&category=25&difficulty=easy&type=multiple");
  const datos = await respuesta.json();
  console.log(datos);

  const primeraPregunta = datos.results[0];
  document.getElementById("pregunta").textContent = primeraPregunta.question;

  const todasLasOpciones = [primeraPregunta.correct_answer, ...primeraPregunta.incorrect_answers];
  const contenedorOpciones = document.getElementById("opciones");

  todasLasOpciones.forEach(function(opcion) {
    const boton = document.createElement("button");
    boton.textContent = opcion;

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
// editar para asegurarse de que la primer respuesta no sea siempre la correcta