const usuarioModel = require('../models/usuario.model');
const tarefaModel = require('../models/tarefa.model');
const criarErro = require('../utils/criarErro');

//----------------------------------------
// controller
//----------------------------------------
const usuariosController = {

    //----------------------------------------
    // Rotas - get
    //----------------------------------------
    async listar(req, res) {
        const { nome } = req.query;
        let resultado = nome
            ? await usuarioModel.listarPorNome(nome)
            : await usuarioModel.listar();
        res.json(resultado);
    },

    //----------------------------------------
    // Rotas/:id
    //----------------------------------------
    async buscarPorId(req, res) {
        const usuario = await usuarioModel.buscar(parseInt(req.params.id));

        if (!usuario)
            throw criarErro(404, 'Usuário não encontrado');
        res.json(usuario);
    },

    //----------------------------------------
    // Rotas - post
    //----------------------------------------
    async criar(req, res) {
        const { nome, email, senha_hash } = req.body;
        if (await usuarioModel.buscarPorEmail(email))
            throw criarErro(400, 'Email já cadastrado');
        res.status(201).json(await usuarioModel.adicionar({ nome, email, senha_hash }));
    },

    //----------------------------------------
    // Rotas - put
    //----------------------------------------
    async atualizar(req, res) {
        const atualizado = await usuarioModel.atualizar(parseInt(req.params.id), req.body);
        if (!atualizado) throw criarErro(404, 'Usuário não encontrado');
        res.json(atualizado);
    },

    //----------------------------------------
    // Rotas - delete
    //----------------------------------------
    async remover(req, res) {
        const id = parseInt(req.params.id);

        const removido = await usuarioModel.remover(id);
        if (!removido) throw criarErro(404, 'Usuário não encontrado');
        if (await tarefaModel.contarPorUsuario(id) > 0) {
            throw criarErro(400, 'Não é possível remover usuário com tarefas associadas');
        }
        res.json({ mensagem: 'Usuário removido', usuario: removido });
    },
}

module.exports = usuariosController;