const contenedorPrincipal = document.getElementById("contenedorPrincipal");
let preguntas_lista = [];
let preguntas_editadas = [];

function eliminarPregunta(index) {
    preguntas_lista.splice(index, 1);
    preguntas_editadas.splice(index, 1);
    renderizarPreguntas(); 
}

function editarPregunta(index) {
    preguntas_editadas[index].editando = true;
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
    
    
    renderizarPreguntas();
    console.log("Preguntas editadas:", preguntas_editadas);
    console.log("Preguntas originales:", preguntas_lista);

}

function renderizarPreguntas() {
    contenedorPrincipal.innerHTML = "";

    preguntas_editadas.forEach((pregunta, index) => {
        const preguntaDiv = document.createElement("div");
        preguntaDiv.classList.add("pregunta");
        
        const enEdicion = pregunta.editando === true;

        preguntaDiv.innerHTML = `
            <h3>Pregunta ${index + 1}</h3>
            ${enEdicion
                ? `<input type="text" id="input-pregunta-${index}" value="${pregunta.text}" class="editando">`
                : `<h4>${pregunta.text}</h4>`
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

async function cargarPreguntas() {
    const juegoElegido = localStorage.getItem("pregunta");
    const respuesta = await fetch(juegoElegido);
    const datos = await respuesta.json();
    
    preguntas_lista = datos.questions.map((q, index) => ({ ...q, editando: false ,  }));
    
    preguntas_editadas = datos.questions.map((q, index) => ({ ...q, editando: false }));

    const titulo = document.createElement("h2");
    const dificultad = document.createElement("p");

    titulo.textContent = datos.title;
    dificultad.textContent = `Dificultad: ${datos.difficulty}`;

    contenedorPrincipal.before(titulo);
    contenedorPrincipal.before(dificultad);

    renderizarPreguntas();
}

cargarPreguntas();
