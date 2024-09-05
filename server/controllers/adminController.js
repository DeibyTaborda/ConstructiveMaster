const db = require('../db/db');
const dbMysql2 = require('../db/db-mysql2');
const validations = require('../validations/validations');
const bcrypt = require('bcryptjs');
const generadorContrasena = require('password-generator');

// Controlador para obtener todos los clientes
exports.getClientes = (req, res) => {
  const getCliente = 'SELECT * FROM cliente ';

  db.query(getCliente, (error, results) => {
    if (error) {
      console.error('Los clientes no se seleccionaron', error);
      return res.status(500).json({ message: 'Los clientes no se seleccionaron' });
    } else {
      console.log('Los clientes se seleccionaron de manera exitosa');
      return res.status(200).json(results);
    }
  })
}

//Controlador para registrar una categoría o subcategoría
exports.registerCategory = (req, res) => {
  const { categoria, subcategoria, id_categoria } = req.body;
  console.log(id_categoria);
  const id_categoriaNumber = Number(id_categoria);
  const regexNombre = /\d+/;

  // Acceso a los archivos subidos
  const categoriaFile = req.files['imagenCategoria'] ? req.files['imagenCategoria'][0] : null;
  const subcategoriaFile = req.files['imagenSubcategoria'] ? req.files['imagenSubcategoria'][0] : null;

  // Rutas de los archivos
  const categoriaImagePath = categoriaFile ? categoriaFile.path : null;
  const subcategoriaImagePath = subcategoriaFile ? subcategoriaFile.path : null;

  // SQL queries
  const categoryRegister = 'INSERT INTO categoria(categoria, img_categoria) VALUES(?, ?)';
  const subcategoryRegister = 'INSERT INTO subcategoria(subcategoria, id_categoria, img_subcategoria) VALUES(?, ?, ?)';
  const categoryExists = 'SELECT categoria FROM categoria WHERE categoria = ?';
  const subcategoryExists = 'SELECT subcategoria FROM subcategoria WHERE subcategoria = ?';

  if (!categoria && !subcategoria) {
    console.log('Los campos están vacíos');
    return res.status(400).json({ message: 'Los campos están vacíos' });
  }

  const validacionCategoria = (value) => {
    if (regexNombre.test(value)) { // Si se encuentran números
      console.log('No se permiten números');
      return true; // Indica que la validación ha fallado
    }
    return false; // Validación exitosa
  };

  // Validar 'categoria' y 'subcategoria'
  if (categoria && validacionCategoria(categoria)) {
    return res.status(400).json({ message: 'No se permiten números en la categoría' });
  }

  if (subcategoria && validacionCategoria(subcategoria)) {
    return res.status(400).json({ message: 'No se permiten números en la subcategoría' });
  }

  if (categoria && categoria.length > 30) {
    console.log('No se admite más de 30 caracteres en el campo de categoría');
    return res.status(400).json({ message: 'No se admiten más de 30 caracteres en el campo de categoría' });
  }

  if (subcategoria && subcategoria.length > 30) {
    console.log('No se admite más de 30 caracteres en el campo de subcategoría');
    return res.status(400).json({ message: 'No se admiten más de 30 caracteres en el campo de subcategoría' });
  }

  if (categoria) {
    db.query(categoryExists, [categoria], (error, results) => {
      if (error) {
        console.error(`Error al verificar la categoría ${categoria}:`, error);
        return res.status(500).json({ message: `Error al verificar la categoría ${categoria}` });
      }

      if (results.length > 0) {
        console.log(`La categoría ${categoria} ya existe`);
        return res.status(400).json({ message: `La categoría ${categoria} ya existe` });
      } else {
        db.query(categoryRegister, [categoria, categoriaImagePath], (error, results) => {
          if (error) {
            console.error('La categoría no se registró', error);
            return res.status(500).json({ message: 'La categoría no se registró' });
          } else {
            console.log(`La categoría ${categoria} ha sido registrada`);
            return res.status(200).json({ message: `La categoría ${categoria} ha sido registrada` });
          }
        });
      }
    });
  }

  if (subcategoria) {
    db.query(subcategoryExists, [subcategoria], (error, results) => {
      if (error) {
        console.error(`Error al verificar la subcategoría ${subcategoria}:`, error)
        return res.status(500).json({ message: `Error al verificar la subcategoría ${subcategoria}` });
      }

      if (results.length > 0) {
        console.log(`La subcategoría ${subcategoria} ya existe`);
        return res.status(400).json({ message: `La subcategoría ${subcategoria} ya existe` });
      } else {
        db.query(subcategoryRegister, [subcategoria, id_categoriaNumber, subcategoriaImagePath], (error, results) => {
          if (error) {
            console.error('La subcategoría no se registró', error);
            return res.status(500).json({ message: 'La subcategoría no se registró' });
          } else {
            console.log(`La subcategoría ${subcategoria} ha sido registrada`);
            return res.status(200).json({ message: `La subcategoría ${subcategoria} ha sido registrada` });
          }
        });
      }
    })
  }
};


