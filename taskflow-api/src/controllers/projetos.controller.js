const projetoModel = require('../models/projetos.model');
const tarefaModel = require('../models/tarefa.model');
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
        const projetos = await projetoModel.listar();
        res.json(projetos.map((projeto) => ({
            ...projeto,
            podeEditar: Number(projeto.usuario_id) === Number(req.usuario.id),
        })));
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
    const { nome, descricao, usuario_id } = req.body;

    if (!nome) {
        throw criarErro(400, 'Nome é obrigatório');
    }

    const projeto = await projetoModel.adicionar(
        nome,
        descricao,
        Number(req.usuario.id)
    );

    res.status(201).json(projeto);
},

    //----------------------------------------
    // rotas - put
    //----------------------------------------
    async atualizar(req, res) {
        const id = parseInt(req.params.id, 10);
        const projeto = await projetoModel.buscarPorId(id);

        if (!projeto) {
            throw criarErro(404, 'Projeto não encontrado');
        }

        if (Number(projeto.usuario_id) !== Number(req.usuario.id)) {
            throw criarErro(
                403,
                `Este projeto foi criado por ${projeto.usuario || 'outro usuário'}. Apenas quem criou pode editá-lo.`
            );
        }

        const atualizada = await projetoModel.atualizar(id, req.body);
        res.json({ ...atualizada, podeEditar: true });
    },

    //----------------------------------------
    // rotas - delete
    //----------------------------------------
    async remover(req, res) {
        const id = parseInt(req.params.id);

        if (!projetoModel.buscarPorId(id))
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