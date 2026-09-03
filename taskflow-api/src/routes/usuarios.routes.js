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
router.post('/', usuariosController.criar);

//----------------------------------------
// rotas - /:id
//----------------------------------------
router.get('/:id', usuariosController.buscarPorId);
router.put('/:id', usuariosController.atualizar);
router.delete('/:id', usuariosController.remover);

//----------------------------------------
// Exportando o router
//----------------------------------------
module.exports = router;