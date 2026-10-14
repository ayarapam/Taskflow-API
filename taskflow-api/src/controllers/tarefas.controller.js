const tarefaModel = require('../models/tarefa.model');
const usuarioModel = require('../models/usuario.model');

//----------------------------------------
// Arrays
//----------------------------------------
//const PRIORIDADES_VALIDAS = ['alta', 'media', 'baixa'];
//const COLUNAS_VALIDAS = ['afazer', 'andamento', 'concluido'];

//----------------------------------------
// Controller
//----------------------------------------
const tarefasController = {

    //----------------------------------------
    // Rotas - get
    //----------------------------------------
    async listar(req, res) {
        const { coluna, usuarioId } = req.query;
        let resultado = await tarefaModel.listar();
        if (coluna) resultado = resultado.filter(t => t.coluna === coluna);
        if (usuarioId) resultado = resultado.filter(t => t.usuarioId === parseInt(usuarioId));
        res.json(resultado);
    },

    async estatisticas(req, res) {
        const estatisticas = await tarefaModel.estatisticas();
        res.json(estatisticas);
    },

    async resumo(req, res) {
        const resumo = await tarefaModel.resumo();
        res.json(resumo);
    },

    //----------------------------------------
    // Rotas - get/:id
    //----------------------------------------
    async buscarPorId(req, res) {
        const tarefa = await tarefaModel.buscarPorId(parseInt(req.params.id));
        if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
        res.json(tarefa);
    },

    //----------------------------------------
    // Rotas - POST
    //----------------------------------------
    async criar(req, res) {
        const dados = {
            ...req.body,
            usuario_id: req.usuario.id, 
        };

        res.status(201).json(await tarefaModel.adicionar(dados));
    },

    //----------------------------------------
    // Rotas - PUT
    //----------------------------------------
    async atualizar(req, res) {
        const id = parseInt(req.params.id);
        const atualizada = await tarefaModel.atualizar(id, req.body);
        if (!atualizada) return res.status(404).json({ erro: 'Tarefa não encontrada' });
        res.json(atualizada);
    },

    //----------------------------------------
    // Rotas - DELETE
    //----------------------------------------
    async remover(req, res) {
        const removida = await tarefaModel.remover(parseInt(req.params.id));

        if (!removida) {
            return res.status(404).json({ erro: 'Tarefa não encontrada' });
        }

        res.json({ mensagem: 'Tarefa removida', tarefa: removida });
    },
};

module.exports = tarefasController;