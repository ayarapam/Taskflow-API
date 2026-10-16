//----------------------------------------
// servidor com Express
//----------------------------------------
const express = require('express');
const router = express.Router();

//----------------------------------------
// Exports
//----------------------------------------
const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');
const autenticar = require('../middlewares/autenticar');

//----------------------------------------
// importando o controller
//----------------------------------------
const usuariosController = require('../controllers/usuarios.controller');

//----------------------------------------
// rotas
//----------------------------------------
router.post('/', validar(schemas.usuario), usuariosController.criar);
router.get('/', autenticar, usuariosController.listar);

//----------------------------------------
// rotas - /:id
//----------------------------------------
router.get('/:id', autenticar, usuariosController.buscarPorId);
router.put('/:id', autenticar, validar(schemas.usuario), usuariosController.atualizar);
router.delete('/:id', autenticar, usuariosController.remover);

//----------------------------------------
// Exportando o router
//----------------------------------------
module.exports = router;