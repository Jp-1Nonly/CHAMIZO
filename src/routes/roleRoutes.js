const express = require('express');
const roleController = require('../controllers/rolesController');
const validateRole = require('../middlewares/validateRole');

const router = express.Router();

router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.post('/',  validateRole,  roleController.createRole);
router.put('/:id', validateRole,  roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

router.patch('/:id', roleController.updateRoleState);

module.exports = router;