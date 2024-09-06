const db = require('../db/db');
const validations = require('../validations/validations');
const mysql2 = require('../db/db-mysql2');

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
    const curriculum = req.file ? req.file.originalname : null;
    const curriculumFile = req.file ? req.file.path : null;
    console.log(nombre);
    const solicitudProfesional = 'INSERT INTO solicitud(nombre, apellido, especialidad, correo, telefono, curriculum) VALUES(?, ?, ?, ?, ?, ?)';

    // Consultas para verificar que el correo que se esta ingresando en la solicitud no pertenezca a otro usuario
    const consultarCorreoUsuarios = [
        'SELECT correo FROM super_admin WHERE correo = ?',
        'SELECT correo FROM admin WHERE correo = ?',
        'SELECT correo FROM cliente WHERE correo = ?',
        'SELECT correo FROM profesional WHERE correo = ?'
    ];

    // Validar que no haga falta ningún dato
    if (!nombre || !apellido || !especialidad || !correo || !telefono) {
        console.log('Los datos no estan completos');
        return res.status(400).json({ message : 'Los campos no estan completos'});
    }

    // Validación individual para dar respuesta personalizada al usuario en caso del que la hoja de vida no sea adjuntada en la solicitud
    if (!curriculum) {
        return res.status(400).json({ message: 'La hoja de vida es obligatoria. Por favor, adjunte el archivo.' });
    }

    // Validar que el nombre no contenga números ni caracteres especiales y que no contenga más de 30 caracteres
    if (nombre) {
       const nombreValidado =  validations.validarNombre(nombre);
       if (nombreValidado) {
        console.log(nombreValidado);
        return res.status(400).json({ message: nombreValidado});
       }
    }

    // Validar que el apellido no contenga números ni caracteres especiales y que no contenga más de 30 caracteres
    if (apellido) {
        const apellidoValidado = validations.validarNombre(apellido);
        if (apellidoValidado) {
            console.log(apellidoValidado);
            return res.status(400).json({ message: apellidoValidado});
        }
    }

    // Validar que el correo adjunto en la solicitud sea un correo válido y que no contenga más de 60 caracteree
    if (correo) {
        const correoValidado = validations.validarCorreo(correo);
        if (correoValidado) {
            console.log(correoValidado);
            return res.status(400).json({ message: correoValidado});
        }
    }

    // Validar que el teléfono no contenga mas de 10  y menos de 7 dígitos 
    if (telefono) {
        const telefonoValidado = validations.validarTelefono(telefono);
        if (telefonoValidado) {
            console.log(telefonoValidado);
            return res.status(400).json({ message: telefonoValidado});
        }
    }

    // Validar que el archivo adjunto sea pdf, doc o docx
    if (curriculumFile) {
        const fileValidado = validations.validarFile(curriculum);
        if (fileValidado) {
            console.log(fileValidado);
            return res.status(400).json({ message: fileValidado});
        }
    }

    // Función para iterar en cada una de las tablas de que el correo no lo este usando uno de los usuarios del sitio web.
    for (let consulta of consultarCorreoUsuarios) {
        db.query(consulta, [correo], (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error en verificar le correo' });
            } 

            if (results.length > 0) {
                return res.status(409).json({ message: 'El correo ya esta en uso' });
            }
        })
    }

    // Registrar los datos en la base de datos
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

