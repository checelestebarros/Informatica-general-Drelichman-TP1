# Trabajo Práctico 1 - Sitio Web Multijuego

* **Materia:** Informática General (2026)
* **Cátedra:** Valeria Drelichman, Pedro Paleo, Leonardo Nadel, Norma Morales
* **Grupo:** 18

## Integrantes
* Celeste Barros
* Santos Rodrigo Matos Osorio

---

## Descripción General del Sitio

El proyecto consiste en una aplicación web interactiva que reúne una colección de tres juegos dinámicos: **Generala**, **Trivia** y **Blackjack**. El mismo esta hecho en los lenguajes HTML, CSS y JavaScript 

---

## Juegos y Reglas de Funcionamiento

### 1. Generala (Juego de Dados)

#### Descripción
Modalidad multijugador local (1 vs 1) en pantalla compartida donde dos usuarios compiten por obtener la mayor puntuación sumando el valor de sus tiradas.

#### Reglas de Juego
* **Estructura del Turno:** La partida consta de un turno por jugador. Cada turno permite un máximo de hasta 3 tiradas de dados.
* **Mecánica de Selección:** En la primera tirada se lanzan los 5 dados. El usuario puede hacer clic sobre cualquiera de las caras para "guardar/congelar" su valor (manejado internamente mediante un arreglo de booleanos). Los dados seleccionados conservan su posición y no vuelven a lanzarse en la segunda o tercera tirada.
* **Cálculo de Puntuación:** Al agotar las 3 tiradas, el sistema calcula automáticamente la suma total de las 5 caras obtenidas y la registra en el marcador del jugador activo.
* **Cambio de Turno:** Finalizadas las tiradas del Jugador 1, el control de la pantalla se resetea y pasa al Jugador 2.
* **Condición de Victoria:** Al concluir el turno del Jugador 2, el sistema evalúa ambos marcadores y declara al ganador o marca un empate. El mayor puntaje registrado en la mesa se compara y actualiza en la tabla de récords del navegador.

---

### 2. Trivia (Juego de Preguntas)

#### Descripción
Juego de preguntas y respuestas de opción múltiple con consumo en tiempo real de la API pública OpenTDB (Open Trivia Database).

#### Reglas de Juego
* **Configuración Inicial:** El usuario debe elegir una categoría (Arte o Informática) y una dificultad (Fácil, Medio o Difícil) antes de comenzar la partida.
* **Desarrollo:** Cada ronda presenta un bloque de 10 preguntas de opción múltiple generadas aleatoriamente.
* **Temporizador:** Cada pregunta cuenta con un temporizador dinámico de 15 segundos para responder. Si el tiempo llega a cero antes de seleccionar una opción, la pregunta se toma como no contestada y se avanza automáticamente a la siguiente.
* **Procesamiento de Respuestas:** Al hacer clic sobre una alternativa, se evalúa de inmediato si es correcta o incorrecta, bloqueando temporalmente la interfaz para evitar pulsaciones múltiples y pasando a la siguiente pregunta tras una breve pausa.

---

### 3. Blackjack (Juego de Cartas)

#### Descripción
Juego clásico de naipes ("Veintiuno") donde el jugador compite de forma individual contra la banca/casa.

#### Reglas de Juego
* **Objetivo:** Acumular un valor total en cartas lo más cercano posible a 21 puntos sin sobrepasarlo, o superar el puntaje obtenido por la casa.
* **Acciones del Jugador:**
  * **Pedir Carta:** Toma una carta adicional del mazo virtual para sumar puntos a su mano.
  * **Plantarse:** Conserva el valor actual de su mano y cede el turno a la casa.
* **Evaluación de Cartas:** Las cartas numéricas conservan su valor nominal; las cartas de figura (J, Q, K) equivalen a 10 puntos; el As suma 11 o 1 según convenga a la jugada.
* **Condición de Victoria:** Si la mano del jugador excede los 21 puntos, pierde automáticamente ("Se pasó"). Si el jugador se planta, la casa juega su mano respetando reglas fijas (pedir hasta alcanzar un mínimo de 17 puntos). Gana quien sume más puntos sin pasarse.

---

## Persistencia y Tabla de Récords

El proyecto utiliza `localStorage` como mecanismo de persistencia local en el cliente. La pantalla de puntajes (`puntajes.html`) recupera y muestra dinámicamente los máximos puntajes alcanzados en cada juego, permitiendo almacenar la puntuación más alta histórica sin necesidad de un servidor backend.

---

## API Utilizada

* **API:** Open Trivia Database (`OpenTDB` - `https://opentdb.com/`)
* **Información Obtenida:** Preguntas en idioma inglés de opción múltiple junto con sus respuestas correctas e incorrectas.
* **Session Tokens (`api_token.php`):** Se realiza una petición asíncrona inicial para solicitar un token de sesión único. Este token se concatena a las consultas de las preguntas (`&token=...`) para garantizar que la API no devuelva preguntas repetidas durante la sesión activa del usuario.
* **Parámetros Utilizados:** Categorías (ID `25` para Arte, ID `18` para Informática), Dificultad (`easy`, `medium`, `hard`) y Tipo (`multiple`).

---

## Organización de Archivos y Carpetas

```text
Informatica-general-Drelichman-TP1/
├── css/
│   └── estilos.css
├── js/
│   ├── generala.js
│   ├── trivia.js
│   ├── puntajes.js
│   └── blackjack.js
├── img/
│   ├── dado1.png
│   ├── dado2.png
│   ├── dado3.png
│   ├── dado4.png
│   ├── dado5.png
│   └── dado6.png
├── index.html
├── generala.html
├── trivia.html
├── puntajes.html
├── blackjack.html
├── nosotros.html
└── README.md
 
