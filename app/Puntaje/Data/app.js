const gameId = localStorage.getItem("idJuego");
const puntajeFinal = localStorage.getItem("puntajeFinal");
const user = localStorage.getItem("")


const url = `https://quiz-api.cesar-kastli.workers.dev/games/${gameId}/scores`

const scoreboard = document.getElementById("scoreboard");

async function enviarPuntaje(){

}

async function mostrarScoreboard(){

    const respuesta = await fetch(url);

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
        <span>${jugador.name}</span>
        <span>${jugador.score}</span>
        </div>`
    });

    } catch(error){
        console.log(error);
    }

mostrarScoreboard();