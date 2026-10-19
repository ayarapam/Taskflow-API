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
const idValido = validar(schemas.id, 'params');

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
// router.get('/prioridades', tarefasController.listarPrioridades);

//----------------------------------------
// rotas/:id
//----------------------------------------
router.get('/:id', idValido, tarefasController.buscarPorId);
router.put('/:id', idValido, validar(schemas.tarefa), tarefasController.atualizar);
router.delete('/:id', idValido, tarefasController.remover);

//----------------------------------------
// exportando o router
//----------------------------------------
module.exports = router;