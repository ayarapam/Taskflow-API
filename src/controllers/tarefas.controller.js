const tarefaModel = require('../models/tarefa.model');
const usuarioModel = require('../models/usuario.model');
const criarErro = require('../utils/criarErro');


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
        const { coluna, usuario_id } = req.query;
        let resultado = await tarefaModel.listar();
        if (coluna) resultado = resultado.filter(t => t.coluna === coluna);
        if (usuario_id) resultado = resultado.filter(t => t.usuario_id === parseInt(usuario_id));
        res.json(resultado);
    },

    // async listarPrioridades(req, res) {
    //     const {descricao, ativo} = req.query;
    //     let resultado = await tarefaModel.listarPrioridades();
    //     res.json(resultado);
    // },

    async estatisticas(req, res) {
        res.json(tarefaModel.estatisticas(req.query.coluna));
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
        if (!tarefa) { throw criarErro(404, 'Tarefa não encontrada') };
        res.json(tarefa);
    },

    //----------------------------------------
    // Rotas - POST
    //----------------------------------------
    async criar(req, res) {
        res.status(201).json(await tarefaModel.adicionar(req.body));
    },


    //----------------------------------------
    // Rotas - PUT
    //----------------------------------------
    async atualizar(req, res) {
        const id = parseInt(req.params.id);

        const atualizada = await tarefaModel.atualizar(id, req.body);

        if (!atualizada) { throw criarErro(404, 'Tarefa não encontrada') };

        res.json(atualizada);
    },

    //----------------------------------------
    // Rotas - DELETE
    //----------------------------------------
    async remover(req, res) {
        const removida = await tarefaModel.remover(parseInt(req.params.id));

        if (!removida) {
            throw criarErro(404, 'Tarefa não encontrada');
        }

        res.json({ mensagem: 'Tarefa removida', tarefa: removida });

    },
};

module.exports = tarefasController;