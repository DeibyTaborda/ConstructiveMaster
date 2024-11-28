const db = require('../db/db');
const validations = require('../validations/validations');
const mysql2 = require('../db/db-mysql2');
const {encriptarContrasena, compararContrasena} = require('../validations/generadorContrasena');

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

    // Verificar si el correo ya está en uso en las tablas profesional, super_admin, admin o cliente
    const verificarCorreoQuery = `
        SELECT correo FROM profesional WHERE correo = ?
        UNION
        SELECT correo FROM super_admin WHERE correo = ?
        UNION
        SELECT correo FROM admin WHERE correo = ?
        UNION
        SELECT correo FROM cliente WHERE correo = ?`;

    db.query(verificarCorreoQuery, [correo, correo, correo, correo], (error, results) => {
        if (error) {
            console.error('Error al verificar el correo', error);
            return res.status(500).json({ message: 'Error al verificar el correo' });
        }

        if (results.length > 0) {
            console.log('El correo ya está en uso');
            return res.status(400).json({ message: 'El correo ya está en uso' });
        }

        // Si el correo no está en uso, proceder con el registro
        const contrasenaEncriptada = encriptarContrasena(contrasena);

        db.query(registerUser, [nombre, correo, contrasenaEncriptada], (error, results) => {
            if (error) {
                console.error('Error al insertar los datos', error);
                return res.status(500).json({ message: 'Error al insertar los datos' });
            } else {
                console.log('Inserción exitosa');
                return res.status(201).json({ message: 'Usuario registrado exitosamente' });
            }
        });
    });
};

exports.seleccionarSubategorias = (req, res) => {
    const selectSubcategories = 'SELECT id, subcategoria FROM subcategoria';
    
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
        console.log('Que coño de errores');
        console.log(erroresSolicitudTrabajo)
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
        console.log('solicitud exitosa')
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

exports.crearTrabajo = async(req, res) => {
    const id_cliente = req.id;
    const {id_profesional, hora, fecha, direccion, descripcion}  = req.body;
    const valor = 7000;
    console.log(id_cliente);
    console.log(req.body);
    console.log(700)

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
        console.log('Que coño de errores');
        console.log(erroresSolicitudTrabajo)
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
        console.log('solicitud exitosa')
        res.status(200).json({ message: 'El trabajo se envió exitosamente'});
    } catch (error) {
        console.error('jajajaj', error)
        res.status(500).json({ message: 'No se pudo enviar la solicitud' });
    }
 }

exports.obtenerTrabajos = async(req, res) => {
    // const {estadoConsultaActividad} = req.query;
    const id = req.id;
    console.log(id); 

    const consultarTrabajos = 'SELECT trabajo.id, trabajo.fecha, trabajo.hora, trabajo.direccion, trabajo.descripcion, trabajo.fecha_inicio, trabajo.fecha_fin, trabajo.estado, profesional.nombre AS nombre_profesional FROM trabajo INNER JOIN profesional ON trabajo.id_profesional = profesional.id WHERE trabajo.id_cliente = ?;';
    
    try {
        const [trabajos] = await mysql2.query(consultarTrabajos, [id]);
        res.status(200).json(trabajos);
    } catch (error) {
        console.error('que error tan hijueputa', error);
        res.status(500).json({ message: 'No se pudo seleccionar los trabajos'});
    }
}

exports.obtenerProfesionales = async (req, res) => {
    const consultaObtenerProfesionales = 'SELECT profesional.id, profesional.nombre, profesional.apellido, profesional.correo, profesional.imagen, profesional.estado, profesional.descripcion, subcategoria.subcategoria AS especialidad, subcategoria.id AS id_especialidad FROM profesional JOIN subcategoria ON profesional.especialidad = subcategoria.id;';
    try {
        const [profesionales] = await mysql2.query(consultaObtenerProfesionales);
        res.status(200).json(profesionales);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar profesionales' });
    }
};