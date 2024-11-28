// Expresiones regulares
const regexvalidacionCaracteres = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;
const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexFile = /^.*\.(pdf|doc|docx)$/i;
const regexImagen = /\.(jpg|jpeg|png|gif|bmp)$/i;
const regexTelefono = /^(3\d{9}|\d{7})$/;
const regexHora = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

// Validaciones de campos específicos
const validarNombre = (name) => {
    let messageError = '';
    if (regexvalidacionCaracteres.test(name)) {
        messageError = 'No se permite números y caracteres especiales';
    } else if (name.length > 30) {
        messageError = 'No se permiten más de 30 caracteres';
    }
    return messageError;
};

const validarCorreo = (email) => {
    let errorMessage = '';
    if (!regexCorreo.test(email)) {
        errorMessage = 'Por favor, introduce un correo electrónico válido.';
    }
    return errorMessage;
};

const validarTelefono = (telefono) => {
    let errorMessage = '';
    const lengthTelefono = telefono.length;
    if (lengthTelefono > 10) {
        errorMessage = 'El número telefónico debe contener máximo 10 dígitos';
    } else if (lengthTelefono < 7) {
        errorMessage = 'El número debe tener al menos 7 dígitos';
    }
    return errorMessage;
};

const validarFile = (file) => {
    let errorMessage = '';
    if (!regexFile.test(file)) {
        errorMessage = 'Extensión de archivo no permitida';
    }
    return errorMessage;
};

const validarImagen = (imagen) => {
    return regexImagen.test(imagen);
};

const validarCategoria = (categoria) => {
    let errorMessage = '';
    if (categoria.length > 30) {
        errorMessage = 'No se permiten más de 30 caracteres';
    } else if (regexvalidacionCaracteres.test(categoria)) {
        errorMessage = 'No se permiten números ni caracteres especiales. Inténtalo nuevamente';
    }
    return errorMessage;
};

// Validaciones genéricas
const validarSoloLetras = (cadena) => {
    return !regexvalidacionCaracteres.test(cadena);
};

const validarLongitud = (cadena, longitud) => {
    return cadena.length > longitud;
};

const longitudMaxima = (cadena, longitud) => {
    return cadena.length > longitud;
}

const validarNumerosYSimbolos = (texto) => {
    const regexNumerosYSimbolos = /[0-9!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]/;
    return regexNumerosYSimbolos.test(texto);
};

const validarNumeroTelefonico = (telefono) => {
    return regexTelefono.test(telefono);
};

// Validaciones de formato
const esNumerico = (valor) => {
    return !isNaN(parseFloat(valor)) && isFinite(valor);
};

const esFechaValida = (fecha) => {
    return fecha instanceof Date && !isNaN(fecha.getTime());
};

const esHoraValida = (hora) => {
    return regexHora.test(hora);
};

const longitudMinima = (valor, longitud) => {
    return valor.length < longitud;
}


// Exportación de funciones
exports.validarNombre = validarNombre;
exports.validarCorreo = validarCorreo;
exports.validarTelefono = validarTelefono;
exports.validarFile = validarFile;
exports.validarImagen = validarImagen;
exports.validarCategoria = validarCategoria;
exports.validarSoloLetras = validarSoloLetras;
exports.validarLongitud = validarLongitud;
exports.validarNumerosYSimbolos = validarNumerosYSimbolos;
exports.validarNumeroTelefonico = validarNumeroTelefonico;
exports.esNumerico = esNumerico;
exports.esFechaValida = esFechaValida;
exports.esHoraValida = esHoraValida;
exports.longitudMaxima =  longitudMaxima;
exports.longitudMinima = longitudMinima;
