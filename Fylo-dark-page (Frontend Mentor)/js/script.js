const inputEmail = document.querySelector('#email');

inputEmail.addEventListener('input', validacion);

function validacion(e)  {
    if(e.target.id === 'email' && !validarEmail(e.target.value)) {
        mostrarAlerta('Ingresa un email valido', e.target.parentElement);
        return;
    }
    limpiar(e.target.parentElement);
}

function validarEmail(email) {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const resultado = regex.test(email);
    return resultado;
}

function mostrarAlerta(mensaje, referencia) {
    limpiar(referencia);
    const error = document.createElement('P');
    error.textContent = mensaje;
    error.classList.add('errorEmail');
    referencia.appendChild(error);
}

function limpiar(referencia) {
    const limpiarAlerta = referencia.querySelector('.errorEmail');
    if(limpiarAlerta) {
        limpiarAlerta.remove();
    }
}