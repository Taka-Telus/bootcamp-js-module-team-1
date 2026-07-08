const RankingJugadores = document.getElementById("ranking");
const url = `https://quiz-api.cesar-kastli.workers.dev/scores`

const scoreboard = getElementById("scoreboard");
async function mostrarScoreboard(){
    const respuesta = await fetch(url);
    const datos = await respuesta.json()
    console.log(datos)
}