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
      return res.status(500).json({ message: 'Los clientes no se seleccionaron' });
    } else {
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

exports.getCategory = (req, res) => {
  const categoryGet = 'SELECT * FROM categoria';
  const subCategoryGet = 'SELECT * FROM subcategoria';

  db.query(categoryGet, (error, results1) => {
    if (error) {
      console.error('Error al obtener las categorías:', error);
      return res.status(500).json({ message: 'Error al obtener las categorías' });
    }

    db.query(subCategoryGet, (error, results2) => {
      if (error) {
        console.error('Error al obtener las subcategorías:', error);
        return res.status(500).json({ message: 'Error al obtener las subcategorías' });
      }
      return res.status(200).json({ categories: results1, subcategories: results2 });
    });
  });
};

// Controlador que permite eliminar una catetoría o subcategoría.
exports.deleteCategory = (req, res) => {
  const { tableId, Id } = req.params;
  const estado = 'Deshabilitada';
  const deleteCategory = `UPDATE ${tableId} SET estado = ? WHERE id = ?`;

  if (!tableId || !Id) {
    console.log('No seleccionaste una categoria o ID');
    return res.status(400).json({ message: 'No seleccionaste una categoría o ID' });
  }

  const allowedTables = ['categoria', 'subcategoria'];
  if (!allowedTables.includes(tableId)) {
    return res.status(400).json({ message: 'Tabla no permitida' });
  }

  if (tableId) {
    db.query(deleteCategory, [estado, Id], (error, results) => {
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
    return res.status(200).json(results);
  })
}

exports.categoryPut = (req, res) => {
  const { categoria, estado } = req.body;
  const { tabla, id } = req.params;
  const imgCategoria = req.file ? req.file.path : null;
  const originalnameImg = req.file?.originalname;

  console.log('este es el estado', estado)

  if (!categoria) {
    console.log(`El campo ${tabla} está vacío`);
    return res.status(400).json({ message: `El campo ${tabla} es obligatorio` });
  }

  const longitudCategoria = validations.validarCategoria(categoria);

  if (longitudCategoria) {
    console.log(longitudCategoria);
    return res.status(400).json({ message: longitudCategoria });
  }

  // Validar el estado
  const estadosValidos = ["Activa", "Deshabilitada"];
  if (!estado || !estadosValidos.includes(estado)) {
    return res.status(400).json({ message: 'Estado no válido. Valores permitidos: Activa, Deshabilitada' });
  }

  if (imgCategoria && !validations.validarImagen(originalnameImg)) {
    console.log('El usuario ha ingresado un archivo con un formato no válido');
    return res.status(400).json({ message: 'Por favor, ingrese un archivo válido (formatos permitidos: .jpg, .jpeg, .png, .gif, .bmp)' });
  }

  // Procesar la tabla de 'categoria'
  if (tabla === 'categoria') {
    const sqlExisCategoria = 'SELECT categoria FROM categoria WHERE id = ?';

    db.query(sqlExisCategoria, [id], (error, results) => {
      if (error) {
        console.error('Error al obtener la categoría para comprobar si existe', error);
        return res.status(500).json({ message: 'Error interno. Por favor, inténtalo más tarde' });
      } 
      const sqlObtenerImgCategoria = 'SELECT img_categoria FROM categoria WHERE id = ?';

      db.query(sqlObtenerImgCategoria, [id], (error, results) => {
        if (error) {
          console.error(`Error al obtener la ${tabla} ${categoria}`, error);
          return res.status(500).json({ message: `Error al obtener la ${tabla} ${categoria}`, error });
        }
  
        const imagenActual = results[0].img_categoria;
        const nuevaImgCategoria = imgCategoria || imagenActual;
  
        const sqlCategoria = 'UPDATE categoria SET categoria = ?, estado = ?, img_categoria = ? WHERE id = ?';
        db.query(sqlCategoria, [categoria, estado, nuevaImgCategoria, id], (error) => {
          if (error) {
            console.error(`Error en actualizar la ${tabla} ${categoria} `, error);
            return res.status(500).json({ message: `Error en actualizar la ${tabla} ${categoria} ` });
          } else {
            console.log(`La ${tabla} ${categoria} se actualizó exitosamente`);
            return res.status(200).json({ message: `La ${tabla} ${categoria} se actualizó exitosamente` });
          }
        });
      });
    });
  }

  // Procesar la tabla de 'subcategoria'
  if (tabla === 'subcategoria') {
    const sqlExisSubcategoria = 'SELECT subcategoria FROM subcategoria WHERE id = ?';

    db.query(sqlExisSubcategoria, [id], (error, results) => {
      if (error) {
        console.error('Error al obtener la subcategoría para comprobar si existe', error);
        return res.status(500).json({ message: 'Error interno. Por favor, inténtalo más tarde' });
      }

      const sqlObtenerImgSubcategoria = 'SELECT img_subcategoria FROM subcategoria WHERE id = ?';

      db.query(sqlObtenerImgSubcategoria, [id], (error, results) => {
        if (error) {
          console.error('Error al obtener la imagen de la subcategoría', error);
          return res.status(500).json({ message: 'Error interno. Por favor, inténtalo más tarde' });
        }
  
        const imagenActual = results[0].img_subcategoria;
        const nuevaImgSubcategoria = imgCategoria || imagenActual;
  
        const sqlSubcategoria = 'UPDATE subcategoria SET subcategoria = ?, estado = ?, img_subcategoria = ? WHERE id = ?';
        db.query(sqlSubcategoria, [categoria, estado, nuevaImgSubcategoria, id], (error) => {
          if (error) {
            console.error(`Error en actualizar la subcategoría ${categoria}`, error);
            return res.status(500).json({ message: `Error en actualizar la subcategoría ${categoria}` });
          }
  
          console.log(`La subcategoría ${categoria} se actualizó exitosamente`);
          return res.status(200).json({ message: `La subcategoría ${categoria} se actualizó exitosamente` });
        });
      });
    });
  }
};

 
exports.eliminarCliente = async(req, res) => {
  const {id} = req.params;
  const estado = 'Deshabilitado';
  const eliminarCliente = 'UPDATE cliente SET estado = ? WHERE id = ?';

  if (!id) { 
    return res.status(400).json({ message: 'Por favor, verifica el ID ingresado y vuelve a intentarlo.'});
  }

  try {
    await dbMysql2.query(eliminarCliente, [estado, id]);
    res.status(200).json({ message: 'El cliente se eliminó exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo eliminar el cliente' });
  }

}

exports.actualizarCliente = async(req, res) => {
  const {id} = req.params;
  const {nombre, correo, telefono, estado, direccion} = req.body;
  const imagen = req.file?.path || null;
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
  if (telefono.length > 10) {
    errores.push('Número telefónico inválido. No debe contener más de 10 caracteres.');
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
  if (estado) camposActualizar.estado = estado;
  if (direccion) camposActualizar.direccion = direccion;
  if (imagen) camposActualizar.imagen = imagen;

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
  if (telefono.length > 10 || telefono < 7) {
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

      // Generar una contraseña de manera automática
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
          return res.status(409).json({ message: 'El correo ya está en uso.' });
      }
    }
    await dbMysql2.query(agregarClienteSql, valores);
    res.status(200).json({ message: 'EL cliente se registro exitosamente' });
  } catch (error) {
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
  console.log(id);

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

exports.obtenerProfesionales = async (req, res) => {
  const seleccionarProfesionales =  'SELECT profesional.*, subcategoria.subcategoria AS especialidad_nombre FROM profesional LEFT JOIN subcategoria ON profesional.especialidad = subcategoria.id;';
 
  try {
    const [datosProfesional] = await dbMysql2.query(seleccionarProfesionales);
    res.status(200).json(datosProfesional);
  } catch (error) {
    console.error('eajfdjsaf', error)
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

// Validar formato del teléfono, currículum y la imagen
const validacionTelefono = telefono && validations.validarTelefono(telefono);
const validacionCurriculum = curriculumFile && validations.validarFile(curriculumFile);
const validacionImagen = imagenFile && validations.validarImagen(imagenFile);

// Validar que todos los datos estén presentes
const errores = {};
if (!nombre) errores.nombre = 'El nombre no puede estar vacío. Por favor, ingresa tu nombre.';
if (!apellido) errores.apellido = 'El apellido no puede estar vacío. Por favor, ingresa tu apellido.';
if (!especialidad) errores.especialidad = 'No seleccionaste una especialidad. Por favor, selecciona una especialidad.';
if (!correo) errores.correo = 'El correo no puede estar vacío. Por favor, ingresa tu correo electrónico.';
if (!telefono) errores.telefono = 'No ingresaste tu número telefónico. Por favor, ingrésalo.';
if (!curriculumFile) errores.curriculum = 'No seleccionaste tu hoja de vida. Por favor, selecciona tu archivo de hoja de vida.';

// Validar formato de los datos
if (nombre && validations.validarNumerosYSimbolos(nombre)) errores.formatoNombre = 'El nombre no puede contener números ni caracteres especiales';
if (apellido && validations.validarNumerosYSimbolos(apellido)) errores.formatoApellido = 'El apellido no puede contener números ni caracteres especiales';
if (correo && validations.validarCorreo(correo)) errores.formatoCorreo = 'Por favor, ingresa un correo electrónico válido.';
if (validacionImagen) errores.formatoImagen = 'La extensión del archivo es incorrecta. Solo se permiten imágenes en formato JPG, PNG, GIF o BMP.';
if (validacionTelefono) errores.formatoTelefono = 'El número de teléfono no es válido.';
if (validacionCurriculum) errores.formatoCurriculum = 'Formato de archivo de hoja de vida no permitido.';

  if (Object.values(errores).length > 0) {
    return res.status(400).json(errores);
  }

  // Generar una contraseña de manera automática
  const contrasena = generadorContrasena(12, false);
  console.log('Contraseña Generada:', contrasena);

  // Encriptar la contraseña
  const sal = bcrypt.genSaltSync(10);
  const contrasenaEncriptada = bcrypt.hashSync(contrasena, sal);

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
  const {nombre, apellido, especialidad, correo, estado,telefono} = req.body;
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
    if (estado) camposAActualizar.estado = estado;
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
    console.log('solicitud exitosa')
    res.status(200).json({ message: 'Actualización exitosa' });
  } catch (error) {
    console.error('errores', error)
    res.status(500).json({ message: 'No se pudo incorporar el profesional' });
  }
}

exports.eliminarProfesional = async(req, res) => {
  const {id} = req.params;
  const estado = 'Inactivo';
  const elimnarProfesionalSql = 'UPDATE profesional SET estado = ? WHERE id = ?';

  if (!id) return res.status(400).json({ message: 'El id no existe' });

  try {
    await dbMysql2.query(elimnarProfesionalSql, [estado, id]);
    res.status(200).json({ message: 'Se deshabilitó exitosamente el profesional' });
  } catch (error) {
    console.error('No se pudo eliminar el profesional:' , error)
    res.status(500).json({ message: 'No se pudo eliminar el profesional' });
  }
}

exports.editarSolicitudTrabajo = async(req, res) => {
  const {id_cliente, id_profesional, hora, fecha, direccion, valor, descripcion, estado}  = req.body;
  const {id} = req.params;
  console.log('este es el id ', id)
  

  if (!id_cliente && id_profesional && !hora && !fecha && !direccion && !valor && !descripcion) {
      return res.status(400).json({ message: 'Todos los campos están vacíos' });
  }

  const erroresSolicitudTrabajo = {};
  if (id_cliente && !validations.esNumerico(id_cliente)) erroresSolicitudTrabajo.formatoId_cliente = 'El id del cliente no es un valor númerico';
  if (id_profesional && !validations.esNumerico(id_profesional)) erroresSolicitudTrabajo.formatoId_profesional = 'El id del profesional no es un valor númerico';
  if (fecha && !validations.esFechaValida(new Date(fecha))) erroresSolicitudTrabajo.formatoFecha = 'Fecha no válida: por favor, ingrese una fecha correcta.';
  if (hora &&!validations.esHoraValida(hora)) erroresSolicitudTrabajo.formatoHora = 'Hora no válida: por favor, ingrese una hora válida';
  if (valor && !validations.esNumerico(valor)) erroresSolicitudTrabajo.formatoValor = 'El valor debe ser un valor númerico';

  // Verificar si hay errores
  if (Object.keys(erroresSolicitudTrabajo).length > 0) {
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
      await dbMysql2.query(editarSolicitudTrabajo, datos);
      console.log('todo con exito')
      res.status(200).json({ message: 'La solicitud de trabajo se modificó de manera exitosa' });
  } catch (error) {
    console.error('errorcito:', error)
      res.status(500).json({ message: 'No se pudo actualizar la solicitud de trabajo' });
  }
}

exports.obtenerSolicitudesTrabajo = async(req, res) => {
  const {estado} = req.body;

  let obtenerSolicitudesTrabajo = `SELECT trabajo.id, cliente.nombre AS nombre_cliente, profesional.nombre AS nombre_profesional, trabajo.fecha, trabajo.hora, trabajo.direccion, trabajo.descripcion, trabajo.valor, trabajo.fecha_inicio, trabajo.estado FROM trabajo JOIN cliente ON trabajo.id_cliente = cliente.id JOIN profesional ON trabajo.id_profesional = profesional.id`;

  const queryParams = [];

  // Si se proporciona el estado, agregar WHERE
  if (estado) {
    obtenerSolicitudesTrabajo += ` WHERE trabajo.estado = ?`;
    queryParams.push(estado);
  }


  try {
    const [solicitudesTrabajo] = await dbMysql2.query(obtenerSolicitudesTrabajo, queryParams);
    res.status(200).json(solicitudesTrabajo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudieron seleccionar las solicitudes de trabajo' });
  }
}

exports.obtenerContratos = async(req, res) => {
  const {estado_pago} = req.query;
  const obtenerContratos = 'SELECT * FROM contrato WHERE estado_pago LIKE ?';
  const obtenerTodosContratos = 'SELECT * FROM contrato';

if (estado_pago === 'todos') {
  try {
    const [contratos] = await dbMysql2.query(obtenerTodosContratos);
    res.status(200).json(contratos); 
  } catch (error) {
    res.status(500).json({ message: 'No se pudo seleccionar los contratos' });
  }
} else {
  try {
    const [contratos] = await dbMysql2.query(obtenerContratos, [estado_pago]);
    res.status(200).json(contratos); 
  } catch (error) {
    res.status(500).json({ message: 'No se pudo seleccionar los contratos' });
  }
}
}