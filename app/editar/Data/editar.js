const contenedorPrincipal = document.getElementById("contenedorPrincipal");
let preguntas_editadas = [];

let datosJuego = {
    title: "",
    difficulty: "",
    image: "",
    editandoInformacionBasica: false
}

async function cargarPreguntas() {
    try {
        const juegoElegido = localStorage.getItem("pregunta");

        if (!juegoElegido) {
            throw new Error("No hay juego seleccionado");
        }

        const respuesta = await fetch(juegoElegido);

        if (!respuesta.ok) {
            throw new Error(`Error del servidor: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        preguntas_editadas = (datos.questions || []).map((preguntas, index) => ({ ...preguntas, editando: false }));        
        console.log(preguntas_editadas)

        if (preguntas_editadas.length === 0) {
            preguntas_editadas.push({
                id: crypto.randomUUID(),
                text: "",
                options: ["", "", "", ""],
                editando: true
            });
        }

        datosJuego.title = datos.title || "";
        datosJuego.difficulty = datos.difficulty || "";
        datosJuego.image = datos.image || "";

        const titulo = document.createElement("h2");
        const dificultad = document.createElement("p");

        titulo.textContent = datosJuego.title;
        titulo.id = "titulo"
        dificultad.textContent = `Dificultad: ${datosJuego.difficulty}`;
        dificultad.id = "dificultad"

        contenedorPrincipal.before(titulo);
        contenedorPrincipal.before(dificultad);

        renderizarPreguntas();

    } catch (error) {
        console.error("Error al cargar las preguntas:", error);
        contenedorPrincipal.innerHTML = "<p>No se pudieron cargar las preguntas</p>";
    }
}

async function eliminarPregunta(index) {
    preguntas_editadas.splice(index, 1);
    renderizarPreguntas();
    const juegoElegido = localStorage.getItem("pregunta");
    const questionsLimpias = preguntas_editadas.map((pregunta) => ({ 
            id: pregunta.id, 
            text: pregunta.text, 
            options: pregunta.options
        })); 
        
        const payload = { questions: questionsLimpias }; 

        renderizarPreguntas(); 


        const respuesta = await fetch(juegoElegido, { 
            method: "PATCH", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(payload) 
        }); 

    
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
            throw new Error("No hay juego seleccionado");
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
            throw new Error(`Error del servidor: ${respuesta.status}`);
        }

    } catch (error) {
        console.error("Error al confirmar la pregunta:", error);
    }
};



async function confirmarEdicionDeInformacionBasica() {
    try {
        datosJuego.editandoInformacionBasica = false;

        const inputTitulo = document.getElementById("input-titulo");
        const inputDificultad = document.getElementById("input-dificultad");
        const inputImagen = document.getElementById("input-imagen");

        const titulo = inputTitulo.value;
        const dificultad = inputDificultad.value;
        const imagen = inputImagen.value;

        datosJuego.title = titulo;
        datosJuego.difficulty = dificultad;
        datosJuego.image = imagen;

        renderizarPreguntas();

        const juegoElegido = localStorage.getItem("pregunta");

        if (!juegoElegido) {
            throw new Error("No hay juego seleccionado");
        }

        const payload = {
            title: titulo,
            image: imagen,
            difficulty: dificultad
        };

        const respuesta = await fetch(juegoElegido, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!respuesta.ok) {
            throw new Error(`Error del servidor: ${respuesta.status}`);
        }

    } catch (error) {
        console.error("Error al confirmar la informacion basica:", error);
    }
};

async function eliminarJuego() {
    try {
        const juegoElegido = localStorage.getItem("pregunta");

        if (!juegoElegido) {
            throw new Error("No hay juego seleccionado");
        }

        const confirmacion = confirm("¿Seguro que querés eliminar este juego? Esta acción no se puede deshacer.");
        if (!confirmacion) return;

        const respuesta = await fetch(juegoElegido, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error(`Error del servidor: ${respuesta.status}`);
        }

        localStorage.removeItem("pregunta");
        window.location.href = "../index/index.html";

    } catch (error) {
        console.error("Error al eliminar el juego:", error);
        alert("No se pudo eliminar el juego");
    }
}

function renderizarPreguntas() {
    contenedorPrincipal.innerHTML = "";
    const enEdicionInformacionBasica = datosJuego.editandoInformacionBasica

    contenedorPrincipal.innerHTML = `
        <button onclick="agregarPregunta()">Agregar pregunta</button>
        <button onclick="eliminarJuego()">Eliminar juego</button>

        ${enEdicionInformacionBasica
            ? `
                <div>
                    <label>Título:</label>
                    <input type="text" id="input-titulo" value="${datosJuego.title}">
                </div>
                <div>
                    <label>Imagen:</label>
                    <input type="text" id="input-imagen" value="${datosJuego.image}">
                </div>
                <div>
                    <label>Difilcutad:</label>
                    <input type="text" id="input-dificultad" value="${datosJuego.difficulty}">
                </div>
                <button onclick="confirmarEdicionDeInformacionBasica()">Confirmar</button>
            `
            : `
                <button onclick="editarInformacionBasica()">Editar informacion basica</button>
            `
        }
        <hr>
    `;


    preguntas_editadas.forEach((pregunta, index) => {
        const preguntaDiv = document.createElement("div");
        preguntaDiv.classList.add("pregunta");

        const enEdicion = pregunta.editando === true;

        preguntaDiv.innerHTML = `
            <h3>Pregunta ${index + 1}</h3>
            ${enEdicion
                ? `<input type="text" id="input-pregunta-${index}" value="${pregunta.text}" class="editando">`
                : `<h4>${pregunta.text || "(Pregunta vacia)"}</h4>`
            }
            
            ${enEdicion
                ? `<button onclick="confirmarPregunta(${index})">Confirmar</button>`
                : `<button onclick="editarPregunta(${index})">Editar</button>`

            }
            <button onclick="eliminarPregunta(${index})">Eliminar</button>
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



cargarPreguntas();