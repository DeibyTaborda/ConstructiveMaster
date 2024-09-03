const regexvalidacionCaracteres = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;


const validarNombre = (name) => {
    const regex = regexvalidacionCaracteres;
    let messageError = '';
    if (regex.test(name)) {
        messageError = 'No se permite números y caracteres especiales';
    } else if (name.length > 30){
        messageError = 'No se permiten más de 30 caracteres';
    }
    
    return messageError;
};

const validarCorreo = (email) => {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let errorMessage = '';
    if (!regexCorreo.test(email)) {
        return errorMessage = 'Por favor, introduce un correo electrónico válido.';
    }

    return errorMessage;
} 

const validarTelefono = (telefono) => {
    let errorMessage = '';
    const lengthTelefono = telefono.length;

    if (lengthTelefono > 10){
        return errorMessage = 'El número telefonico debe contener máximo 10 dígitos';
    } else if (lengthTelefono < 7) {
        return errorMessage = 'El número debe tener al menos 7 dígitos';
    }

    return errorMessage;
}

const validarFile = (file) => {
    const regexFile = /^.*\.(pdf|doc|docx)$/i;
    let errorMessage = '';
    const fileValidado = regexFile.test(file);

    if (!fileValidado) {
        return errorMessage = 'Extensión de archivo no permitida';
    }

    return errorMessage;
}

const validarImagen = (imagen) => {
    const regexImagen = /\.(jpg|jpeg|png|gif|bmp)$/i;
    const imagenValidada = regexImagen.test(imagen);

    if (imagenValidada) {
        return true;
    } 

    return false;
}

const validarCategoria = (categoria) => {
    const longitudCategoria = categoria.length;
    let errorMessage = '';

    if (longitudCategoria > 30) {
        return errorMessage = 'No se permiten más de 30 caracteres';
    } else if (regexvalidacionCaracteres.test(categoria)) {
        return errorMessage = 'No se permiten números ni caracteres especiales. Inténtalo nuevamente'
    }

    return errorMessage;

}

const validarSoloLetras = (cadena) => {
    if (regexvalidacionCaracteres.test(cadena)) {
        return true
    }

    return false;
}

const validarLongitud = (cadena, longitud) => {
    if (cadena.length > longitud) {
        return true;
    }

    return false;
}

const validarNumerosYSimbolos = (texto) => {
    const regexNumerosYSimbolos = /[0-9!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]/; 
    return regexNumerosYSimbolos.test(texto);
}

const validarNumeroTelefonico = (telefono) => {
    const regexTelefono = /^(3\d{9}|\d{7})$/
    if (regexTelefono.test(telefono)) {
        return true;
    }

    return false;
}






exports.validarNombre = validarNombre;
exports.validarCorreo = validarCorreo;
exports.validarTelefono = validarTelefono;
exports.validarFile = validarFile;
exports.validarImagen = validarImagen;
exports.validarCategoria  = validarCategoria;
exports.validarSoloLetras  = validarSoloLetras;
exports.validarLongitud = validarLongitud;
exports.validarNumerosYSimbolos = validarNumerosYSimbolos;
exports.validarNumeroTelefonico = validarNumeroTelefonico;