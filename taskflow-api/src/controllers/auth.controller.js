const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuario.model');
const criarErro = require('../utils/criarErro');

const authController = {

    async login(req, res) {
        const { email, senha_hash } = req.body;

        if (!email || !senha_hash)
            throw criarErro(400, 'Email e senha são obrigatórios');
        
        const usuario = await usuarioModel.buscarPorEmail(email);

        if (!usuario)
            throw criarErro(401, 'Credenciais inválidas');

        if (usuario.senha_hash !== senha_hash)
            throw criarErro(401, 'Credenciais inválidas');
    

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, usuario: { id: usuario.id, nome: usuario.nome } });
    },
};

module.exports = authController;