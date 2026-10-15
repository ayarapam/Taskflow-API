const usuarioModel = require('../models/usuario.model');
const tarefaModel = require('../models/tarefa.model');

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
        const usuario = await usuarioModel.buscarPorId(Number(req.params.id));

        if (!usuario)
            return res.status(404).json({ erro: 'Usuário não encontrado' });

        res.json(usuario);
    },

    //----------------------------------------
    // Rotas - post
    //----------------------------------------
    async criar(req, res) {
        const { nome, email, senha_hash } = req.body;
        if (await usuarioModel.buscarPorEmail(email))
            return res.status(400).json({ erro: 'Email já cadastrado' });
        res.status(201).json(await usuarioModel.adicionar({ nome, email, senha_hash }));
    },

    //----------------------------------------
    // Rotas - put
    //----------------------------------------
    async atualizar(req, res) {
        const id = Number(req.params.id);

        if (!await usuarioModel.buscarPorId(id)) {
            return res.status(404).json({ erro: 'Usuario não encontrado' });
        }

        if (await usuarioModel.buscarPorEmail(req.body.email, id)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const usuarioAtualizado = await usuarioModel.atualizar(id, req.body);

        res.json(usuarioAtualizado);
    },

    //----------------------------------------
    // Rotas - delete
    //----------------------------------------
    async remover(req, res) {
        const usuario = await usuarioModel.buscarPorId(Number(req.params.id));
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuario não encontrado' });
        }

        if (await tarefaModel.contarPorUsuario(id) > 0) {
            return res.status(400).json({ erro: 'Não é possível remover usuário com tarefas associadas' });
        }

        const usuarioRemovido = await usuarioModel.remover(Number(req.params.id));
        const { senha, ...usuarioSemSenha } = usuarioRemovido;
        res.json({ mensagem: 'Usuario removida', usuario: usuarioSemSenha });
    },
}

module.exports = usuariosController;