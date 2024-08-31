const db = require('../db/db');
const dbMysql2 = require('../db/db-mysql2');
const validations = require('../validations/validations');

exports.subirTable = async(req, res) => {
    const {tabla, ruta }= req.body;
    const rutaImagenTabla = req?.file?.path || null;
    const rol = req.rol;

    if (!rol) return res.status(400).json({ message: 'No autorizado. El rol no ha sido proporcionado.' });
    if (rol === 'admin') return res.status(403).json({ message: 'Acceso denegado. No tienes autorización para realizar esta acción.' });
  

    if (!tabla && ruta) {
        return res.status(400).json('El nombre de la tabla y la ruta es obligatorio');
    } else if (!tabla) {
        return res.status(400).json({ message: 'El nombre de la tabla es obligatorio'});
    } else if (!ruta) {
        return res.status(400).json({ message: 'La ruta es obligatoria' })
    }

    if (validations.validarSoloLetras(tabla)) {
        return res.status(400).json({ message: 'No se permiten números ni caracteres especiales'});
    }

    if (validations.validarLongitud(tabla, 30)) {
        return res.status(400).json({ message: 'No se permiten más de 30 caracteres'});
    }

    if (validations.validarLongitud(ruta, 30)) {
        return res.status(400).json({ message: 'La ruta no permite más de 30 caracteres' })
    }

    try {
        const sqlImagenTabla = 'INSERT INTO imagenTabla(nombre_tabla, url_tabla, imagen_tabla) VALUES(?, ?, ?)';
        const results = await db.query(sqlImagenTabla, [tabla, ruta,rutaImagenTabla]);
        return res.status(200).json({ message: 'La tabla se creó exitosamente'});
    } catch (error) {
        return res.status(500).json({ message: 'Error interno. Por favor, inténtalo más tarde'});
    }
}


exports.obtenerTablas = async (req, res) => {
    const {rol, id} = req.rol;

    const sqlTablas = 'SELECT * FROM imagentabla';
    const seleccionarDatosAdmin = 'SELECT nombre, apellido, correo, telefono, imagen FROM admin  WHERE id = ?' ;
    const seleccionarDatosSuperadmin = 'SELECT nombre, correo, telefono, imagen FROM admin  WHERE id = ?';
    const seleccionarDatos = rol === 'admin' ? seleccionarDatosAdmin : seleccionarDatosSuperadmin;

    try {
        const [results] = await dbMysql2.query(sqlTablas);
        const [results2] = await dbMysql2.query(seleccionarDatos, [id]);
        return res.status(200).json({data: results, datauser: results2});
    } catch (error) {
        console.error('Error al obtener las tablas:', error);
        return res.status(500).json({ message: 'Error interno. Por favor, inténtalo más tarde'})
    }
}

exports.eliminarTabla = async(req, res) => {
    const {id} = req.params;
    const sqleliminarTabla = 'DELETE FROM imagenTabla WHERE id = ?';
    const rol = req.rol;

    if (!rol) return res.status(400).json({ message: 'No autorizado. El rol no ha sido proporcionado.' });
    if (rol === 'admin') return res.status(403).json({ message: 'Acceso denegado. No tienes autorización para realizar esta acción.' });

    if (!id) {
        console.log('No se especificó el idientificador de la tabla');
        return res.status(400).json({ message: 'No se especificó el idientificador de la tabla'});
    }

    try {
        const results = await dbMysql2.query(sqleliminarTabla, [id]);
        console.log('La tabla se eliminió exitosamente');
        return res.status(200).json({ message: 'La tabla se eliminó exitosamente' });
    } catch (error) {
        console.error('La tabla no se eliminó');
        return res.status(500).json({ message: 'La tabla no se eliminó. Por favor, inténtalo más tarde' });
    }
}

