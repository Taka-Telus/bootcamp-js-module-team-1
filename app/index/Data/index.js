
const fichaDeJuegos = document.getElementById("fichaDeJuego");
const boton = document.getElementById("cargarListaDeJuegos");
const url = `https://quiz-api.cesar-kastli.workers.dev/games`;
const botonJugar = document.getElementById("botonJugar");
const botonCrear = document.getElementById("botonCrear");

async function jugar() {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error en la respuesta de la red");
        const juegos = await respuesta.json();
        
        fichaDeJuegos.innerHTML = "";
        juegos.forEach((juego) => {
            const li = document.createElement("li");
            li.className = "Juego";
            li.innerHTML = `
            <div class="contenedor-fichaDejuegos">
                <div class="contenedor-fichaDeJuegosImagen">
                    <img src="${juego.image}" class="fichaDejuegosImagenes"/>
                </div>
                <div> 
                    <h3>${juego.title}</h3>
                    <p> ${juego.questionCount ?? "—"} Questions · Level : Hard</p>
                </div>
                <div>
                    <button class="botonJugar" data-id="${juego.id}">Jugar</button>
                    <button class="botonEditar" data-id="${juego.id}">Editar</button>
                </div>
            </div>
            `;
            fichaDeJuegos.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar los juegos:", error);
    }
}

fichaDeJuegos.addEventListener("click", async (event) => {
    try {
        if (event.target.classList.contains("botonJugar")) {
            const idJuego = event.target.dataset.id;
            const urlPreguntas = `${url}/${idJuego}`;
            localStorage.setItem("idJuego",idJuego)
            localStorage.setItem("pregunta", urlPreguntas);
            window.location.href = "../jugar/jugar.html";
        }
    } catch (error) {
        console.error("Error en la redirección de juego:", error);
    }
});

fichaDeJuegos.addEventListener("click", async (event) => {
    try {
        if (event.target.classList.contains("botonEditar")) {
            const idJuego = event.target.dataset.id;
            const urlPreguntas = `${url}/${idJuego}`;
            localStorage.setItem("pregunta", urlPreguntas);
            localStorage.setItem("idJuego",idJuego)

            
            const respuesta = await fetch(urlPreguntas);
            if (!respuesta.ok) throw new Error("Error al obtener las preguntas");
            const preguntas = await respuesta.json();
            
            if (preguntas.questions && preguntas.questions.length >= 0) {
                window.location.href = "../editar/editar.html";
            }
        }
    } catch (error) {
        console.error("Error al cargar datos para edición:", error);
    }
});

botonCrear.addEventListener("click", async (event) => {
    try {
        window.location.href = "../creacionDeJuegos/creacionDeJuegos.html";
    } catch (error) {
        console.error("Error en la redirección de creación:", error);
        
    }
});

jugar();
