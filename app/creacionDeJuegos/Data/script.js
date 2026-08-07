const contenedorPrincipal = document.getElementById("contenedorPrincipal");
let preguntas_editadas = [];

let datosJuego = {
    title: "",
    difficulty: "",
    image: "",
    author: "",
    descripcion: "",
    editandoInformacionBasica: false

}



function eliminarPregunta(index) {
    preguntas_editadas.splice(index, 1);
    renderizarPreguntas();
}

function editarInformacionBasica() {
    datosJuego.editandoInformacionBasica = true;
    renderizarPreguntas();

}

function editarPregunta(index) {
    preguntas_editadas[index].editando = true;
    renderizarPreguntas();
}

function agregarPregunta() {
    const nuevaPregunta = {
        id: crypto.randomUUID(),
        text: "",
        options: ["", "", "", ""],
        editando: true
    };

    preguntas_editadas.push(nuevaPregunta);
    renderizarPreguntas();
}



async function confirmarPregunta(index) {
    try {
        const input = document.getElementById(`input-pregunta-${index}`);

        if (input && input.value.trim() !== "") {
            preguntas_editadas[index].text = input.value;
        }
        preguntas_editadas[index].options.forEach((opcion, opcionIndex) => {
            const inputOpcion = document.getElementById(`input-opcion-${index}-${opcionIndex}`);
            if (inputOpcion && inputOpcion.value.trim() !== "") {
                preguntas_editadas[index].options[opcionIndex] = inputOpcion.value;
            }
        });

        preguntas_editadas[index].editando = false;

        const juegoElegido = localStorage.getItem("pregunta");

        if (!juegoElegido) {
            throw new Error("no hay juego seleccionado");
        }

        const questionsLimpias = preguntas_editadas.map((pregunta) => ({
            id: pregunta.id,
            text: pregunta.text,
            options: pregunta.options
        }));

        const payload = {
            questions: questionsLimpias
        };

        renderizarPreguntas();

        const respuesta = await fetch(juegoElegido, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!respuesta.ok) {
            throw new Error(`error del servidor: ${respuesta.status}`);
        }

    } catch (error) {
        console.error("error al confirmar la pregunta:", error);
        alert("no se pudo guardar la pregunta");
    }
};



async function confirmarEdicionDeInformacionBasica() {
    try {
        datosJuego.editandoInformacionBasica = false;

        const inputTitulo = document.getElementById("input-titulo");
        const inputDificultad = document.getElementById("input-dificultad");
        const inputImagen = document.getElementById("input-imagen");
        const inputAuthor = document.getElementById("input-author");
        const inputDescripcion = document.getElementById("input-descripcion");

        const titulo = inputTitulo.value;
        const dificultad = inputDificultad.value;
        const imagen = inputImagen.value;
        const author = inputAuthor.value;
        const descripcion = inputDescripcion.value;

        if (titulo.trim() === "") {
            throw new Error("el titulo es obligatorio");
        }

        

        datosJuego.title = titulo;
        datosJuego.difficulty = dificultad;
        datosJuego.image = imagen;
        datosJuego.author = author;
        datosJuego.descripcion = descripcion;

        renderizarPreguntas();

        const payload = {
            title: titulo,
            author: author,
            image: imagen,
            difficulty: dificultad
        };

        const respuesta = await fetch("https://quiz-api.cesar-kastli.workers.dev/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!respuesta.ok) {
            throw new Error(`error del servidor: ${respuesta.status}`);
        }

        const juegoCreado = await respuesta.json();
        localStorage.setItem("pregunta", `https://quiz-api.cesar-kastli.workers.dev/games/${juegoCreado.id}`);

    } catch (error) {
        console.error("error al crear la informacion basica:", error);
        alert("no se pudo crear el juego");
        datosJuego.editandoInformacionBasica = true;
        renderizarPreguntas();
    }
};







function renderizarPreguntas() {
    contenedorPrincipal.innerHTML = "";
    const enEdicionInformacionBasica = datosJuego.editandoInformacionBasica

    contenedorPrincipal.innerHTML = `
        <button onclick="agregarPregunta()">agregar pregunta</button>
        ${enEdicionInformacionBasica
            ? `
                <div>
                    <label>titulo:</label>
                    <input type="text" id="input-titulo" value="${datosJuego.title}">
                </div>
                <div>
                    <label>imagen:</label>
                    <input type="text" id="input-imagen" value="${datosJuego.image}">
                </div>
                <div>
                    <label>difilcutad:</label>
                    <input type="text" id="input-dificultad" value="${datosJuego.difficulty}">
                </div>
                <div>
                    <label>author:</label>
                    <input type="text" id="input-author" value="${datosJuego.author}">
                </div>
                <div>
                    <label>descripcion:</label>
                    <input type="text" id="input-descripcion" value="${datosJuego.descripcion}">
                </div>
                <button onclick="confirmarEdicionDeInformacionBasica()">confirmar</button>
            `
            : `
                <button onclick="editarInformacionBasica()">crear informacion basica</button>
            `
        }
        <hr>
    `;
    preguntas_editadas.forEach((pregunta, index) => {
        const preguntaDiv = document.createElement("div");
        preguntaDiv.classList.add("pregunta");

        const enEdicion = pregunta.editando === true;

        preguntaDiv.innerHTML = `
            <h3>pregunta ${index + 1}</h3>
            ${enEdicion
                ? `<input type="text" id="input-pregunta-${index}" value="${pregunta.text}" class="editando">`
                : `<h4>${pregunta.text || "(pregunta vacia)"}</h4>`
            }
            
            ${enEdicion
                ? `<button onclick="confirmarPregunta(${index})">confirmar</button>`
                : `<button onclick="editarPregunta(${index})">editar</button>`

            }
            <button onclick="eliminarPregunta(${index})">eliminar</button>
            <ul>
                ${pregunta.options.map((opcion, opcionIndex) => enEdicion
                ? `<li><input type="text" id="input-opcion-${index}-${opcionIndex}" value="${opcion}"></li>`
                : `<li>${opcion}</li>`)
                .join('')
            }
            </ul>
            `;
        contenedorPrincipal.appendChild(preguntaDiv);
    });
}

agregarPregunta()