// Controlador que permite obtener todas las categorías y subcategorías.
exports.getCategory = (req, res) => {
  // Consultas SQL para obtener categorías y subcategorías
  const categoryGet = 'SELECT * FROM categoria';
  const subCategoryGet = 'SELECT * FROM subcategoria';

  // Ejecutar la consulta para obtener las categorías
  db.query(categoryGet, (error, results1) => {
    if (error) {
      console.error('Error al obtener las categorías:', error);
      return res.status(500).json({ message: 'Error al obtener las categorías' });
    }

    // Ejecutar la consulta para obtener las subcategorías
    db.query(subCategoryGet, (error, results2) => {
      if (error) {
        console.error('Error al obtener las subcategorías:', error);
        return res.status(500).json({ message: 'Error al obtener las subcategorías' });
      }

      // Si no hay errores, enviar una respuesta exitosa con los resultados
      console.log('Categorías y subcategorías obtenidas exitosamente', results1, results2);
      return res.status(200).json({ categories: results1, subcategories: results2 });
    });
  });
};

// Controlador que permite eliminar una catetoría o subcategoría.
exports.deleteCategory = (req, res) => {
  const { tableId, Id } = req.params;
  const deleteCategory = `DELETE FROM ${tableId} WHERE id = ?`;

  if (!tableId || !Id) {
    console.log('No seleccionaste una categoria o ID');
    return res.status(400).json({ message: 'No seleccionaste una categoría o ID' });
  }

  const allowedTables = ['categoria', 'subcategoria'];
  if (!allowedTables.includes(tableId)) {
    return res.status(400).json({ message: 'Tabla no permitida' });
  }

  if (tableId) {
    db.query(deleteCategory, [Id], (error, results) => {
      if (error) {
        console.error(`Error en eliminar la ${tableId}`)
      }
    });
    console.log(`Categoria con ID ${Id} en la tabla ${tableId} eliminada`);
    return res.status(200).json({ message: 'Categoría eliminada exitosamente' });
  }
}

exports.getSolicitudProfesional = (req, res) => {
  const solicitudProfesional = 'SELECT * FROM solicitud';

  db.query(solicitudProfesional, (error, results) => {
    if (error) {
      console.log('Error en seleccionar las solicitudes', error.message);
      return res.status(500).json({ message: 'Error en seleccionar las solicitudes' });
    }

    console.log('Las solicitudes se seleccionaron exitosamente');
    console.log(results);
    return res.status(200).json(results);
  })
}

