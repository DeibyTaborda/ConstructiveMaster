const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const upload = require('../middleware/uploadCurriculum');
const { verificarToken, verificarRol } = require('../controllers/loginController');

router.get('/panel-de-usuario', verificarToken, verificarRol(['cliente']))
router.post('/registro', clientController.registroUsuario);
router.get('/unete', verificarToken, verificarRol(['cliente']), clientController.seleccionarSubategorias);
router.post('/trabajos', verificarToken, verificarRol(['cliente', 'super_admin', 'admin']), clientController.SolicitudTrabajo);
router.post('/solicitud/trabajo', verificarToken, verificarRol(['cliente']), clientController.crearTrabajo);
router.get('/trabajos/usuario', verificarToken, verificarRol(['cliente']), clientController.obtenerTrabajos);

module.exports = router; 
