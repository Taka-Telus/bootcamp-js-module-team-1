
const preguntaPrincipal = document.getElementById("pregunta")
const opcionesDePregunta = document.getElementById("opcionesDePregunta")
const preguntaElegida = localStorage.getItem("pregunta")
const avanzarPregunta = document.getElementById("siguiente-pregunta")
let preguntas_lista = [];
let preguntaActual = 0;
let finDelCuestionario = false;

function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
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
        avanzarPregunta.textContent = "Gracias por jugar"
        avanzarPregunta.disabled = false;
        finDelCuestionario = true;
        preguntaActual = 0
    }
}

async function cargarCuestionario() {
    const respuesta = await fetch(preguntaElegida);
    const datos = await respuesta.json();
    preguntas_lista = shuffleArray(datos.questions);
    mostrarPregunta();
}


avanzarPregunta.addEventListener("click", async () => {
    if (finDelCuestionario) {
        window.location.href = "../index/index.html";
        return;
    }
    mostrarPregunta();
})



opcionesDePregunta.addEventListener("click", (event) => {

    if (!event.target.classList.contains("botonOpcion")) return;



    if (event.target.dataset.id == 0) {

        event.target.classList.add("opcion-correcta");
        const elementosInternos = document.querySelectorAll('button.botonOpcion');
        elementosInternos.forEach(boton => boton.disabled = true);
        avanzarPregunta.disabled = false;



    } else {
        event.target.classList.add("opcion-incorrecta")
        const correcta = opcionesDePregunta.querySelector('[data-id="0"]');
        if (correcta) {
            correcta.classList.add("opcion-correcta");
            const elementosInternos = document.querySelectorAll('button.botonOpcion');
            elementosInternos.forEach(boton => boton.disabled = true);
            avanzarPregunta.disabled = false;
        }
    }
})




cargarCuestionario();