const express = require('express');
const router = express.Router();
const devolutionsController = require('../controllers/devolutionsController');
const validateDevolutions = require('../middlewares/validateDevolutions');

console.log(devolutionsController); // Agrega esto para verificar qué funciones están importadas

router.get('/all', devolutionsController.getAllDevolutions);
router.get('/:id', devolutionsController.getDevolutionsById);
router.post('/', validateDevolutions, devolutionsController.createDevolutions);
router.put('/:id', validateDevolutions, devolutionsController.updateDevolutions);
router.delete('/:id', devolutionsController.deleteDevolutions);

router.post('/cambioSabor', validateDevolutions, devolutionsController.createDevolucionCambioSabor);
router.post('/malEstado', validateDevolutions, devolutionsController.createDevolucionMalEstado);
router.post('/productoVencido', validateDevolutions, devolutionsController.createDevolucionProductoVencido);
router.post('/empaquetadoRoto', validateDevolutions, devolutionsController.createDevolucionEmpaquetadoRoto);

module.exports = router;
