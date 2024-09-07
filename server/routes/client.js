const express = require('express'); // Importar express
const router = express.Router(); // Crea una instancia de un enrutador modular para manejar rutas
const clientController = require('../controllers/clientController'); // Importar el controlador
const upload = require('../middleware/uploadCurriculum'); // Importa el middleware encargado de gestionar la subida de archivos de currículum

router.post('/registro', clientController.registroUsuario); // Solicitud POST que permite el registro de los clinetes
router.get('/unete', clientController.seleccionarSubategorias); // Solicitud GET que permite seleccionar todas las subcategorías para mostrarla en options del select con name especialidad en el formulario /unete
router.post('/unete', upload.single('curriculum'), clientController.solicitudProfesional); // Solicitud POST que permite enviar las solicitudes de los usuarios que desean incorporar en el equipo de profesionales de ConstructiveMaster
router.post('/trabajos', clientController.SolicitudTrabajo);
router.get('/buscar-profesionales', clientController.buscarProfesional);
module.exports = router; // Exporta el enrutador para que pueda ser utilizado en otros archivos de la aplicación
