const dbMysql2 = require('../db/db-mysql2');
const validations = require('../validations/validations');
const bcrypt = require('bcryptjs');
const generadorContrasena = require('password-generator');
const {compararContrasena, encriptarContrasena} = require('../validations/generadorContrasena');
const validacion = require('../validations/validations');

exports.cambiarContrasena = async(req, res) => {
    const { contrasenaActual, nuevaContrasena } = req.body;
    const rol = req.rol;  
    const correo = req.correo;  
    const id = req.id;

    try {
        if (!rol) {
            return res.status(400).json({ message: 'El rol es inválido' });
        }

        // Validaciones de longitud y formato
        if (validacion.longitudMaxima(contrasenaActual, 20)) {
            return res.status(400).json({ message: 'La contraseña que ingresaste contiene más de 20 caracteres' });
        }

        if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            return res.status(400).json({ message: 'El correo es inválido o no ha sido proporcionado' });
        }

        if (!contrasenaActual) {
            return res.status(400).json({ message: 'La contraseña actual es requerida' });
        }

        if (validacion.longitudMaxima(contrasenaActual, 20)) {
            return res.status(400).json({ message: 'La contraseña actual contiene más de 20 caracteres' });
        }

        if (validacion.longitudMinima(contrasenaActual, 8)) {
            return res.status(400).json({ message: 'La contraseña actual debe contener al menos 8 caracteres' });
        }

        if (!nuevaContrasena) {
            return res.status(400).json({ message: 'La nueva contraseña es requerida' });
        }

        if (validacion.longitudMaxima(nuevaContrasena, 20)) {
            return res.status(400).json({ message: 'La nueva contraseña contiene más de 20 caracteres' });
        }

        if (validacion.longitudMinima(nuevaContrasena, 8)) {
            return res.status(400).json({ message: 'La nueva contraseña debe contener al menos 8 caracteres' });
        }

        const seleccionarContrasena = `SELECT contrasena FROM ${rol} WHERE correo = ?`;
        const actualizarContrasena = `UPDATE ${rol} SET contrasena = ? WHERE correo = ?`;
        const ingrsarLog = 'INSERT INTO logs_actividades(usuario_id, rol, accion, detalles) VALUES(?, ?, ?, ?)';

        // Seleccionar la contraseña actual encriptada de la base de datos
        const [contrasenaSeleccionada] = await dbMysql2.query(seleccionarContrasena, [correo]);

        if (contrasenaSeleccionada.length === 0) {
            return res.status(404).json({ message: `El ${rol} no se encontró en la base de datos` });
        }

        const contrasenaEncriptada = contrasenaSeleccionada[0].contrasena;

        // Comparar la contraseña actual ingresada con la encriptada
        const contrasenaCorrecta = compararContrasena(contrasenaActual, contrasenaEncriptada);
        if (!contrasenaCorrecta) {
            return res.status(401).json({ message: "La contraseña actual es incorrecta" });
        }

        // Validación: no permitir que la nueva contraseña sea igual a la actual
        const nuevaContrasenaIgual = compararContrasena(nuevaContrasena, contrasenaEncriptada);
        if (nuevaContrasenaIgual) {
            return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la actual' });
        }

        // Encripta la nueva contraseña
        const nuevaContrasenaEncriptada = encriptarContrasena(nuevaContrasena);

        // Actualiza la contraseña en la base de datos
        await dbMysql2.query(actualizarContrasena, [nuevaContrasenaEncriptada, correo]);
        await dbMysql2.query(ingrsarLog, [id, rol, 'Cambio de contraseña.', 'Cambiaste la contraseña.']);
        console.log('Contraseña cambiada');
        res.status(200).json({ message: 'La contraseña se cambió de manera exitosa' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'No se pudo cambiar la contraseña' });
    }
};


exports.obtenerActividad = async(req, res) => {
    const id = req.id;
    const rol = req.rol;

    const seleccionarActividad = 'SELECT accion, detalles, created_at FROM logs_actividades WHERE usuario_id = ? AND rol = ?';

    try {
        const [actividad] = await dbMysql2.query(seleccionarActividad, [id, rol]);
        res.status(200).json(actividad);
    } catch (error) {
        res.status(500).json({ message: `No se pudo seleccionar la actividad del ${rol}`});
    }
}

