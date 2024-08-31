const db = require('../db/db');
const validations = require('../validations/validations');

// Controlador para registrar los clientes
exports.registroUsuario = (req, res) => {
    const registerUser = 'INSERT INTO cliente(nombre, correo, contrasena) VALUES(?, ?, ?)';
    const { nombre, correo, contrasena, confirmContrasena } = req.body;
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexNombre = /\d+/;

    if (nombre === '' && correo === '' && contrasena === '' && confirmContrasena === '') {
        console.log('Todos los campos están vacíos');
        return res.status(400).json({ message: 'Todos los campos están vacíos' });
    }

    if (nombre === '') {
        console.log('El nombre no puede estar vacío');
        return res.status(400).json({ message: 'El nombre no puede estar vacío' });
    } else if (regexNombre.test(nombre)) {
        console.log('El nombre no debe contener números');
        return res.status(400).json({ message: 'El nombre no debe contener números' });
    }

    if (correo === '') {
        console.log('El correo no puede estar vacío');
        return res.status(400).json({ message: 'El correo no puede estar vacío' });
    }

    if (!regexCorreo.test(correo)) {
        console.log('El correo no es válido');
        return res.status(400).json({ message: 'El correo no es válido' });
    }

    if (contrasena === '') {
        console.log('La contraseña no puede estar vacía');
        return res.status(400).json({ message: 'La contraseña no puede estar vacía' });
    }

    if (confirmContrasena === '') {
        console.log('La confirmación de la contraseña no puede estar vacía');
        return res.status(400).json({ message: 'La confirmación de la contraseña no puede estar vacía' });
    }

    if (contrasena !== confirmContrasena) {
        console.log('Las contraseñas no coinciden');
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    if (contrasena.length < 8 || confirmContrasena.length < 8){
        console.log('La contraseña debe tener al menos 8 caracteres');
        return res.status(400).json({ message : 'La contraseña debe tener al menos 8 caracteres'});
    }
 
    db.query(registerUser, [nombre, correo, contrasena], (error, results) => {
        if (error) {
            console.error('Error al insertar los datos', error);
            return res.status(500).json({ message: 'Error al insertar los datos' });
        } else {
            console.log('Inserción exitosa');
            return res.status(201).json({ message: 'Usuario registrado exitosamente' });
        }
    });
};

// Controlador para registrar una solicitud de incorporación por parte de un usuario con alguna especialidad en el áraa de la construcción.
exports.solicitudProfesional = (req, res) => {
    const {nombre, apellido, especialidad,correo, telefono} = req.body;
    const curriculum = req.file.originalname;
    const curriculumFile = req.file ? req.file.path : null;
    console.log(curriculum);
    const solicitudProfesional = 'INSERT INTO solicitud(nombre, apellido, especialidad, correo, telefono, curriculum) VALUES(?, ?, ?, ?, ?, ?)';

    if (!nombre || !apellido || !correo || !telefono) {
        console.log('Los datos no estan completos');
        return res.status(400).json({ message : 'Los campos no estan completos'});
    }

    if (nombre) {
       const nombreValidado =  validations.validarNombre(nombre);
       if (nombreValidado) {
        console.log(nombreValidado);
        return res.status(400).json({ message: nombreValidado});
       }
    }

    if (apellido) {
        const apellidoValidado = validations.validarNombre(apellido);
        if (apellidoValidado) {
            console.log(apellidoValidado);
            return res.status(400).json({ message: nombreValidado});
        }
    }

    if (correo) {
        const correoValidado = validations.validarCorreo(correo);
        if (correoValidado) {
            console.log(correoValidado);
            return res.status(400).json({ message: correoValidado});
        }
    }

    if (telefono) {
        const telefonoValidado = validations.validarTelefono(telefono);
        if (telefonoValidado) {
            console.log(telefonoValidado);
            return res.status(400).json({ message: telefonoValidado});
        }
    }

    if (curriculumFile) {
        const fileValidado = validations.validarFile(curriculum);
        if (fileValidado) {
            console.log(fileValidado);
            return res.status(400).json({ message: fileValidado});
        }
    }

    db.query(solicitudProfesional, [nombre, apellido, especialidad, correo, telefono, curriculumFile], (error, results) => {
        if (error) {
            console.error('Error en registrar la solicitud', error.message);
            return res.status(500).json({ message: 'Error en insertar la solicitud. Intentalo de nuevo más tarde.'});
        } 

        console.log('Solicitud registrada exitosamente');
        return res.status(200).json({ message: 'Solicitud registrada exitosamente'});
    });
}

// Controlador para obtener todas las categorías.
exports.seleccionarSubategorias = (req, res) => {
    const selectSubcategories = 'SELECT subcategoria FROM subcategoria';
    
    db.query(selectSubcategories, (error, results) => {
        if (error) {
            console.error('Error en seleccionar las subcategorias');
            res.status(500).json({ message: 'Error en seleccionar las subcategorías'});
        } else {
            console.log('Las subcategorías se seleccionaron');
            console.log(results);
            res.status(200).json(results);
        }
    })
}