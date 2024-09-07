export const validarContrasena = (contrasena) => {
    let messageError = '';
    if (contrasena.length > 15) {
        messageError = 'No se permiten más de 15 caracteres';
    }
    return messageError;
};

export const validarLongitudCorreo = (correo) => {
    let messageError = '';
    if(correo.length > 60){
        messageError = 'No se permite más de 60 caracteres';
    }
    return messageError;
}

export const contrasenaMinima = (contrasena) => {
    let messageError = '';
    if(contrasena.length < 8 ){
        messageError = 'La contraseña debe tener al menos 8 caracteres';
    }
    return messageError;
}

export const primeraLetraMayuscula = (cadena) => {
    return cadena.replace(/^[a-zA-Z]/, (match) => match.toUpperCase());
}

export const validarLongitudTexto = (texto, longitud) => {
    if (texto.length > longitud){
        return true;
    } 

    return false;
} 

export const validarCorreo2 = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
}

export const validarArchivo = (nombreArchivo) => {
    const regex = /\.((docx?)|(pdf))$/i;
    return regex.test(nombreArchivo);
};


//NUEVAS FUNCIONES ACTUALIZADAS
// Expresiones regulares
const regexValidacionCaracteres = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;
const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexFile = /^.*\.(pdf|doc|docx)$/i;
const regexImagen = /\.(jpg|jpeg|png|gif|bmp)$/i;
const regexNumerosYSimbolos = /[0-9!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]/;
const regexTelefono = /^(3\d{9}|\d{7})$/;
const regexHora = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

// Validar nombre (no permite números ni caracteres especiales)
export const validarNombre = (name) => {
    if (regexValidacionCaracteres.test(name)) {
        return 'No se permiten números ni caracteres especiales';
    } else if (name.length > 30) {
        return 'No se permiten más de 30 caracteres';
    }
    return '';
};

// Validar correo electrónico
export const validarCorreo = (email) => {
    if (!regexCorreo.test(email)) {
        return 'Por favor, introduce un correo electrónico válido.';
    }
    return '';
};

// Validar teléfono
export const validarTelefono = (telefono) => {
    const lengthTelefono = telefono.length;
    if (lengthTelefono > 10) {
        return 'El número telefónico debe contener máximo 10 dígitos';
    } else if (lengthTelefono < 7) {
        return 'El número debe tener al menos 7 dígitos';
    }
    return '';
};

// Validar archivo (solo PDF, DOC, DOCX)
export const validarFile = (file) => {
    if (!regexFile.test(file)) {
        return 'Extensión de archivo no permitida';
    }
    return '';
};

// Validar imagen (solo formatos jpg, jpeg, png, gif, bmp)
export const validarImagen = (imagen) => {
    return regexImagen.test(imagen);
};

// Validar categoría (sin caracteres especiales ni números)
export const validarCategoria = (categoria) => {
    if (categoria.length > 30) {
        return 'No se permiten más de 30 caracteres';
    } else if (regexValidacionCaracteres.test(categoria)) {
        return 'No se permiten números ni caracteres especiales. Inténtalo nuevamente';
    }
    return '';
};

// Validar solo letras (no números ni símbolos)
export const validarSoloLetras = (cadena) => {
    return regexValidacionCaracteres.test(cadena);
};

// Validar longitud de una cadena
export const validarLongitud = (cadena, longitud) => {
    return cadena.length > longitud;
};

// Validar si contiene números y símbolos
export const validarNumerosYSimbolos = (texto) => {
    return regexNumerosYSimbolos.test(texto);
};

// Validar número telefónico (colombiano)
export const validarNumeroTelefonico = (telefono) => {
    return regexTelefono.test(telefono);
};

// Validar si un valor es numérico
export const esNumerico = (valor) => {
    return !isNaN(parseFloat(valor)) && isFinite(valor);
};

// Validar si una fecha es válida
export const esFechaValida = (fecha) => {
    return fecha instanceof Date && !isNaN(fecha.getTime());
};

// Validar si una hora es válida (formato HH:mm o HH:mm:ss)
export const esHoraValida = (hora) => {
    return regexHora.test(hora);
};