exports.obtenerCategorias = async(req, res) => {
    try {
        const seleccionarCategorias = 'SELECT * FROM categoria';
        const [categorias] = await dbMysql2.query(seleccionarCategorias);
        res.status(200).json(categorias)
    } catch (error) {
        res.status(500).json({ message: 'No se pudo obtener las categorías' });
    }
}

exports.obtenerSubcategorias = async(req, res) => {
    try {
        const seleccionarCategorias = 'SELECT * FROM subcategoria';
        const [subcategorias] = await dbMysql2.query(seleccionarCategorias);
        res.status(200).json(subcategorias)
    } catch (error) {
        res.status(500).json({ message: 'No se pudo obtener las subcategorías' });
    }
}

exports.profesionalesDisponibles = async(req, res) => {
    const {numeroProfesionales} = req.query;
    
    try {
        let sql = 'SELECT profesional.id, profesional.nombre, profesional.apellido, subcategoria.subcategoria AS especialidad, profesional.imagen, profesional.estado FROM profesional INNER JOIN subcategoria ON profesional.especialidad = subcategoria.id ';
        if (!numeroProfesionales) {
            sql += 'ORDER BY ID DESC LIMIT 8';
        } 

        const [profesionales] = await dbMysql2.query(sql);
        res.status(200).json(profesionales);
    } catch (error) {
        console.log(error)
        res.status(500).json('Error en el servidor');
    }
}

exports.obtenerSubcategorias = async(req, res) => {
    const {busqueda} = req.query;

    let sql = '';

    if (busqueda && busqueda === 'todos') {
        sql = 'SELECT * FROM subcategoria '
    } else if (!busqueda) {
        sql = 'SELECT * FROM subcategoria ';
    } else {
        sql = 'SELECT * FROM subcategoria WHERE subcategoria LIKE ?';
    }

    const parametros = busqueda === 'todos' ? [] : [`%${busqueda}%`];

    try {
      const [subcategorias] = await dbMysql2.query(sql, parametros);
      res.status(200).json(subcategorias);
    } catch (error) {
      res.status(400).json({ message : 'No se pudo seleccionar las subcategorías' });
    }
  }

  exports.buscarProfesional = async (req, res) => {
    const { busqueda } = req.query; 

    const sql = busqueda === 'todos' ? 'SELECT profesional.id, profesional.nombre, profesional.apellido, profesional.correo, profesional.imagen, profesional.estado, profesional.descripcion, subcategoria.subcategoria AS especialidad, subcategoria.id AS id_especialidad FROM profesional JOIN subcategoria ON profesional.especialidad = subcategoria.id;' : "SELECT profesional.id, profesional.nombre, profesional.apellido, profesional.correo, profesional.imagen, profesional.estado, subcategoria.subcategoria AS especialidad, subcategoria.id AS id_especialidad FROM profesional JOIN subcategoria ON profesional.especialidad = subcategoria.id WHERE profesional.nombre LIKE ? OR profesional.apellido LIKE ? OR subcategoria.subcategoria LIKE ?;";
    const parametros = busqueda === 'todos' ? [] : [`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`];

    try {
        const [profesionales] = await dbMysql2.query(sql, parametros);
        res.status(200).json(profesionales);
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar profesionales' });
    }
};

exports.ObtenerCamposPersonalizados = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'El id no es válido' });
    }

    const consulta = 'SELECT campos_personalizados FROM profesional WHERE id = ?';

    try {
        const [rows] = await dbMysql2.query(consulta, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron campos personalizados para este profesional' });
        }

        const camposPersonalizados = JSON.parse(rows[0].campos_personalizados);

        res.status(200).json(camposPersonalizados);
    } catch (error) {
        res.status(500).json({ message: 'No se pudo seleccionar los campos personalizados' });
    }
};