exports.SolicitudTrabajo = async(req, res) => {
    const {id_cliente, id_profesional, hora, fecha, direccion, valor, descripcion}  = req.body;

    if (!id_cliente && id_profesional && !hora && !fecha && !direccion && !valor && !descripcion) {
        return res.status(400).json({ message: 'Todos los campos están vacíos' });
    }

    const erroresSolicitudTrabajo = {};
    console.log(id_cliente);
    if (!id_cliente) erroresSolicitudTrabajo.id_cliente = 'El id del cliente es obligatorio';
    if (!id_profesional) erroresSolicitudTrabajo.id_profesional = 'El id del profesional es obligatorio';
    if (!hora) erroresSolicitudTrabajo.hora = 'La hora es obligatoria';
    if (!fecha) erroresSolicitudTrabajo.fecha = 'La fecha es obligatoria';
    if (!direccion) erroresSolicitudTrabajo.direccion = 'La dirección es obligatoria';
    if (!valor) erroresSolicitudTrabajo.valor = 'El valor es obligatorio';
    
    if (id_cliente && !validations.esNumerico(id_cliente)) erroresSolicitudTrabajo.formatoId_cliente = 'El id del cliente no es un valor númerico';
    if (id_profesional && !validations.esNumerico(id_profesional)) erroresSolicitudTrabajo.formatoId_profesional = 'El id del profesional no es un valor númerico';
    if (fecha && !validations.esFechaValida( new Date(fecha))) erroresSolicitudTrabajo.formatoFecha = 'Fecha no válida: por favor, ingrese una fecha correcta.';
    if (hora &&!validations.esHoraValida(hora)) erroresSolicitudTrabajo.formatoHora = 'Hora no válida: por favor, ingrese una hora válida';
    if (valor && !validations.esNumerico(valor)) erroresSolicitudTrabajo.formatoValor = 'El valor debe ser un valor númerico';

    // Verificar si hay errores
    if (Object.keys(erroresSolicitudTrabajo).length > 0) {
      return res.status(200).json(erroresSolicitudTrabajo);
    } 

    const datosSolicitud = {};
    if (id_cliente) datosSolicitud.id_cliente = id_cliente;
    if (id_profesional) datosSolicitud.id_profesional = id_profesional;
    if (fecha) datosSolicitud.fecha = fecha;
    if (hora) datosSolicitud.hora = hora;
    if (direccion) datosSolicitud.direccion = direccion;
    if (valor) datosSolicitud.valor = valor;
    if (descripcion) datosSolicitud.descripcion = descripcion;


    if (Object.keys(datosSolicitud).length === 0) {
        return res.status(400).json({ mensaje: 'No se proporcionaron datos para actualizar.' });
    }

    // Construir la consulta SQL dinámicamente
    const setClauseKeys = Object.entries(datosSolicitud)
    .map(([key, value]) => key)
    .join(', ');

    const setClauseValues = Object.values(datosSolicitud)
    .map((value) => `?`)
    .join(', ')

    const datos = Object.values(datosSolicitud);

    const crearSolicitudProfesional = `INSERT INTO trabajo(${setClauseKeys}) VALUES(${setClauseValues})`;

    try {
        await mysql2.query(crearSolicitudProfesional, datos);
        res.status(200).json({ message: 'El trabajo se envió exitosamente'});
    } catch (error) {
        console.error('jajajaj', error)
        res.status(500).json({ message: 'No se pudo enviar la solicitud' });
    }
 }

exports.editarSolicitudTrabajo = async(req, res) => {
    const {id_cliente, id_profesional, hora, fecha, direccion, valor, descripcion, estado}  = req.body;
    const {id} = req.params;

    if (!id_cliente && id_profesional && !hora && !fecha && !direccion && !valor && !descripcion) {
        return res.status(400).json({ message: 'Todos los campos están vacíos' });
    }

    const erroresSolicitudTrabajo = {};
    if (id_cliente && !validations.esNumerico(id_cliente)) erroresSolicitudTrabajo.formatoId_cliente = 'El id del cliente no es un valor númerico';
    if (id_profesional && !validations.esNumerico(id_profesional)) erroresSolicitudTrabajo.formatoId_profesional = 'El id del profesional no es un valor númerico';
    if (fecha && !validations.esFechaValida( new Date(fecha))) erroresSolicitudTrabajo.formatoFecha = 'Fecha no válida: por favor, ingrese una fecha correcta.';
    if (hora &&!validations.esHoraValida(hora)) erroresSolicitudTrabajo.formatoHora = 'Hora no válida: por favor, ingrese una hora válida';
    if (valor && !validations.esNumerico(valor)) erroresSolicitudTrabajo.formatoValor = 'El valor debe ser un valor númerico';

    // Verificar si hay errores
    if (Object.keys(erroresSolicitudTrabajo).length > 0) {
      return res.status(200).json(erroresSolicitudTrabajo);
    } 

    const datosSolicitud = {};
    if (id_cliente) datosSolicitud.id_cliente = id_cliente;
    if (id_profesional) datosSolicitud.id_profesional = id_profesional;
    if (fecha) datosSolicitud.fecha = fecha;
    if (hora) datosSolicitud.hora = hora;
    if (direccion) datosSolicitud.direccion = direccion;
    if (valor) datosSolicitud.valor = valor;
    if (descripcion) datosSolicitud.descripcion = descripcion;
    if (estado) datosSolicitud.estado = estado;


    if (Object.keys(datosSolicitud).length === 0) {
        return res.status(400).json({ mensaje: 'No se proporcionaron datos para actualizar.' });
    }

    // Construir la consulta SQL dinámicamente
    const setClauseKeys = Object.entries(datosSolicitud)
    .map(([key, value]) => `${key} = ?`)
    .join(', ');

    const datos = Object.values(datosSolicitud);
    datos.push(id);

    const editarSolicitudTrabajo = `UPDATE trabajo SET ${setClauseKeys} WHERE id = ?`;

    try {
        await mysql2.query(editarSolicitudTrabajo, datos);
        res.status(200).json({ message: 'La solicitud de trabajo se modificó de manera exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'No se pudo actualizar la solicitud de trabajo' });
    }
}