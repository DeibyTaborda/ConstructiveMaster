const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Verificar si existe `categoria` o `subcategoria` en el cuerpo de la solicitud
        if (req.body.categoria || req.body.subcategoria) {
            cb(null, 'uploads/imagenes');
        } else if (file.fieldname === 'curriculum') {
            cb(null, 'uploads/curriculums');
        } else if (file.fieldname === 'imagen') {
            cb(null, 'uploads/imagenes');
        } else {
            cb(new Error('No se proporcionaron ni categoría ni subcategoría'), null);
        }
    },
    filename: (req, file, cb) => {
        // Define el nombre del archivo
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Crear el middleware de multer
const upload = multer({ storage });

// Exportar el middleware
module.exports = upload.fields([
    { name: 'imagenCategoria', maxCount: 1 }, // Nombre del primer archivo
    { name: 'imagenSubcategoria', maxCount: 1 }, 
    { name: 'imagen', maxCount: 1 },
    { name: 'curriculum', maxCount: 1 } // Nombre del segundo archivo
  ]);
