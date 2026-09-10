//----------------------------------------
// Exports
//----------------------------------------
const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');

//----------------------------------------
// servidor com Express
//----------------------------------------
const express = require('express');
const router = express.Router();

//----------------------------------------
// importando o controller
//----------------------------------------
const usuariosController = require('../controllers/usuarios.controller');

//----------------------------------------
// rotas
//----------------------------------------
router.get('/', usuariosController.listar);
router.post('/', validar(schemas.usuario), usuariosController.criar);

//----------------------------------------
// rotas - /:id
//----------------------------------------
router.get('/:id', usuariosController.buscarPorId);
router.put('/:id', validar(schemas.usuario), usuariosController.atualizar);
router.delete('/:id', usuariosController.remover);

//----------------------------------------
// Exportando o router
//----------------------------------------
module.exports = router;