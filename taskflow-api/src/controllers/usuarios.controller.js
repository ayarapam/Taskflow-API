const usuarioModel = require('../models/usuario.model');
const tarefaModel = require('../models/tarefa.model');

//----------------------------------------
// controller
//----------------------------------------
const usuariosController = {

    //----------------------------------------
    // Rotas - get
    //----------------------------------------
    listar(req, res) {
        res.json(usuarioModel.listar());
    },

    //----------------------------------------
    // Rotas/:id
    //----------------------------------------
    buscarPorId(req, res) {
        const usuario = usuarioModel.buscarPorId(Number(req.params.id));

        if (!usuario) 
            return res.status(404).json({ erro: 'Usuário não encontrado' });
       
        res.json(usuario);
    },

    //----------------------------------------
    // Rotas - post
    //----------------------------------------
    criar(req, res) {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Todos os campos sâo obrigatorios' })
        }
        if (usuarioModel.buscarPorEmail(email))
            return res.status(400).json({ erro: 'Email já cadastrado' });
        res.status(201).json(usuarioModel.adicionar({ nome, email, senha }));
    },

    //----------------------------------------
    // Rotas - put
    //----------------------------------------
    atualizar(req, res) {
        const id = Number(req.params.id);

        if (!usuarioModel.buscarPorId(id)) {
            return res.status(404).json({ erro: 'Usuario não encontrado' });
        }

        if (usuarioModel.buscarPorEmail(req.body.email, id)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const usuarioAtualizado = usuarioModel.atualizar(id, req.body);

        res.json(usuarioAtualizado);
    },

    //----------------------------------------
    // Rotas - delete
    //----------------------------------------
    remover(req, res) {
        const usuario = usuarioModel.buscarPorId(Number(req.params.id));
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuario não encontrado' });
        }

        if (tarefaModel.contarPorUsuario(id) > 0) {
            return res.status(400).json({ erro: 'Não é possível remover usuário com tarefas associadas' });
        }
        
        const usuarioRemovido = usuarioModel.remover(Number(req.params.id));
        const {senha, ...usuarioSemSenha} = usuarioRemovido;
        res.json({ mensagem: 'Usuario removida', usuario: usuarioSemSenha });
    },
}

module.exports = usuariosController;