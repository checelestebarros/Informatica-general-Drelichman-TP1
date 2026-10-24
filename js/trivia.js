let preguntas = [];
let indicePreguntaActual = 0;
let puntaje = 0;
let tiempoRestante = 10;
let temporizador;

// CATEGORIAS
const categoriasDisponibles = [
    { id: 25, key: "arte", apiId: 25, name: "Arte" },
    { id: 18, key: "compu", apiId: 18, name: "Computación" }
];

// CARGAR CATEGORIAS
function cargarCategorias() {
    const selectCategoria = document.getElementById("categoria");
    if (!selectCategoria) return;

    selectCategoria.innerHTML = "";
    categoriasDisponibles.forEach(cat => {
        const opcion = document.createElement("option");
        opcion.value = cat.key; // Asigna "compu" o "arte" como valor del option
        opcion.dataset.apiId = cat.apiId; // Mantiene la referencia numérica para la API
        opcion.textContent = cat.name;
        selectCategoria.appendChild(opcion);
    });
}

// OBTENER PREGUNTAS DE LA API
async function obtenerPreguntas() {
    const selectCategoria = document.getElementById("categoria");
    const opcionSeleccionada = selectCategoria.options[selectCategoria.selectedIndex];
    const categoriaApiId = opcionSeleccionada ? opcionSeleccionada.dataset.apiId : "18";
    const dificultad = document.getElementById("dificultad").value;

    let url = `https://opentdb.com/api.php?amount=5&category=${categoriaApiId}&difficulty=${dificultad}&type=multiple`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.results && datos.results.length > 0) {
            preguntas = datos.results;
            indicePreguntaActual = 0;
            puntaje = 0;
            
            document.getElementById("zona-config").classList.add("oculto");
            document.getElementById("zona-juego").classList.remove("oculto");
            
            mostrarPregunta();
        } else {
            alert("No se encontraron preguntas disponibles para esta configuración. Probá cambiando la dificultad.");
        }
    } catch (error) {
        alert("Error al cargar las preguntas. Verificá tu conexión.");
        console.error(error);
    }
}

// MOSRTAR PREGUNTA ACTUAL
function mostrarPregunta() {
    clearInterval(temporizador);
    tiempoRestante = 10;

    const elementoTiempo = document.getElementById("tiempo-restante");
    if (elementoTiempo) elementoTiempo.textContent = `Tiempo restante: ${tiempoRestante}`;

    if (indicePreguntaActual >= preguntas.length) {
        finalizarJuego();
        return;
    }

    const preguntaActual = preguntas[indicePreguntaActual];
    document.getElementById("pregunta").innerHTML = preguntaActual.question;

    const contenedorOpciones = document.getElementById("opciones");
    contenedorOpciones.innerHTML = "";

    let opciones = [...preguntaActual.incorrect_answers, preguntaActual.correct_answer];
    opciones.sort(() => Math.random() - 0.5);

    opciones.forEach(opcionTexto => {
        const boton = document.createElement("button");
        boton.classList.add("btn-opcion");
        boton.innerHTML = opcionTexto;
        boton.addEventListener("click", () => verificarRespuesta(opcionTexto, preguntaActual.correct_answer));
        contenedorOpciones.appendChild(boton);
    });

    iniciarTemporizador();
}

// TEMPORIZADOR
function iniciarTemporizador() {
    temporizador = setInterval(() => {
        tiempoRestante--;
        const elementoTiempo = document.getElementById("tiempo-restante");
        if (elementoTiempo) elementoTiempo.textContent = `Tiempo restante: ${tiempoRestante}`;

        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            indicePreguntaActual++;
            mostrarPregunta();
        }
    }, 1000);
}

// VERIFICAR RESPUESTA
function verificarRespuesta(seleccion, correcta) {
    clearInterval(temporizador);

    if (seleccion === correcta) {
        puntaje += 10;
    }

    indicePreguntaActual++;
    mostrarPregunta();
}

// FINALIZAR JUEGO Y GUARDAR RECORD
function finalizarJuego() {
    clearInterval(temporizador);
    
    document.getElementById("pregunta").textContent = "¡Juego Terminado!";
    document.getElementById("opciones").innerHTML = "";
    document.getElementById("tiempo-restante").textContent = "";

    const resultadoElem = document.getElementById("resultado");
    resultadoElem.textContent = `Tu puntaje final fue: ${puntaje} pts`;

    let recordGuardado = localStorage.getItem("record_trivia") || 0;
    if (puntaje > parseInt(recordGuardado)) {
        localStorage.setItem("record_trivia", puntaje);
    }
}

//  ESCUCHAR EVENTO DE INICIO DE JUEGO
document.getElementById("btn-comenzar").addEventListener("click", () => {
    obtenerPreguntas();
});

// Cargar menu desplegable
cargarCategorias();