exports.obtenerImagenes = async(req, res) => {
    const {id} = req.params;
    try {
      const sql = 'SELECT id, imagen FROM imagen_profesional WHERE id_profesional = ?';
      const[imagenes] = await dbMysql2.query(sql, [id]);
      res.status(200).json(imagenes);
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

 exports.seleccionarProfesionales = async(req, res) => {
    try {
        const sql = 'SELECT profesional.id, profesional.nombre, profesional.apellido, profesional.especialidad AS id_especialidad, subcategoria.subcategoria AS especialidad, profesional.estado, profesional.correo, profesional.telefono, profesional.curriculum, profesional.imagen, profesional.campos_personalizados, profesional.descripcion FROM profesional INNER JOIN subcategoria ON profesional.especialidad = subcategoria.id';
        const [profesionales] = await dbMysql2.query(sql);
        res.status(200).json(profesionales);
    } catch (error) {
        res.status(500).json({message: 'Error en el servidor'});
    }
 }

 exports.obtenerProfesional = async (req, res) => {
    const { especialidad, excluidoId } = req.body;
    console.log(especialidad);
    console.log(excluidoId);

    if (!especialidad) {
        return res.status(400).json({ message: 'Especialidad requerida' });
    }

    const excludedIds = Array.isArray(excluidoId) && excluidoId.length > 0 ? excluidoId : [0];
    const placeholders = excludedIds.map(() => '?').join(',');

    const query = `
        SELECT profesional.id, profesional.nombre, profesional.apellido, subcategoria.subcategoria AS especialidad, profesional.correo, 
        profesional.telefono, profesional.descripcion, profesional.curriculum, profesional.created_at, profesional.estado
        FROM profesional INNER JOIN subcategoria ON profesional.especialidad = subcategoria.id
        WHERE profesional.especialidad = ? AND profesional.estado = 'Disponible' AND profesional.id NOT IN (${placeholders})
        LIMIT 1;
    `;

    try {
        const [profesional] = await dbMysql2.query(query, [especialidad, ...excludedIds]);

        if (profesional.length === 0) {
            return res.status(200).json({ message: 'No hay más profesionales disponibles' });
        }

        res.status(200).json({ profesional });
    } catch (error) {
        console.error('No se obtuvo el profesional', error);
        res.status(500).json({ error: 'Error en la consulta' });
    }
};

exports.solicitudProfesional = async (req, res) => {
    try {
        const { nombre, apellido, especialidad, correo, telefono } = req.body;
        const curriculum = req.file ? req.file.originalname : null;
        const curriculumFile = req.file ? req.file.path : null;

        const solicitudProfesional = 'INSERT INTO solicitud(nombre, apellido, especialidad, correo, telefono, curriculum) VALUES(?, ?, ?, ?, ?, ?)';
        const consultarCorreoUsuarios = [
            'SELECT correo FROM super_admin WHERE correo = ?',
            'SELECT correo FROM admin WHERE correo = ?',
            'SELECT correo FROM cliente WHERE correo = ?',
            'SELECT correo FROM profesional WHERE correo = ?'
        ];

        // Validaciones de campos
        if (!nombre || !apellido || !especialidad || !correo || !telefono) {
            return res.status(400).json({ message: 'Los campos no están completos' });
        }

        if (!curriculum) {
            return res.status(400).json({ message: 'La hoja de vida es obligatoria. Por favor, adjunte el archivo.' });
        }

        const nombreValidado = validations.validarNombre(nombre);
        if (nombreValidado) return res.status(400).json({ message: nombreValidado });

        const apellidoValidado = validations.validarNombre(apellido);
        if (apellidoValidado) return res.status(400).json({ message: apellidoValidado });

        const correoValidado = validations.validarCorreo(correo);
        if (correoValidado) return res.status(400).json({ message: correoValidado });

        const telefonoValidado = validations.validarTelefono(telefono);
        if (telefonoValidado) return res.status(400).json({ message: telefonoValidado });

        const fileValidado = validations.validarFile(curriculum);
        if (fileValidado) return res.status(400).json({ message: fileValidado });

        // Verificar que el correo no esté en uso en ninguna de las tablas
        for (let consulta of consultarCorreoUsuarios) {
            const [rows] = await dbMysql2.query(consulta, [correo]);
            if (rows.length > 0) {
                return res.status(409).json({ message: 'El correo ya está en uso' });
            }
        }

        await dbMysql2.query(solicitudProfesional, [nombre, apellido, especialidad, correo, telefono, curriculumFile]);
        return res.status(200).json({ message: 'Solicitud registrada exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el proceso. Inténtelo de nuevo más tarde.' });
    }
};

exports.obtenerImgUsuario = async(req, res) => {
    const rol = req.rol;
    const id = req.id;

    try {
        const sql = `SELECT imagen FROM ${rol} WHERE id = ${id}`;
        const [imagen] = await dbMysql2.query(sql);
        res.status(200).json(imagen);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor'});
    }
}

exports.cancelarTrabajo = async(req, res) => {
    const { idTrabajo } = req.params; 
    const id = req.id;
    const rol = req.rol;
    
    console.log(id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID de trabajo inválido' });
    }
  
    try {
      const [resultado] = await dbMysql2.query('UPDATE trabajo SET estado = ? WHERE id = ?', ['cancelado', idTrabajo]);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Trabajo no encontrado' });
      }
      await dbMysql2.query('INSERT INTO logs_actividades(usuario_id, rol, accion, detalles) VALUES(?, ?, ?, ?)', [id, rol, 'Cancelación de solicitud de trabajo', 'Cancelaste una solicitud de trabajo']);
      console.log('solicitud exitosa');
      res.status(200).json({ message: 'Trabajo cancelado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor' });
    }
}

exports.confirmarTrabajo = async(req, res) => {
    const { idTrabajo } = req.params; 
    const id = req.id;
    const rol = req.rol;
    
    console.log(id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID de trabajo inválido' });
    }
  
    try {
      const [resultado] = await dbMysql2.query('UPDATE trabajo SET estado = ? WHERE id = ?', ['confirmado', idTrabajo]);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Trabajo no encontrado' });
      }
      await dbMysql2.query('INSERT INTO logs_actividades(usuario_id, rol, accion, detalles) VALUES(?, ?, ?, ?)', [id, rol, 'Confirmación de trabajo', 'Confirmaste una solicitud de trabajo']);
      console.log('solicitud exitosa');
      res.status(200).json({ message: 'Trabajo confirmado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor' });
    }
}

