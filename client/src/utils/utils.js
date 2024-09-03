// validaciones.js
export const validarNombre = (name) => {
    const regex = /[^a-zA-ZñÑáéíóúüÁÉÍÓÚÜ\s]/g;
    let messageError = '';
    if (regex.test(name)) {
        messageError = 'No se permite números y caracteres especiales';
    } else if (name.length > 50){
        messageError = 'No se permiten más de 50 caracteres';
    }
    return messageError;
};

export const validarCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let messageError = '';
    if (!regex.test(correo)) {
        messageError = 'Correo no permitido';
    } else if(correo.length > 60){
        messageError = 'No se permiten más de 60 caracteres';
    }
    return messageError;
};

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

// export const primeraLetraMayusculas = (texto) => {
//     const palabras = texto.split(' ');

//     const palabrasConPrimeraLetraMayuscula = palabras.map(palabra => {
//         const primeraLetra = palabra.charAt(0).toUpperCase();
//         const restoDeLaPalabra = palabra.slice(1);
//         return primeraLetra + restoDeLaPalabra;
//     });
    
//     return palabrasConPrimeraLetraMayuscula.join(' ');
// }

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

export const validarNumerosYSimbolos = (texto) => {
    const regexNumerosYSimbolos = /[0-9!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]/; 
    return regexNumerosYSimbolos.test(texto);
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