exports.actulizarTabla = async(req, res) => {
    const {id} = req.params;
    const {tabla, ruta} = req.body;
    const imagen = req?.file?.path || null;
    const rol = req.rol;

    const seleccionarImagenTabla = 'SELECT imagen_tabla FROM imagentabla WHERE id = ?';
    const sqlActulazarTabla = 'UPDATE imagentabla SET nombre_tabla = ?, url_tabla = ?, imagen_tabla = ? WHERE id = ?';

    
    if (!rol) return res.status(400).json({ message: 'No autorizado. El rol no ha sido proporcionado.' });
    if (rol === 'admin') return res.status(403).json({ message: 'Acceso denegado. No tienes autorización para realizar esta acción.' });

    console.log(id);
    console.log(tabla);
    console.log(ruta);
    console.log(imagen);

    if (!id) {
        return res.status(400).json({ message: 'No se específico la tabla ha actualizar' });
    }

    if (validations.validarLongitud(30)) {
        return res.status(400).json({ message: 'No se permiten más de 30 caracteres'});
    }

    try {
        const [resultado] = await dbMysql2.query(seleccionarImagenTabla, [id]);
        const imagenNueva = imagen || resultado[0].imagen_tabla
        const results =  await dbMysql2.query(sqlActulazarTabla, [tabla, ruta, imagenNueva, id]);
        return res.status(200).json({ message: 'La tabla se actulizó exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'La tabla no se actualizó. Inténtalo más tarde' });
    }
}

exports.obtenerDatosAdmin = async(req, res) => {
    const correo = req.correo;
    const id = req.id;
    const rol = req.rol;
    const sqlObtenerDatosAdmin = 'SELECT * FROM admin WHERE id = ?';
    const sqlObtenerDatosSuperadmin = 'SELECT * FROM super_admin WHERE id = ?';

    try {
        const consulta = rol === 'admin' ? sqlObtenerDatosAdmin : sqlObtenerDatosSuperadmin;
        const [results] = await dbMysql2.query(consulta, [id]);
        console.log(results[0]);
        res.status(200).json(results);
    } catch (error) {
        console.error('error interno', error);
        res.status(500).json({ message: 'Error interno. Por favor, inténtalo más tarde' })
    }
}

exports.subirImagenAdmin = async (req, res) => {
    const rol = req.rol;
    const id = req.id;
    const imagen = req.file ? req.file.path : null;

    if (!imagen) {
        return res.status(400).json({ message: 'No se ha proporcionado ninguna imagen.' });
    }

    const updateImagenAdmin = 'UPDATE admin SET imagen = ? WHERE id = ?';
    const updateImagenSuperadmin = 'UPDATE super_admin SET imagen = ? WHERE id = ?';

    const seleccionarImagenAdmin = 'SELECT imagen FROM admin WHERE id = ?';
    const seleccionarImagenSuperAdmin = 'SELECT imagen FROM super_admin WHERE id = ?';

    const seleccionarImagen = rol === 'admin' ? seleccionarImagenAdmin : seleccionarImagenSuperAdmin; 
    const updataImagen = rol === 'admin' ? updateImagenAdmin : updateImagenSuperadmin;

    try {
        // Primero, verificamos si existe un registro con el ID proporcionado
        const [results] = await dbMysql2.query(seleccionarImagen, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontró el usuario con el ID proporcionado.' });
        }

        // Actualizamos la imagen
        await dbMysql2.query(updataImagen, [imagen, id]);

        // Volvemos a consultar la imagen actualizada
        const [resultadoImagen] = await dbMysql2.query(seleccionarImagen, [id]);
        console.log(resultadoImagen[0].imagen);
        // Enviamos la respuesta con la imagen actualizada
        return res.status(200).json({
            message: 'La imagen se subió exitosamente',
            imagenActualizada: resultadoImagen[0].imagen, 
        });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al subir la imagen. Por favor, intenta más tarde o contacta al administrador.',
        });
    }
};


exports.eliminarImagenAdmin = async(req, res) => {
    const {id} = req.params;
    const rol = req.rol;
    const actualizarImagenAdmin = 'UPDATE admin SET imagen = ? WHERE id = ?';
    const actualizarImagenSuperadmin = 'UPDATE super_admin SET imagen = ? WHERE id = ?';
    const actualizarImagen = rol === 'admin' ? actualizarImagenAdmin : actualizarImagenSuperadmin;
    const seleccionarImagenAdmin = 'SELECT imagen FROM admin WHERE id = ?';
    const seleccionarImagenSuperadmin = 'SELECT imagen FROM super_admin WHERE id = ?';
    const seleccionarImagen = rol === 'admin' ? seleccionarImagenAdmin : seleccionarImagenSuperadmin;

    try {
        await dbMysql2.query(actualizarImagen, [null, id]);
        const [results] = await dbMysql2.query(seleccionarImagen, [id]);
        console.log(results[0]);
        return res.status(200).json({ message: 'La imagen se eliminó exitosamente', resultado: results[0]});
    } catch (error) {
        console.error('La imagen no se eliminó', error)
        return res.status(500).json({ message: 'Ocurrió un error al subir la imagen. Por favor, intenta más tarde'});
    }
}