exports.categoryPut = (req, res) => {
  const { categoria } = req.body;
  const { tabla, id } = req.params;
  const imgCategoria = req.file ? req.file.path : null;
  const originalnameImg = req.file?.originalname;

  if (!categoria) {
    console.log(`El campo ${tabla} esta vacío`);
    return res.status(400).json({ message: `El campo ${tabla} es obligatorio` });
  }

  const longitudCategoria = validations.validarCategoria(categoria);

  if (longitudCategoria) {
    console.log(longitudCategoria);
    return res.status(400).json({ message: longitudCategoria });
  }

  if (imgCategoria && !validations.validarImagen(originalnameImg)) {
    console.log('El usuario a ingresado un archivo con un formato no válido');
    return res.status(400).json({ message: 'Por favor, ingrese un archivo válido (formatos permitidos: .jpg, .jpeg, .png, .gif, .bmp)' });
  }


  if (tabla === 'categoria') {
    const sqlExisCategoria = 'SELECT categoria FROM categoria';

    db.query(sqlExisCategoria, (error, results) => {
      if (error) {
        console.error('Error en obtener la categoría para comprobar si existe', error);
        return res.status(500).json({ message: 'Error en obtener la subcategoría' });
      } 

      console.log(results);

      // const categoriaBuscada = results.find(category => category.categoria === categoria );

      // if (categoriaBuscada) {
      //   console.error(`La categoría ${categoria} ya existe`, error);
      //   return res.status(409).json({ message: `La categoría ${categoria} ya existe` })
      // }

      const sqlObtenerImgCategoria = 'SELECT img_categoria FROM categoria WHERE id = ?';

      db.query(sqlObtenerImgCategoria, [id], (error, results) => {
        if (error) {
          console.error(`Error al obtener la ${tabla} ${categoria}`, error);
          return res.status(500).json({ message: `Error al obtener la ${tabla} ${categoria}`, error })
        }
  
        const imagenActual = results[0].img_categoria;
        const nuevaImgCategoria = imgCategoria || imagenActual;
  
        const sqlCategoria = 'UPDATE categoria SET categoria = ?, img_categoria = ? WHERE id = ?';
        db.query(sqlCategoria, [categoria, nuevaImgCategoria, id], (error, results) => {
          if (error) {
            console.error(`Error en actualizar la ${tabla} ${categoria} `, error);
            return res.status(500).json({ message: `Error en actualizar la ${tabla} ${categoria} ` });
          } else {
            console.log(`La ${tabla} ${categoria} se actualizó exitosamente`);
            return res.status(200).json({ message: `La ${tabla} ${categoria} se actualizó exitosamente` });
          }
        });
      });
    })
  }

  if (tabla === 'subcategoria') {
    const sqlExisSubcategoria = 'SELECT subcategoria FROM subcategoria';

    db.query(sqlExisSubcategoria, [categoria], (error, results) => {
      if (error) {
        console.error('Error en obtener la subcategoría para comprobar si existe', error);
        return res.status(500).json({ message: 'Error en obtener la subcategoría' });
      }

      // const subcategoriaBuscada = results.find(subcategoria => subcategoria.subcategoria === categoria);

      // if (subcategoriaBuscada) {
      //   console.error(`La subcategoría ${categoria} ya existe`, error);
      //   return res.status(409).json({ message: `La subcategoría ${categoria} ya existe` });
      // }

      const sqlObtenerImgSubcategoria = 'SELECT img_subcategoria FROM subcategoria WHERE id = ?';

      db.query(sqlObtenerImgSubcategoria, [id], (error, results) => {
        if (error) {
          console.error('Error en obtener la imagen de la subcategoría', error);
          return res.status(500).json({ message: 'Ocurrio un error interno. Por favor, inténtalo más tarde' });
        }
  
        const imagenActual = results[0].img_subcategoria;
        const imagenNuevaSubcategoria = imgCategoria || imagenActual;
  
        const sqlSubcategoria = 'UPDATE subcategoria SET subcategoria = ?, img_subcategoria = ? WHERE id = ?';
        db.query(sqlSubcategoria, [categoria, imagenNuevaSubcategoria, id], (error, results) => {
          if (error) {
            console.error(`Error en actualizar la subcategoría ${categoria}`, error);
            return res.status(500).json({ message: `Error en actualizar la subcategoría ${categoria}` });
          }
  
          console.log(`La subcategoría se actualizó exitosamente`);
          return res.status(200).json({ message: `Error en actualizar la subcategoría. Por favor, intenta más tarde` });
        })
  
      })

    })
  }
}
 
exports.eliminarCliente = async(req, res) => {
  const {id} = req.params;
  const eliminarCliente = 'DELETE FROM cliente WHERE id = ?';

  if (!id) { 
    return res.status(400).json({ message: 'Por favor, verifica el ID ingresado y vuelve a intentarlo.'});
  }

  try {
    await dbMysql2.query(eliminarCliente, [id]);
    res.status(200).json({ message: 'El cliente se eliminó exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo eliminar el cliente' });
  }

}

