const gameId = localStorage.getItem("idJuego");
const puntajeFinal = localStorage.getItem("puntajeFinal");
const user = localStorage.getItem("nombre")
const btnJugarOtra = document.getElementById("reiniciar");
const btnInicio = document.getElementById("inicio");



const url = `https://quiz-api.cesar-kastli.workers.dev/games/${gameId}/scores`

const scoreboard = document.getElementById("scoreboard");

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

        if(!respuesta.ok){
            const detalleError = await respuesta.json().catch(() => null);
            console.log("Detalle del error:", detalleError);
            throw new Error("Error al guardar el puntaje");
        }

    } catch(error){
        console.log(error);
    }
}
async function mostrarScoreboard(){
try{
    const respuesta = await fetch(url);
    method: "POST"
    headers: { "Content-Type", "application/json" }
    body: JSON.stringify({   "playerName": "César", "score": 8,
            "playerName": "Ana", "score": 10
    })

    if(!respuesta.ok){
        throw new Error("Error para obtener el dato");
    }

    const datos = await respuesta.json()
    console.log(datos);
    scoreboard.innerHTML= "";
    datos.forEach((jugador, index) => {
        scoreboard.innerHTML+=`
        <div class="fila">
        <span>${index+1}</span>
        <span>${jugador.playerName}</span>
        <span>${jugador.score}</span>
        </div>`
    });

    } catch(error){
        console.log(error);
    }
}

mostrarScoreboard();
async function iniciar(){
    if(puntajeFinal !== null && user){
        await enviarPuntaje();
    }
    await mostrarScoreboard();
}

iniciar();

btnInicio.addEventListener("click", ()=>{
    window.location.href = "Selecciondejuego.html"
});

btnJugarOtra.addEventListener("click", ()=>{
    window.location.href ="preguntasJuego.html"
});