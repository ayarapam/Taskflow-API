//----------------------------------------
// servidor com Express
//----------------------------------------
const express = require('express');
const router = express.Router();

//----------------------------------------
// importando o controller
//----------------------------------------
const projetosController = require('../controllers/projetos.controller');

//----------------------------------------
// rotas - projetos
//----------------------------------------
router.get('/', projetosController.listar);
router.post('/', projetosController.criar);
router.get('/:id', projetosController.buscarPorId);
router.put('/:id', projetosController.atualizar);
router.delete('/:id', projetosController.remover);

//----------------------------------------
// exportando o router
//----------------------------------------
module.exports = router;
