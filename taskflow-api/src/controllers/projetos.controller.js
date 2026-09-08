const projetoModel = require('../models/projetos.model');
const usuarioModel = require('../models/usuario.model');

//----------------------------------------
// Controller
//----------------------------------------
const projetosController = {

    //----------------------------------------
    // rotas - get
    //----------------------------------------
    listar(req, res) {
        res.json(projetoModel.listar());
    },

    //----------------------------------------
    // Rotas - get/:id
    //----------------------------------------
    buscarPorId(req, res) {
        const projeto = projetoModel.buscarPorId(parseInt(req.params.id));
        if (!projeto) {
            return res.status(404).json({ erro: 'Projeto não encontrado' });
        }
        res.json(projeto);
    },

    resumo(req, res) {
        const projeto = projetoModel.buscar(parseInt(req.params.id));
        if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });

        const tarefas = tarefaModel.listarPorProjeto(projeto.id);

        res.json({
            projeto,
            totalTarefas: tarefas.length,
            porColuna: tarefaModel.totalPorColuna(tarefas),
        });
    },

    //----------------------------------------
    // rotas - post
    //----------------------------------------
    //vincular usuario com tarefa
    criar(req, res) {
        const { nome, descricao, ativo } = req.body;
        if (!nome) {
            return res.status(400).json({ erro: 'Nome é obrigatório' });
        }
        res.status(201).json(projetoModel.adicionar(nome, descricao, ativo));
    },

    //----------------------------------------
    // rotas - put
    //----------------------------------------
    atualizar(req, res) {
        const atualizada = projetoModel.atualizar(parseInt(req.params.id), req.body);
        if (!atualizada) {
            return res.status(404).json({ erro: 'Projeto não encontrado' });
        }
        res.json(atualizada);
    },

    //----------------------------------------
    // rotas - delete
    //----------------------------------------
    remover(req, res) {
        const id = parseInt(req.params.id);

        if (!projetoModel.buscar(id))
            return res.status(404).json({ erro: 'Projeto não encontrado' });

        if (tarefaModel.contarPorProjeto(id) > 0)
            return res.status(400).json({
                erro: 'Projeto possui tarefas associadas. Remova as tarefas antes de deletar o projeto.',
            });

        const removido = projetoModel.remover(id);
        res.json({ mensagem: 'Projeto removido', projeto: removido });
    },
};

module.exports = projetosController;