exports.actualizarRegistro = async (req, res) => {
    try {
        const { id } = req.params; // Supongamos que pasas el ID del registro en la URL
        const rol = req.rol;
        const { nombre, apellido, correo, telefono } = req.body;
  
        // Validar que el ID sea válido
        if (!id) {
        return res.status(400).json({ mensaje: 'ID inválido.' });
        }
  
        // Crear un objeto con solo los campos que no son undefined
        const camposAActualizar = {};
        if (nombre) camposAActualizar.nombre = nombre;
        if (apellido) camposAActualizar.apellido = apellido;
        if (correo) camposAActualizar.correo = correo;
        if (telefono) camposAActualizar.telefono = telefono;
    
        // Verificar si hay algo que actualizar
        if (Object.keys(camposAActualizar).length === 0) {
            return res.status(400).json({ mensaje: 'No se proporcionaron datos para actualizar.' });
        }
    
        // Construir la consulta SQL dinámicamente
        const setClause = Object.entries(camposAActualizar)
            .map(([key, value]) => `${key} = ?`)
            .join(', ');
    
        const values = Object.values(camposAActualizar);
    
        const sql = `UPDATE admin SET ${setClause} WHERE id = ?`;
        const sql2 = `UPDATE super_admin SET ${setClause} WHERE id = ?`; 
        const actualizarRegistro = rol === 'admin' ? sql : sql2;

        values.push(id); // Añadir el ID al final de los valores
    
        // Ejecutar la consulta
        db.query(actualizarRegistro, values, (error, result) => {
            if (error) {
            console.error(error);
            return res.status(500).json({ mensaje: 'Error al actualizar el registro.' });
            }
            return res.status(200).json({ mensaje: 'Registro actualizado correctamente.' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  };

 
  exports.agregarAdmin = async (req, res) => {
    const { nombre, apellido, correo } = req.body;

    if (!nombre || !apellido || !correo) {
        return res.status(400).json({ message: 'Datos incompletos. Todos los campos son obligatorios.' });
    }

    const nombreValidado = validations.validarNumerosYSimbolos(nombre);
    const apellidoValidado = validations.validarNumerosYSimbolos(apellido);
    const correoValidado = validations.validarCorreo(correo);

    if (nombreValidado && apellidoValidado) {
        return res.status(400).json({ message: 'Los campos nombre y apellido no deben contener números ni caracteres especiales' });
    } else if (nombreValidado) {
        return res.status(400).json({ message: 'El campo nombre no debe contener números ni caracteres especiales' });
    } else if (apellidoValidado) {
        return res.status(400).json({ message: 'El apellido no debe contener números ni caracteres especiales' });
    }

    if (correoValidado) {
        return res.status(400).json({ message: correoValidado })
    }

    const consultarCorreoUsuarios = [
        'SELECT correo FROM super_admin WHERE correo = ?',
        'SELECT correo FROM admin WHERE correo = ?',
        'SELECT correo FROM cliente WHERE correo = ?',
        'SELECT correo FROM profesional WHERE correo = ?'
    ];

    try {
        // Verificar si el correo ya existe en alguna tabla
        for (let consulta of consultarCorreoUsuarios) {
            const [resultado] = await dbMysql2.query(consulta, [correo]);
            if (resultado.length > 0) {
                return res.status(409).json({ message: 'El correo ya está en uso.' });
            }
        }

        // Insertar nuevo administrador si el correo no está en uso
        const agregarAdmin = 'INSERT INTO admin(nombre, apellido, correo) VALUES(?, ?, ?)';
        const [result] = await dbMysql2.query(agregarAdmin, [nombre, apellido, correo]);

        res.status(201).json({ message: 'Se agregó un nuevo administrador', id: result.id });
    } catch (error) {
        console.error('Error interno del servidor:', error);
        res.status(500).json({ message: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde' });
    }
}
