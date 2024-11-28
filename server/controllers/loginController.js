const db = require('../db/db');
const jwt = require('jsonwebtoken');
const secret_key = 'my-secret-constructivemaster';
const { compararContrasena } = require('../validations/generadorContrasena');

const logearUsuario = (req, res) => {
    const { correo, contrasena } = req.body;
    const loginQueries = [
        'SELECT id, nombre, correo, telefono, direccion, imagen, contrasena FROM cliente WHERE correo = ?',
        'SELECT id, nombre, apellido, correo, telefono, imagen, contrasena FROM admin WHERE correo = ?',
        'SELECT id, nombre, apellido, especialidad, correo, telefono, curriculum, imagen, contrasena FROM profesional WHERE correo = ?',
        'SELECT id, correo, contrasena, nombre FROM super_admin WHERE correo = ?'
    ];

    if (!correo) {
        console.log('El correo está vacío');
        return res.status(400).json({ message: "El correo está vacío" });
    } else if (!contrasena) {
        console.log('La contraseña está vacía');
        return res.status(400).json({ message: "La contraseña está vacía" });
    }

    const checkUser = (queryIndex) => {
        if (queryIndex >= loginQueries.length) {
            console.log('El usuario no existe');
            return res.status(404).send('El usuario no existe');
        }

        let rol = '';
        if (queryIndex === 0) rol = 'cliente';
        else if (queryIndex === 1) rol = 'admin';
        else if (queryIndex === 2) rol = 'profesional';
        else if (queryIndex === 3) rol = 'super_admin';

        // Realizamos la consulta sin la contraseña
        db.query(loginQueries[queryIndex], [correo], (error, results) => {
            if (error) {
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            if (results.length > 0) {
                const user = results[0];
                
                // Comparar la contraseña ingresada con la encriptada
                const esValida = compararContrasena(contrasena, user.contrasena);
                
                if (esValida) {
                    const token = jwt.sign({ ...user, rol }, secret_key, { expiresIn: '4h' });
                    console.log('Usuario logueado');

                    const usuarioFinal = { ...user, token, rol };
                    delete usuarioFinal.contrasena;
                    return res.status(200).json(usuarioFinal);
                } else {
                    console.log('Contraseña incorrecta');
                    return res.status(401).json({ message: "Contraseña incorrecta" });
                }
            } else {
                checkUser(queryIndex + 1);
            }
        });
    };

    checkUser(0);
};

module.exports = logearUsuario;


const verificarToken = (req, res, next) => {
    const header = req.header('Authorization') || "";
    const token = header.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    } 

    try {
        const payload = jwt.verify(token, secret_key);
        req.id = payload.id;
        req.correo = payload.correo;
        req.rol = payload.rol;
        req.nombre = payload.nombre;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const verificarRol = (rolesPermitidos) => (req, res, next) => {
    const { rol } = req;

    if (rolesPermitidos.includes(rol)) {
        console.log(rol)
        next();
    } else {
        console.log('Error, el rol no es permitido');
        return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta' });
    }
};

const verificarRuta = (req, res) => {
    res.status(200).json({ message: "Tienes acceso" });
}

module.exports = {
    logearUsuario,
    verificarToken,
    verificarRol,
    verificarRuta
};
