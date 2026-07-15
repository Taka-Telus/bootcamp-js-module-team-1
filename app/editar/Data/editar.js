const contenedorPrincipal = document.getElementById("contenedorPrincipal");
let preguntas_lista = [];
let preguntas_editadas = [];

let datosJuego={
    title: "",
    difficulty: "",
    image:"",
    editandoInformacionBasica:false

}

async function cargarPreguntas() {
    const juegoElegido = localStorage.getItem("pregunta");
    const respuesta = await fetch(juegoElegido);
    const datos = await respuesta.json();
    
    preguntas_lista = datos.questions.map((q, index) => ({ ...q, editando: false ,  }));
    
    preguntas_editadas = datos.questions.map((q, index) => ({ ...q, editando: false }));

    const titulo = document.createElement("h2");
    const dificultad = document.createElement("p");

    titulo.textContent = datos.title;
    titulo.id="titulo"
    dificultad.textContent = `Dificultad: ${datos.difficulty}`;
    dificultad.id="dificultad"

    contenedorPrincipal.before(titulo);
    contenedorPrincipal.before(dificultad);

    renderizarPreguntas();
}

function eliminarPregunta(index) {
    preguntas_lista.splice(index, 1);
    preguntas_editadas.splice(index, 1);
    renderizarPreguntas();
}

function editarInformacionBasica(){
    datosJuego.editandoInformacionBasica = true;
    renderizarPreguntas();

}

function editarPregunta(index) {
    preguntas_editadas[index].editando = true;
    renderizarPreguntas();
}

function agregarPregunta() {
    const nuevaPregunta = {
        id:crypto.randomUUID(),
        text: "",
        options: ["", "", "", ""],
        editando: true
    };

    preguntas_editadas.push(nuevaPregunta);
    renderizarPreguntas();
}



function confirmarPregunta(index) {
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
    
    const questionsLimpias = preguntas_editadas.map((pregunta) => ({
    id: pregunta.id,
    text: pregunta.text,
    options: pregunta.options
    }));

    const payload = {
        questions: questionsLimpias
    };

    renderizarPreguntas();
    
    fetch(juegoElegido, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
                
            });
            console.log(payload)
        };



function confirmarEdicionDeInformacionBasica() {
    datosJuego.editandoInformacionBasica == false;
    console.log(datosJuego.e)

    const inputTitulo = document.getElementById("input-titulo");
    const inputDificultad = document.getElementById("input-dificultad");
    const inputImagen = document.getElementById("input-imagen");

    const titulo = inputTitulo.value
    const dificultad = inputDificultad.value
    const imagen = inputImagen.value

    const juegoElegido = localStorage.getItem("pregunta");

    const payload = {
        title: titulo,

        image:imagen,

        difficulty:dificultad
    };

    
    fetch(juegoElegido, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
                
            });
            console.log(payload)
        };







function renderizarPreguntas() {
    contenedorPrincipal.innerHTML = "";
    const enEdicionInformacionBasica = datosJuego.editandoInformacionBasica

        contenedorPrincipal.innerHTML = `
                        <button onclick="agregarPregunta()">Agregar pregunta</button>

        
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