exports.seleccionarClientesActivos = async(req, res) => {
    try {
        const sql = 'SELECT id, nombre FROM cliente WHERE estado = "activo"';
        const [clientes] = await dbMysql2.query(sql);
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor'});
    }
}
exports.actualizarContrato = async (req, res) => {
    const { fecha_firma, fecha_inicio, fecha_fin, valor_total, forma_pago, estado_pago } = req.body;
    const { id } = req.params;

    console.log(req.body);
    console.log(id);

    const datos = {};
    if (fecha_firma) datos.fecha_firma = fecha_firma;
    if (fecha_inicio) datos.fecha_inicio = fecha_inicio;
    if (fecha_fin) datos.fecha_fin = fecha_fin;  // Corrección aquí
    if (valor_total) datos.valor_total = valor_total;
    if (forma_pago) datos.forma_pago = forma_pago;
    if (estado_pago) datos.estado_pago = estado_pago;

    if (Object.values(datos).length === 0) {
        return res.status(400).json({ message: 'No hay datos para actualizar' });
    }

    const keys = Object.keys(datos).map(key => {
        return `${key} = ?`;
    });

    const consulta = keys.join(', ');  // Añadir coma entre las claves
    const values = Object.values(datos);
    values.push(id);

    try {
        const sql = `UPDATE contrato SET ${consulta} WHERE id = ?`;
        await dbMysql2.query(sql, values);  // Eliminar el array adicional
        res.status(200).json({ message: 'La actualización se realizó de manera exitosa' });
    } catch (error) {
        console.error('hay un error', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}
