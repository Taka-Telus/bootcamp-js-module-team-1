const preguntaPrincipal = document.getElementById("pregunta")
const opcionesDePregunta = document.getElementById("opcionesDePregunta")
const preguntaElegida = localStorage.getItem("pregunta")
const avanzarPregunta = document.getElementById("siguiente-pregunta")
let preguntas_lista = [];
let preguntaActual = 0;
let finDelCuestionario = false;
let puntaje = 0;

function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

async function cargarCuestionario() {
    try {
        if (!preguntaElegida) {
            throw new Error("No hay cuestionario seleccionado");
        }

        const respuesta = await fetch(preguntaElegida);

        if (!respuesta.ok) {
            throw new Error(`Error del servidor: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        if (!datos.questions || datos.questions.length === 0) {
            throw new Error("El cuestionario no tiene preguntas");
        }

        preguntas_lista = shuffleArray(datos.questions);
        mostrarPregunta();

    } catch (error) {
        console.error("Error al cargar el cuestionario:", error);
        preguntaPrincipal.textContent = "No se pudo cargar el cuestionario";
        opcionesDePregunta.innerHTML = "";
        avanzarPregunta.textContent = "Volver al menu"

        finDelCuestionario = true;
    }
}

function mostrarPregunta() {
    if (preguntaActual < preguntas_lista.length) {
        const pregunta = preguntas_lista[preguntaActual];
        avanzarPregunta.setAttribute("disabled", true);

        preguntaPrincipal.textContent = pregunta.text;

        opcionesDePregunta.innerHTML = "";

        const opcionesConIndice = pregunta.options.map((opcion, index) => ({ opcion, esCorrecta: index === 0 }));
        const opcionesMezcladas = shuffleArray(opcionesConIndice);

        opcionesMezcladas.forEach((item, index) => {
            const li = document.createElement("li");
            const id = item.esCorrecta ? 0 : index + 1;
            li.innerHTML = `
            <button class="botonOpcion" data-id="${id}">${item.opcion} </button>
            `
            opcionesDePregunta.appendChild(li);
        });
        preguntaActual++
    }
    else {
        preguntaPrincipal.textContent = "Fin de preguntas";
        opcionesDePregunta.innerHTML = "";
        avanzarPregunta.textContent = "Ver puntaje"
        avanzarPregunta.disabled = false;
        finDelCuestionario = true;
        preguntaActual = 0

        localStorage.setItem("puntajeFinal", puntaje);
        puntaje = 0;
    }
}

opcionesDePregunta.addEventListener("click", (event) => {
    try {
        if (!event.target.classList.contains("botonOpcion")) return;

        if (event.target.dataset.id == 0) {

            puntaje++;
            event.target.classList.add("opcion-correcta");
            const elementosInternos = document.querySelectorAll('button.botonOpcion');
            elementosInternos.forEach(boton => boton.disabled = true);
            avanzarPregunta.disabled = false;

        } else {
            puntaje--;
            event.target.classList.add("opcion-incorrecta")
            const correcta = opcionesDePregunta.querySelector('[data-id="0"]');
            if (correcta) {
                correcta.classList.add("opcion-correcta");
                const elementosInternos = document.querySelectorAll('button.botonOpcion');
                elementosInternos.forEach(boton => boton.disabled = true);
                avanzarPregunta.disabled = false;
            }
        }
    } catch (error) {
        console.error("Error al procesar la respuesta:", error);
    }
})

avanzarPregunta.addEventListener("click", async () => {
    try {
        if (finDelCuestionario) {
            window.location.href = "../Puntaje/Scoreboard.html";
            return;
        }
        mostrarPregunta();
    } catch (error) {
        console.error("Error al avanzar de pregunta:", error);
    }
})

cargarCuestionario();
*/
class Partida {
    constructor(){
        this.preguntaPrincipal = preguntaPrincipal;
        this.opcionesDePregunta = opcionesDePregunta;
        this.preguntaElegida = preguntaElegida;
        this.avanzarPregunta = avanzarPregunta;

        this.preguntas_lista = [];
        this.preguntaActual = 0;
        this.finDelCuestionario = false;
        this.puntaje = 0;
        this._bindEventos();
    }
}