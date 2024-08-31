const db = require('../db/db');
const jwt = require('jsonwebtoken');
const secret_key = 'my-secret-constructivemaster';

const logearUsuario = (req, res) => {
    const { correo, contrasena } = req.body;
    const loginQueries = [
        'SELECT id, nombre, correo, telefono, direccion, imagen FROM cliente WHERE correo = ? AND contrasena = ?',
        'SELECT id, nombre, apellido, correo, telefono, imagen FROM admin WHERE correo = ? AND contrasena = ?',
        'SELECT id, nombre, apellido, especialidad, correo, telefono, curriculum, imagen FROM profesional WHERE correo = ? AND contrasena = ?',
        'SELECT id, correo, contrasena, nombre FROM super_admin WHERE correo = ? AND contrasena = ?'
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

        if (queryIndex === 0) {
            rol = 'cliente';
        } else if (queryIndex === 1) {
            rol = 'admin';
        } else if (queryIndex === 2) {
            rol = 'profesional';
        } else if (queryIndex === 3) {
            rol = 'super_admin';
        } 

        db.query(loginQueries[queryIndex], [correo, contrasena], (error, results) => {
            if (error) {
                console.error('Error en la consulta:', error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            if (results.length > 0) {
                const user = results[0];
    
                const token = jwt.sign({...user, rol}, secret_key, { expiresIn: '4h' });
                console.log('Usuario logueado');
                console.log(token);

                const usuarioFinal = { ...user, token, rol };
                console.log(usuarioFinal);
                
                return res.status(200).json(usuarioFinal);
            } else {
                checkUser(queryIndex + 1);
            }
        });
    };

    checkUser(0);
};

const verificarToken = (req, res, next) => {
    const header = req.header('Authorization') || "";
    const token = header.split(' ')[1];

    console.log(`facha ${token}`)

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
