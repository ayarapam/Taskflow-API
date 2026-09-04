const projetoModel = require('../models/projetos.model');
const usuarioModel = require('../models/usuario.model');

//----------------------------------------
// Controller
//----------------------------------------
const projetosController = {

//----------------------------------------
// rotas - get
//----------------------------------------
    listar (req, res) {
        const {nome} = req.query;
        let resultado = nome 
        ? projetoModel.listar().filter(p => p.nome.includes(nome)) 
        : projetoModel.listar();
        res.json(resultado);
    },

//----------------------------------------
// Rotas - get/:id
//----------------------------------------
    buscarPorId (req, res){
        const projeto = projetoModel.buscarPorId(parseInt(req.params.id));
        if (!projeto) {
            return res.status(404).json({ erro: 'Projeto não encontrado' });
        }
        res.json(projeto);
    },
//----------------------------------------
// rotas - post
//----------------------------------------
//vincular usuario com tarefa
    criar (req, res) {
        const {nome, descricao, ativo} = req.body;
        if (!nome) {
            return res.status(400).json({ erro: 'Nome é obrigatório' });
        }
        res.status(201).json(projetoModel.adicionar(nome, descricao, ativo));
    },

//----------------------------------------
// rotas - put
//----------------------------------------
    atualizar (req, res) {
        const atualizada = projetoModel.atualizar(parseInt(req.params.id), req.body);
        if (!atualizada) {
            return res.status(404).json({ erro: 'Projeto não encontrado' });
        }
        res.json(atualizada);
    },

//----------------------------------------
// rotas - delete
//----------------------------------------
    remover (req, res) {
        const removida = projetoModel.remover(parseInt(req.params.id));
        if (!removida) {
            return res.status(404).json({ erro: 'Projeto não encontrado' });
        }   
        res.json(removida);
    }
};

module.exports = projetosController;