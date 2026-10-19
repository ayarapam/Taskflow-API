//----------------------------------------
// servidor com Express
//---------------------------------------
const express = require('express');
const router = express.Router();
const validar = require('../middlewares/validar');


//----------------------------------------
// importando o controller
//----------------------------------------
const projetosController = require('../controllers/projetos.controller');
const schemas = require('../middlewares/schemas');

const idValido = validar(schemas.id, 'params');

//----------------------------------------
// rotas - projetos
//----------------------------------------
router.get('/', projetosController.listar);
router.post('/', validar(schemas.projeto), projetosController.criar);
router.get('/:id', idValido, projetosController.buscarPorId);
router.put('/:id', idValido, validar(schemas.projeto), projetosController.atualizar);
router.delete('/:id', idValido, projetosController.remover);

//----------------------------------------
// exportando o router
//----------------------------------------
module.exports = router;
