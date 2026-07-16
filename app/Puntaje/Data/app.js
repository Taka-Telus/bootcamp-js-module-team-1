const gameId = localStorage.getItem("idJuego");
const puntajeFinal = localStorage.getItem("puntajeFinal");
const user = localStorage.getItem("nombre")
const btnJugarOtra = document.getElementById("reiniciar");
const btnInicio = document.getElementById("inicio");



const url = `https://quiz-api.cesar-kastli.workers.dev/games/${gameId}/scores`

const scoreboard = document.getElementById("scoreboard");

function lanzarConfeti() {
    const duracion = 3000;
    const fin = Date.now() + duracion;

    (function frame() {
        confetti({
            particleCount: 20,
            angle: 90,
            spread: 200,
            origin: { y: 0 }
        });

        if (Date.now() < fin) {
            requestAnimationFrame(frame);
        }
    })();
}

async function enviarPuntaje(){
    try{
        const respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                playerName: user,
                score: Number(puntajeFinal)
            })
        });
       
if (!respuesta.ok) {
    throw new Error("Error para obtener el dato");
    }
    localStorage.removeItem("puntajeFinal");

    } catch(error){
        console.log(error);
         }
    }
 
async function mostrarScoreboard() {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error("Error para obtener el dato");
        }
        const datos = await respuesta.json();
        const jugadores = {};
        datos.forEach(jugador => {
            if (
                !jugadores[jugador.playerName] ||
                jugador.score > jugadores[jugador.playerName].score
            ) {
                jugadores[jugador.playerName] = jugador;
            }
        });

        const lista = Object.values(jugadores);
        lista.sort((a, b) => b.score - a.score);
        scoreboard.innerHTML = "";

        lista.forEach((jugador, index) => {
            scoreboard.innerHTML += `
                <div class="fila">
                    <span>${index + 1}</span>
                    <span>${jugador.playerName}</span>
                    <span>${jugador.score}</span>
                </div>
            `;
        });

    } catch (error) {
        console.log(error);
    }
}
mostrarScoreboard();

async function iniciar(){
    if(puntajeFinal !== null && user){
        await enviarPuntaje();
    }
    await mostrarScoreboard();
    lanzarConfeti();

}

iniciar();


btnInicio.addEventListener("click", ()=>{
    window.location.href ="../PantallaPrin/Selecciondejuego.html"
});

btnJugarOtra.addEventListener("click", ()=>{
    window.location.href ="../Preguntas/preguntasJuego.html"
});

const btnAjustes = document.getElementById("ajustes")
btnAjustes.addEventListener("click", () =>{
    localStorage.setItem()
    window.location.hrerf = "../Configuracion/ajustes.html"
})