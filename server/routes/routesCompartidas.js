const express = require('express'); // Importa express
const router = express.Router(); // Crea una instancia de un enrutador modular para manejar rutas
const upload = require('../middleware/uploadCurriculum');
const upload2 = require('../middleware/uploadImagenes');
const controloresCompartidos = require('../controllers/controladoresCompartidos');
const {verificarToken, verificarRol } = require('../controllers/loginController'); 

router.post('/unete', upload.single('curriculum'), controloresCompartidos.solicitudProfesional);
router.post('/cambiar-contrasena', verificarToken, controloresCompartidos.cambiarContrasena);
router.get('/actividad', verificarToken, controloresCompartidos.obtenerActividad);
router.get('/categorias-ejecucion-administracion', controloresCompartidos.obtenerCategorias);
router.get('/subcategorias-general', controloresCompartidos.obtenerSubcategorias);
router.get('/profesionales/disponibles', controloresCompartidos.profesionalesDisponibles);
router.get('/clientes/activos', controloresCompartidos.seleccionarClientesActivos);
router.get('/subcategorias', controloresCompartidos.obtenerSubcategorias);
router.get('/buscar-profesionales', controloresCompartidos.buscarProfesional);
router.get('/campos_personalizados-profesional/:id', controloresCompartidos.ObtenerCamposPersonalizados);
router.get('/imagenes/profesionales/:id', controloresCompartidos.obtenerImagenes);
router.get('/profesionales', controloresCompartidos.seleccionarProfesionales);
router.post('/buscar-profesional-contratar', controloresCompartidos.obtenerProfesional);
router.get('/img/usuario', verificarToken, controloresCompartidos.obtenerImgUsuario);
router.put('/cancelar-trabajo/:idTrabajo',verificarToken, verificarRol(['profesional', 'cliente']), controloresCompartidos.cancelarTrabajo);
router.put('/confirmar-trabajo/:idTrabajo',verificarToken, verificarRol(['profesional', 'cliente']), controloresCompartidos.confirmarTrabajo);
router.put('/contratos/:id', verificarToken, verificarRol(['admin', 'super_admin']), controloresCompartidos.actualizarContrato);
module.exports = router; 