exports.actualizarCliente = async(req, res) => {
  const {id} = req.params;
  const {nombre, correo, telefono, direccion} = req.body;
  const imagen = req.file?.path || null;
  console.log(nombre);

  const errores = [];

  // Validar nombre
  if (validations.validarNumerosYSimbolos(nombre)) {
    errores.push('El nombre no debe contener números ni caracteres especiales');
  } else if (validations.validarLongitud(nombre, 30)) {
    errores.push('El nombre no debe contener más de 30 caracteres');
  }
  
  // Validar correo
  if (validations.validarCorreo(correo)) {
    errores.push('Por favor, ingrese un correo válido');
  } else if (validations.validarLongitud(correo, 100)) {
    errores.push('El correo no debe contener más de 100 caracteres');
  }
  
  // Validar teléfono
  if (!validations.validarNumeroTelefonico(telefono)) {
    errores.push('Número telefónico inválido. Usa 7 dígitos (fijo) o 10 dígitos (celular).');
  }
  
  // Validar dirección
  if (validations.validarLongitud(direccion, 30)) {
    errores.push('La dirección no debe contener más de 30 caracteres');
  }
  
  // Validar imagen
  if (imagen && !validations.validarImagen(imagen)) {
    errores.push('Tipo de archivo no permitido');
  }
  
  // Si hay errores, enviarlos
  if (errores.length > 0) {
    return res.status(400).json({ message: errores });
  }

  const camposActualizar = {};
  if (nombre) camposActualizar.nombre = nombre;
  if (correo) camposActualizar.correo = correo;
  if (telefono) camposActualizar.telefono = telefono;
  if (direccion) camposActualizar.direccion = direccion;
  if (imagen) camposActualizar.imagen = imagen

  if (Object.keys(camposActualizar).length === 0) {
    return res.status(200).json({ message: 'No se proporcionaron datos para actualizar.' })
  }

  const clausulaClienteSql = Object.entries(camposActualizar)
  .map(([key, value]) => `${key} = ?`)
  .join(', ');

  const values = Object.values(camposActualizar);

  values.push(id);

  const clienteActulizarSql = `UPDATE cliente SET ${clausulaClienteSql} WHERE id = ?`

  try {
    await dbMysql2.query(clienteActulizarSql, values);
    res.status(200).json({ message: 'Se actulizaron los datos del cliente exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo actulizar los datos del cliente' });
  }

}

