// bcryptHelper.js
const bcrypt = require('bcryptjs');

// Función para encriptar una contraseña
const encriptarContrasena = (contrasena) => {
    const sal = bcrypt.genSaltSync(10);  // Genera la "sal" con una dificultad de 10
    const contrasenaEncriptada = bcrypt.hashSync(contrasena, sal);  // Encripta la contraseña
    return contrasenaEncriptada;
};

// Comparar la contraseña en texto plano con la encriptada
const compararContrasena = (contrasenaIngresada, contrasenaEncriptada) => {
    return bcrypt.compareSync(contrasenaIngresada, contrasenaEncriptada);
};

module.exports = {
    encriptarContrasena,
    compararContrasena
};
