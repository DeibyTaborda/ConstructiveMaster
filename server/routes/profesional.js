const express = require('express');
const router = express.Router(); 
const profesionalController = require('../controllers/profesionalController');
const upload2 = require('../middleware/uploadImagenes');
const { verificarToken, verificarRol } = require('../controllers/loginController');

router.get('/panel-de-control-profesional', verificarToken, verificarRol(['profesional']));
router.get('/trabajos-profesional', verificarToken, verificarRol(['profesional']), profesionalController.obtenerTrabajos);
router.get('/actividades-profesional',verificarToken, verificarRol(['profesional']), profesionalController.obenerActividades);
router.get('/:id/campos_personalizados', verificarToken, verificarRol(['profesional']), profesionalController.obtenerCamposPersonalizados);
router.put('/:id/campos_personalizados', verificarToken, verificarRol(['profesional']), profesionalController.actualizarCamposPersonalizados);
router.put('/descripcion/profesional', verificarToken, verificarRol(['profesional']), profesionalController.actualizarDescripcion);
router.get('/descripcion/profesional', verificarToken, verificarRol(['profesional']), profesionalController.obterDescripcion);
router.post('/subir/imagen', verificarToken, verificarRol(['profesional']), upload2.single('imagen'), profesionalController.subirImagenProfesional);
router.get('/subir/imagen', verificarToken, verificarRol(['profesional', 'cliente']), profesionalController.obtenerImagenes);
router.delete('/subir/imagen/:id', verificarToken, verificarRol(['profesional']), profesionalController.eliminarImagenProfesional);
router.post('/procesar-pago', profesionalController.procesarPago);
router.get('/contratos/profesional', verificarToken, verificarRol(['profesional']), profesionalController.seleccionarContratos);
module.exports = router; 