exports.agregarCliente = async(req, res) => {
  const {nombre, correo, telefono, direccion} = req.body;
  const imagen = req.file?.path || null;
  console.log(nombre);
  console.log(correo);
  const errores = [];

  // Validar nombre
  if (validations.validarNumerosYSimbolos(nombre)) {
    errores.push('El nombre no debe contener números ni caracteres especiales');
  } else if (validations.validarLongitud(nombre, 30)) {
    errores.push('El nombre no debe contener más de 30 caracteres');
  }
  
  // Validar correo
  if (validations.validarCorreo(correo)) {
    errores.push('Por favor, ingrese un correo válido');
  } else if (validations.validarLongitud(correo, 100)) {
    errores.push('El correo no debe contener más de 100 caracteres');
  }
  
  // Validar teléfono
  if (telefono && !validations.validarNumeroTelefonico(telefono)) {
    errores.push('Número telefónico inválido. Usa 7 dígitos (fijo) o 10 dígitos (celular).');
  }
  
  // Validar dirección
  if (validations.validarLongitud(direccion, 30)) {
    errores.push('La dirección no debe contener más de 30 caracteres');
  }
  
  // Validar imagen
  if (imagen && !validations.validarImagen(imagen)) {
    errores.push('Tipo de archivo no permitido');
  }
  
  // Si hay errores, enviarlos
  if (errores.length > 0) {
    console.log(errores);
    return res.status(400).json({ message: errores });
  }
  
  const consultarCorreoUsuarios = [
    'SELECT correo FROM super_admin WHERE correo = ?',
    'SELECT correo FROM admin WHERE correo = ?',
    'SELECT correo FROM cliente WHERE correo = ?',
    'SELECT correo FROM profesional WHERE correo = ?'
];

  //generar una contraseña de manera automática
  const contrasena = generadorContrasena(12, false);
  console.log('Contraseña Generada:', contrasena);

  // Encriptar la contraseña
  const sal = bcrypt.genSaltSync(10);
  const contrasenaEncriptada = bcrypt.hashSync(contrasena, sal);
  console.log('Contraseña Encriptada:', contrasenaEncriptada);
  

  const camposAgregar = {};
  if (nombre) camposAgregar.nombre = nombre;
  if (correo) camposAgregar.correo = correo;
  if (telefono) camposAgregar.telefono = telefono;
  if (direccion) camposAgregar.direccion = direccion;
  if (imagen) camposAgregar.imagen = imagen
  if (contrasenaEncriptada) camposAgregar.contrasena = contrasenaEncriptada;

  if (Object.keys(camposAgregar).length === 0) {
    return res.status(200).json({ message: 'No se proporcionaron datos para actualizar.' })
  }

  const clausulaClienteSql = Object.entries(camposAgregar)
  .map(([key, value]) => `${key}`)
  .join(', ');

  const valores = Object.values(camposAgregar)
  .map(valor => `'${valor}'`)
  .join(', ');;

  const agregarClienteSql = `INSERT INTO cliente(${clausulaClienteSql}) VALUES(${valores})`;

  try {
    for (let consulta of consultarCorreoUsuarios) {
      const [resultado] = await dbMysql2.query(consulta, [correo]);
      if (resultado.length > 0) {
        console.log('el correo ya esta en uso')
          return res.status(409).json({ message: 'El correo ya está en uso.' });
      }
    }
    await dbMysql2.query(agregarClienteSql, valores);
    console.log('Se registro correctamente el cliente');
    res.status(200).json({ message: 'EL cliente se registro exitosamente' });
  } catch (error) {
    console.error('No se puedo registrar el cliente', error);
    res.status(500).json({ message: 'No se pudo registrar el cliente. Por favor, intentar más tarde' });
  }
}

exports.incorporarProfesional = async(req, res) => {
  const { id } = req.params;
  const consultas = [
    'SELECT * FROM solicitud WHERE id = ?',
    'INSERT INTO profesional(nombre, apellido, especialidad, correo, telefono, curriculum, contrasena) VALUES(?, ?, ?, ?, ?, ?, ?)',
    'DELETE FROM solicitud WHERE id = ?'
  ];

  if (!id) {
    return res.status(400).json({ message: 'No se proporcionó el id' });
  }

  try {
    // Obtener los datos de la solicitud profesional
    const [datosSolicitudProfesional] = await dbMysql2.query(consultas[0], [id]);
    console.log(datosSolicitudProfesional);

    if (datosSolicitudProfesional.length === 0) {
      return res.status(404).json({ message: 'No se pudo encontrar los datos del profesional' });
    }

    // Generar una contraseña de manera automática
    const contrasena = generadorContrasena(12, false);
    console.log('Contraseña Generada:', contrasena);

    // Encriptar la contraseña
    const sal = bcrypt.genSaltSync(10);
    const contrasenaEncriptada = bcrypt.hashSync(contrasena, sal);
    console.log('Contraseña Encriptada:', contrasenaEncriptada);

    // Asignar los datos del profesional, incluyendo la contraseña encriptada
    const datosProfesional = [
      datosSolicitudProfesional[0].nombre,
      datosSolicitudProfesional[0].apellido,
      datosSolicitudProfesional[0].especialidad,
      datosSolicitudProfesional[0].correo,
      datosSolicitudProfesional[0].telefono,
      datosSolicitudProfesional[0].curriculum,
      contrasenaEncriptada
    ];
    console.log(datosProfesional);

    // Insertar los datos del profesional en la base de datos
    await dbMysql2.query(consultas[1], datosProfesional);

    // Eliminar la solicitud después de agregar al profesional
    await dbMysql2.query(consultas[2], [id]);

    res.status(200).json({ message: 'El profesional se incorporó de manera exitosa' });
  } catch (error) {
    console.error('No se pudo incorporar el profesional', error);
    res.status(500).json({ message: 'No se pudo incorporar al profesional' });
  }
};


