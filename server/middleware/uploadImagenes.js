const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        if (req) {
            cb(null, 'uploads/imagenes');
        } else {
            cb(new Error('No se proporcionaron ni categoría ni subcategoría'), null);
        }
    }, 

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload2 = multer({ storage });

module.exports = upload2;