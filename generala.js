//generala borrador
// genero las variables de lo 5 dados, y con false y true vamos a guardar los dados que queremos conservar, tambien esta el contadord e tiradas que son maximo 3

let dados = [0, 0, 0, 0, 0];
let guardados = [false, false, false, false, false];
let tiradas = 0;

const dadosHTML = document.querySelector("#dados");
const btnTirar = document.querySelector("#btnTirar");
const btnReiniciar = document.querySelector("#btnReiniciar");
const textoTiradas = document.querySelector("#tiradas");

// el dado.onclik lo guarda
function mostrarDados() {

    dadosHTML.innerText = "";

    for (let i = 0; i < 5; i++) {

        let dado = document.createElement("button");

        dado.innerText = dados[i];

        if (guardados[i]) {
            dado.classList.add("guardado");
        }

        dado.onclick = function () {
            guardados[i] = !guardados[i];
            mostrarDados();
        };

        dadosHTML.append(dado);
    }
}

// aca aumenta el contador en uno y dentro del for se fija si esta guardado, si la respuesta es si, entra al if y vuelve a generar un numero aleatorio entre 1 y 6
function tirarDados() {

    tiradas++;

    for (let i = 0; i < 5; i++) {

        if (!guardados[i]) {
            dados[i] = Math.floor(Math.random() * 6) + 1;
        }
    }

    mostrarDados();

    textoTiradas.innerText = "Tiradas: " + tiradas + " / 3";

    if (tiradas == 3) {
        btnTirar.disabled = true;
    }
}


function reiniciar() {

    dados = [0, 0, 0, 0, 0];
    guardados = [false, false, false, false, false];
    tiradas = 0;

    mostrarDados();

    textoTiradas.innerText = "Tiradas: 0 / 3";

    btnTirar.disabled = false;
}


btnTirar.onclick = tirarDados;
btnReiniciar.onclick = reiniciar;