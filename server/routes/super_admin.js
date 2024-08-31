const express = require('express'); // Importar express
const router = express.Router();
const upload2 = require('../middleware/uploadImagenes');
const super_adminController = require('../controllers/super_adminController');
const {verificarToken, verificarRol, verificarRuta} = require('../controllers/loginController');

router.post('/panel_de_control', verificarToken, verificarRol(['super_admin', 'admin']), upload2.single('imagen'), super_adminController.subirTable);
router.get('/panel_de_control',verificarToken, verificarRol(['admin', 'super_admin']),super_adminController.obtenerTablas);
router.delete('/panel_de_control/:id', verificarToken, verificarRol(['super_admin']), super_adminController.eliminarTabla);
router.put('/panel_de_control/:id', verificarToken, verificarRol(['super_admin']), upload2.single('imagen'), super_adminController.actulizarTabla );
router.post('/admin/imagen', verificarToken, upload2.single('imagen'), super_adminController.subirImagenAdmin);
router.get('/datos/personales', verificarToken, super_adminController.obtenerDatosAdmin);
router.delete('/admin/imagen/:id', verificarToken, super_adminController.eliminarImagenAdmin);
router.put('/datos/personales/:id', verificarToken, super_adminController.actualizarRegistro); 
router.post('/agregar/admin', verificarToken, verificarRol(['super_admin']), super_adminController.agregarAdmin);


module.exports = router;  