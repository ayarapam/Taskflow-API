//----------------------------------------
// servidor com Express
//----------------------------------------
const express = require('express');
const router = express.Router();

//----------------------------------------
// importando o controller
//----------------------------------------
const tarefasController = require('../controllers/tarefas.controller');

//----------------------------------------
// rotas - tarefas
//----------------------------------------
router.get('/', tarefasController.listar);
router.post('/', tarefasController.criar);
router.get('/estatisticas', tarefasController.estatisticas);
router.get('/estatisticas/resumo', tarefasController.resumo);

//----------------------------------------
// rotas/:id
//----------------------------------------
router.get('/:id', tarefasController.buscarPorId);
router.put('/:id', tarefasController.atualizar);
router.delete('/:id', tarefasController.remover);

//----------------------------------------
// exportando o router
//----------------------------------------
module.exports = router;