exports.eliminarSolicitudProfesional = async(req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).json({ message: 'No se proporcionó un id de referencia' });
  }

  // Consulta 
  const eliminarSolicitud = 'DELETE FROM solicitud WHERE id = ?';

  try {
    await dbMysql2.query(eliminarSolicitud, [id]);
    res.status(200).json({ message: 'La solicitud se eliminó exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo eliminar la solicitud. Por favor, inténtalo más tarde' });
  }
}

exports.obtenerProfesionales = async(req, res) => {
  const seleccionarProfesionales = 'SELECT * FROM profesional';
  try {
    const [datosProfesional] = await dbMysql2.query(seleccionarProfesionales);
    res.status(200).json(datosProfesional)
  } catch (error) {
    res.status(500).json({ message: 'Los profesionales no se pudieron seleccionar' });
  }

}

exports.agregarProfesional = async (req, res) => {
  const {nombre, apellido, especialidad, correo, telefono} = req.body;
  const curriculumFile = req.files['curriculum'] ? req.files['curriculum'][0].path : null;
  const imagenFile = req.files['imagen'] ? req.files['imagen'][0].path : null;

  if (!nombre && !apellido && !especialidad && !correo && !telefono && !curriculumFile) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios. Por favor, ingrese los datos' });
  }

// validar formato del teléfono y el curriculum
const validacionTelefono = validations.validarTelefono(telefono);
const validacionCurriculum = validations.validarFile(curriculumFile);
const validacionImagen = imagenFile ? validations.validarImagen(imagenFile) : null;


  // validar que todos los datos sí esten presentes
  const errores = {};
  if (!nombre) errores.nombre = 'El nombre no puede estar vacío. Por favor, ingresa tu nombre.';
  if (!apellido) errores.apellido = 'El apellido no puede estar vacío. Por favor, ingresa tu apellido.';
  if (!especialidad) errores.especialidad = 'No seleccionaste una especialidad. Por favor, selecciona una especialidad.';
  if (!correo) errores.correo = 'El correo no puede estar vacío. Por favor, ingresa tu correo electrónico.';
  if (!telefono) errores.telefono = 'No ingresaste tu número telefónico. Por favor, ingrésalo.';

  // Validar formato de los datos
  if (!curriculumFile) errores.curriculum = 'No seleccionaste tu hoja de vida. Por favor, selecciona tu archivo de hoja de vida.';
  if (validations.validarNumerosYSimbolos(nombre)) errores.formatoNombre = 'El nombre no puede contener números ni caracteres especiales';
  if (validations.validarNumerosYSimbolos(apellido)) errores.apellido = 'El apellido no puede contener números ni caracteres especiales';
  if (validations.validarCorreo(correo)) errores.formatoApellido = 'El correo no es válido. Por favor, ingresar un correo electrónico válido';
  if (!validacionImagen) errores.formatoImagen = 'La extensión del archivo es incorrecta. Solo se permiten imágenes en formato JPG, PNG, GIF o BMP.'
  if (validacionTelefono) errores.formatoTelefono = validacionTelefono;
  if (validacionCurriculum) errores.formatoCurriculum = validacionCurriculum;

  if (Object.values(errores).length > 0) {
    return res.status(400).json(errores);
  }

  // Generar una contraseña de manera automática
  const contrasena = generadorContrasena(12, false);
  console.log('Contraseña Generada:', contrasena);

  // Encriptar la contraseña
  const sal = bcrypt.genSaltSync(10);
  const contrasenaEncriptada = bcrypt.hashSync(contrasena, sal);
  console.log('Contraseña Encriptada:', contrasenaEncriptada);

  const consultarCorreoUsuarios = [
    'SELECT correo FROM super_admin WHERE correo = ?',
    'SELECT correo FROM admin WHERE correo = ?',
    'SELECT correo FROM cliente WHERE correo = ?',
    'SELECT correo FROM profesional WHERE correo = ?'
];

  const agregarProfesional = 'INSERT INTO profesional(nombre, apellido, especialidad, correo, telefono, curriculum, imagen, contrasena) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';

  try {
      // Verificar si el correo ya existe en alguna tabla
    for (let consulta of consultarCorreoUsuarios) {
      const [resultado] = await dbMysql2.query(consulta, [correo]);
      if (resultado.length > 0) {
          return res.status(409).json({ message: 'El correo ya está en uso.' });
      }
    }
    await dbMysql2.query(agregarProfesional, [nombre, apellido, especialidad, correo, telefono, curriculumFile, imagenFile, contrasenaEncriptada]);
    res.status(200).json({ message: 'El profesional se incorporó de manera exitosa' });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo incorporar el profesional' });
  }
}


