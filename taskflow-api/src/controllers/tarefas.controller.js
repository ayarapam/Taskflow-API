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
    listar(req, res) {
        const { coluna, usuarioId } = req.query;
        let resultado = tarefaModel.listar();
        if (coluna) resultado = resultado.filter(t => t.coluna === coluna);
        if (usuarioId) resultado = resultado.filter(t => t.usuarioId === parseInt(usuarioId));
        res.json(resultado);
    },

    estatisticas(req, res) {
        const estatisticas = tarefaModel.estatisticas();
        res.json(estatisticas);
    },

    resumo(req, res) {
        const resumo = tarefaModel.resumo();
        res.json(resumo);
    },

    //----------------------------------------
    // Rotas - get/:id
    //----------------------------------------
    buscarPorId(req, res) {
        const tarefa = tarefaModel.buscarPorId(parseInt(req.params.id));
        if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
        res.json(tarefa);
    },

    //----------------------------------------
    // Rotas - POST
    //----------------------------------------
    criar(req, res) {
        const {coluna, usuarioId } = req.body;
        if (usuarioId) {
            if (!usuarioModel.buscar(parseInt(usuarioId)))
                return res.status(400).json({ erro: 'Usuário não encontrado' });

            if (coluna === 'andamento' &&
                tarefaModel.contarEmAndamentoPorUsuario(parseInt(usuarioId)) >= 2)
                return res.status(400).json({
                    erro: 'Limite de 2 tarefas em andamento por usuário atingido',
                });
        }
        res.status(201).json(tarefaModel.adicionar(req.body));
    },

    //----------------------------------------
    // Rotas - PUT
    //----------------------------------------
    atualizar(req, res) {
        const id = parseInt(req.params.id);
        const atualizada = tarefaModel.atualizar(id, req.body);
        if (!atualizada) return res.status(404).json({ erro: 'Tarefa não encontrada' });
        res.json(atualizada);
    },

    //----------------------------------------
    // Rotas - DELETE
    //----------------------------------------
    remover(req, res) {
        const removida = tarefaModel.remover(parseInt(req.params.id));

        if (!removida) {
            return res.status(404).json({ erro: 'Tarefa não encontrada' });
        }

        res.json({ mensagem: 'Tarefa removida', tarefa: removida });
    },
};

module.exports = tarefasController;