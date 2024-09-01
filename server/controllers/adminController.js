const db = require('../db/db');
const dbMysql2 = require('../db/db-mysql2');
const validations = require('../validations/validations')

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
  const { categoria, subcategoria } = req.body;
  const regexNombre = /\d+/;

  // Acceso a los archivos subidos
  const categoriaFile = req.files['imagenCategoria'] ? req.files['imagenCategoria'][0] : null;
  const subcategoriaFile = req.files['imagenSubcategoria'] ? req.files['imagenSubcategoria'][0] : null;

  // Rutas de los archivos
  const categoriaImagePath = categoriaFile ? categoriaFile.path : null;
  const subcategoriaImagePath = subcategoriaFile ? subcategoriaFile.path : null;

  // SQL queries
  const categoryRegister = 'INSERT INTO categoria(categoria, img_categoria) VALUES(?, ?)';
  const subcategoryRegister = 'INSERT INTO subcategoria(subcategoria, img_subcategoria) VALUES(?, ?)';
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
        db.query(subcategoryRegister, [subcategoria, subcategoriaImagePath], (error, results) => {
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