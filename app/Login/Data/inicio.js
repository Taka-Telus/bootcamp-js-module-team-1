    const inputNombre = document.querySelector("#input-nombre");
    const saludo = document.querySelector("#saludo");
    const btnGuardar = document.querySelector("#btn-guardar");
    const btnBorrar = document.querySelector("#btn-borrar");
    const btnEditar = document.querySelector("#btn-editar");

    const nombre = localStorage.getItem("nombre");
        if(nombre){
            saludo.textContent = `¡Hola, ${nombre}!`;
            inputNombre.value = nombre;
        }
    btnGuardar.addEventListener("click", () => {
        localStorage.setItem("nombre", inputNombre.value);
    });
    
    btnBorrar.addEventListener("click", () => {
        localStorage.removeItem("nombre");
        saludo.textContent = "Ingresá tu nombre.";
    });

  //  btnEditar.addEventListener("click",()=>{});