exports.editarProfesional = async(req, res) => {
  const {id} = req.params;
  const {nombre, apellido, especialidad, correo, telefono} = req.body;
  const curriculumFile = req.files['curriculum'] ? req.files['curriculum'][0].path : null;
  const imagenFile = req.files['imagen'] ? req.files['imagen'][0].path : null;

  if (!id) {
    return res.status(400).json({ mensaje: 'ID inválido.' });
  }

// validar formato del teléfono y el curriculum
const validacionTelefono = telefono ? validations.validarTelefono(telefono) : null;
const validacionCurriculum = curriculumFile ? validations.validarFile(curriculumFile) : null;
const validacionImagen = imagenFile ? validations.validarImagen(imagenFile) : null;

  // Validar formato de los datos
  const errores = {};
  if (nombre){
    if (validations.validarNumerosYSimbolos(nombre)) {
      errores.formatoNombre = 'El nombre no puede contener números ni caracteres especiales';
    }
  }

  if (apellido) {
    if (validations.validarNumerosYSimbolos(apellido)) {
      errores.apellido = 'El apellido no puede contener números ni caracteres especiales';
    }
  }

  if (correo) {
    if (validations.validarCorreo(correo)) {
      errores.formatoApellido = 'El correo no es válido. Por favor, ingresar un correo electrónico válido';
    }
  }

  if (telefono) {
    if (validacionTelefono) {
      errores.formatoTelefono = validacionTelefono;
    }
  }

  if (!validacionImagen && validacionImagen !== null) errores.formatoImagen = 'La extensión del archivo es incorrecta. Solo se permiten imágenes en formato JPG, PNG, GIF o BMP.'
  if (validacionCurriculum) errores.formatoCurriculum = validacionCurriculum;

  console.log(errores);

  if (Object.values(errores).length > 0) {
    return res.status(400).json(errores);
  }

    // Crear un objeto con solo los campos que no son undefined
    const camposAActualizar = {};
    if (nombre) camposAActualizar.nombre = nombre;
    if (apellido) camposAActualizar.apellido = apellido;
    if (especialidad) camposAActualizar.especialidad = especialidad;
    if (correo) camposAActualizar.correo = correo;
    if (telefono) camposAActualizar.telefono = telefono;
    if (curriculumFile) camposAActualizar.curriculum = curriculumFile;
    if (imagenFile) camposAActualizar.imagen = imagenFile;

    // Verificar si hay algo que actualizar
    console.log(camposAActualizar);
    if (Object.keys(camposAActualizar).length === 0) {
        return res.status(400).json({ mensaje: 'No se proporcionaron datos para actualizar.' });
    }

    // Construir la consulta SQL dinámicamente
    const setClause = Object.entries(camposAActualizar)
        .map(([key, value]) => `${key} = ?`)
        .join(', ');

    const values = Object.values(camposAActualizar);

    const sql = `UPDATE profesional SET ${setClause} WHERE id = ?`;

    values.push(id); // Añadir el ID al final de los valores

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

    await dbMysql2.query(sql, values);
    res.status(200).json({ message: 'El profesional se incorporó de manera exitosa' });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo incorporar el profesional' });
  }
}

exports.eliminarProfesional = async(req, res) => {
  const {id} = req.params;
  const elimnarProfesionalSql = 'DELETE FROM profesional WHERE id = ?';

  if (!id) return res.status(400).json({ message: 'El id no existe' });

  try {
    await dbMysql2.query(elimnarProfesionalSql, [id]);
    res.status(200).json({ message: 'Se eliminó exitosamente el profesional' });
  } catch (error) {
    console.error('No se pudo eliminar el profesional:' , error)
    res.status(500).json({ message: 'No se pudo eliminar el profesional' });
  }
}