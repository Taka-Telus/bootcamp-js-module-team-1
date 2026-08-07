const inputNombre = document.querySelector('#input-nombre'); 
const saludo = document.querySelector('#saludo'); 
const btnGuardar = document.querySelector('#btn-guardar'); 
const btnBorrar = document.querySelector('#btn-borrar'); 
const btnEditar = document.querySelector('#btn-editar'); 

const nombre = localStorage.getItem('nombre'); 

if (nombre && nombre.trim() !== "") { 
    saludo.textContent = `¡Hola, ${nombre}!`; 
    inputNombre.value = nombre; 
    inputNombre.disabled = true; 
} else { 
    saludo.textContent = "ingresa tu nombre.";
} 

btnGuardar.addEventListener('click', () => { 
    if (inputNombre.value.trim() === "") {
        alert("Debes ingresar un nombre");
        return;
    }
    
    localStorage.setItem('nombre', inputNombre.value); 
    inputNombre.disabled = true; 
    window.location.href = '../index/index.html'; 
}); 

btnEditar.addEventListener('click', () => { 
    inputNombre.disabled = false; 
    inputNombre.focus(); 
});

btnBorrar.addEventListener('click', () => {
    localStorage.removeItem('nombre');
    inputNombre.value = "";
    inputNombre.disabled = false;
    saludo.textContent = "";
});
