

const Ajustes = {
  claves: {
    sonido: 'ajustes_sonido',
    vibracion: 'ajustes_vibracion'
  },
 
  obtener(clave) {
    const valor = localStorage.getItem(this.claves[clave]);
    return valor === null ? true : valor === 'true';
  },

  guardar(clave, valor) {
    localStorage.setItem(this.claves[clave], valor);
  },

  aplicarCambio(clave, valor) {
    if (clave === 'sonido') {
      if (window.audioJuego) {
        window.audioJuego.muted = !valor;
      }
      console.log('Sonido:', valor ? 'activado' : 'desactivado');
    }

    if (clave === 'vibracion') {
      console.log('Vibracion:', valor ? 'activada' : 'desactivada');
    }
  },

  vibrar(duracion = 100) {
    if (this.obtener('vibracion') && navigator.vibrate) {
      navigator.vibrate(duracion);
    }
  }
};


document.addEventListener('DOMContentLoaded', () => {
  const switchSonido = document.querySelector('.Sonido input[type="checkbox"]');
  const switchVibracion = document.querySelector('.Vibracion input[type="checkbox"]');
  const btnGuardar = document.querySelector('.guardar');

  if (!switchSonido || !switchVibracion) return; 


  switchSonido.checked = Ajustes.obtener('sonido');
  switchVibracion.checked = Ajustes.obtener('vibracion');

  btnGuardar.addEventListener('click', () => {
    Ajustes.guardar('sonido', switchSonido.checked);
    Ajustes.guardar('vibracion', switchVibracion.checked);

    Ajustes.aplicarCambio('sonido', switchSonido.checked);
    Ajustes.aplicarCambio('vibracion', switchVibracion.checked);

    console.log('Cambios guardados');

  });
});
const btnVolver = document.getElementById("volver");
const btnCerrar = document.getElementById("cerrar");

btnVolver.addEventListener("click", ()=>{
    window.location.href = "../index/index.html";
});

btnCerrar.addEventListener("click", ()=>{
    localStorage.removeItem("nombre");
    window.location.href = "../Login/Login.html";
})

const btnSalir = document.getElementById("salir");

btnSalir.addEventListener("click", ()=>{
  window.history.back();
})