    const inputNombre = document.querySelector("#input-nombre");
    const saludo = document.querySelector("#saludo");
    const btnGuardar = document.querySelector("#btn-guardar");
    const btnBorrar = document.querySelector("#btn-borrar");
    const btnEditar = document.querySelector("#btn-editar");

    const nombre = localStorage.getItem("nombre");
        if(nombre){
            saludo.textContent = `¡Hola, ${nombre}!`;
            inputNombre.value = nombre;
            inputNombre.disabled = true;
        }
    btnGuardar.addEventListener("click", () => {
        localStorage.setItem("nombre", inputNombre.value);
        inputNombre.disabled = true ;

        window.location.href= "PantallaP.html";
    });
  

    btnEditar.addEventListener("click",()=>{
         inputNombre.disabled = false;
         inputNombre.focus();
   });