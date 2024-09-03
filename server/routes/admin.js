const express = require('express'); // Importa express
const router = express.Router(); // Crea una instancia de un enrutador modular para manejar rutas
const adminController = require('../controllers/adminController'); // Importa el controlador de administración
const upload = require('../middleware/uploadMiddleware'); // Middleware para manejar la subida de imágenes
const upload2 = require('../middleware/uploadImagenes');
const loginController = require('../controllers/loginController');
const {verificarToken, verificarRol } = require('../controllers/loginController'); 

router.get('/clientes', adminController.getClientes); // Solicitud GET para obtener todos los clientes desde /clientes
router.post('/categorias', upload, adminController.registerCategory); // Solicitud POST para crear categorías y subcategorías desde /categorias
router.get('/categorias', adminController.getCategory); // Solicitud GET para obtener las categorías y subcategorías
router.delete('/categorias/:tableId/:Id', adminController.deleteCategory); // Solicitud DELETE para eliminar categorías y subcategorías
router.get('/solicitud_profesional', adminController.getSolicitudProfesional); // Solicitud GET para obtener solicitudes de profesionales
router.put('/categorias/:tabla/:id', upload2.single('imgCategoria'), adminController.categoryPut);
router.post('/login', loginController.logearUsuario);
router.delete('/clientes/:id', verificarToken, verificarRol(['admin', 'super_admin']), adminController.eliminarCliente);
router.put('/clientes/:id', verificarToken, verificarRol(['admin', 'super_admin']), upload2.single('imagen'), adminController.actualizarCliente);
router.post('/clientes', verificarToken, verificarRol(['admin', 'super_admin']), upload2.single('imagen'), adminController.agregarCliente);
router.delete('/solicitud_profesional/:id', verificarToken, verificarRol(['admin', 'super_admin']), adminController.incorporarProfesional);

module.exports = router; // Exporta el enrutador para su uso en otros archivos de la aplicación
