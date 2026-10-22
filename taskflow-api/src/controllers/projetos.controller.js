const projetoModel = require('../models/projetos.model');
const usuarioModel = require('../models/usuario.model');
const criarErro = require('../utils/criarErro');

//----------------------------------------
// Controller
//----------------------------------------
const projetosController = {

    //----------------------------------------
    // rotas - get
    //----------------------------------------
    async listar(req, res) {
        res.json(await projetoModel.listar());
    },

    //----------------------------------------
    // Rotas - get/:id
    //----------------------------------------
    async buscarPorId(req, res) {
        const projeto = await projetoModel.buscarPorId(parseInt(req.params.id));
        if (!projeto) {
            throw criarErro(404, 'Projeto não encontrado');
        }
        res.json(projeto);
    },

  async resumo(req, res) {
    const projeto = await projetoModel.buscar(parseInt(req.params.id));
    if (!projeto){
      throw criarErro(404, 'Projeto não encontrado');
    }
    const tarefas = await tarefaModel.listarPorProjeto(projeto.id);

    res.json({
      projeto,
      totalTarefas: tarefas.length,
      porColuna: await tarefaModel.totalPorColuna(tarefas),
    });
  },

    //----------------------------------------
    // rotas - post
    //----------------------------------------
    //vincular usuario com tarefa
    async criar(req, res) {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ erro: 'Nome é obrigatório' });
        }

        const projeto = await projetoModel.adicionar(req.body);
        res.status(201).json(projeto);
    },

    //----------------------------------------
    // rotas - put
    //----------------------------------------
    async atualizar(req, res) {
        const atualizada = await projetoModel.atualizar(parseInt(req.params.id), req.body);
        if (!atualizada) {
            throw criarErro(404, 'Projeto não encontrado');
        }
        res.json(atualizada);
    },

    //----------------------------------------
    // rotas - delete
    //----------------------------------------
    async remover(req, res) {
        const id = parseInt(req.params.id);

        if (!projetoModel.buscar(id))
            throw criarErro(404, 'Projeto não encontrado');

        if (tarefaModel.contarPorProjeto(id) > 0)
            throw criarErro(400,
                'Projeto possui tarefas associadas. Remova as tarefas antes de deletar o projeto.',
            );

        const removido = projetoModel.remover(id);
        res.json({ mensagem: 'Projeto removido', projeto: removido });
    },
};

module.exports = projetosController;