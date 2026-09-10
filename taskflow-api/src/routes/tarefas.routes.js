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
const tarefasController = require('../controllers/tarefas.controller');

//----------------------------------------
// rotas - tarefas
//----------------------------------------
router.get('/', tarefasController.listar);
router.post('/', validar(schemas.tarefa), tarefasController.criar);
router.get('/estatisticas', tarefasController.estatisticas);
router.get('/estatisticas/resumo', tarefasController.resumo);

//----------------------------------------
// rotas/:id
//----------------------------------------
router.get('/:id', tarefasController.buscarPorId);
router.put('/:id', validar(schemas.tarefa), tarefasController.atualizar);
router.delete('/:id', tarefasController.remover);

//----------------------------------------
// exportando o router
//----------------------------------------
module.exports = router;