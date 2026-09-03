//----------------------------------------
// VARIAVEIS
//----------------------------------------
let usuarios = [
    {
        id: 1,
        nome: 'admin',
        email: 'admin@taskflow.com',
        senha: '1234'
    },
    {
        id: 2,
        nome: 'ayara',
        email: 'yaya@taskflow.com',
        senha: '1234'
    },
];
let proximoIdUsuario = 3;

//----------------------------------------
// controller
//----------------------------------------
const usuariosController = {

    //----------------------------------------
    // Rotas - get
    //----------------------------------------
    listar(req, res) {
        res.json(usuarios);
    },

    //----------------------------------------
    // Rotas/:id
    //----------------------------------------
    buscarPorId(req, res) {
        const usuario = usuarios.find(u => u.id === Number(req.params.id));

        if (!usuario) 
            return res.status(404).json({ erro: 'Usuário não encontrada' });
       
        res.json(usuario);
    },

    //----------------------------------------
    // Rotas - post
    //----------------------------------------
    criar(req, res) {
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ erro: 'Todos os campos sâo obrigatorios' })
        }

        if (usuarios.find(u => u.email === email))
            return res.status(400).json({ erro: 'Email já cadastrado' });

        const novousuario = {
            id: proximoIdUsuario++,
            nome,
            email,
        };

        usuarios.push(novousuario);

        res.status(201).json(novousuario);
    },

    //----------------------------------------
    // Rotas - put
    //----------------------------------------
    atualizar(req, res) {
        const id = Number(req.params.id);
        const idx = usuarios.findIndex(u => u.id === id);
        const emailEx = usuarios.find(u => u.email === req.body.email && u.id !== id)

        if (emailEx) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        if (idx === -1) return res.status(404).json({ erro: 'Usuario não encontrado' });
        usuarios[idx] = { id, ...req.body };
        res.json(usuarios[idx]);

    },

    //----------------------------------------
    // Rotas - delete
    //----------------------------------------
    remover(req, res) {
        const idx = usuarios.findIndex(u => u.id === parseInt(req.params.id));
        if (idx === -1) return res.status(404).json({ erro: 'Usuario não encontrado' });
        const usuarioRemovido = usuarios.splice(idx, 1)[0];
        const {senha, ...usuarioSemSenha} = usuarioRemovido;
        res.json({ mensagem: 'Usuario removida', usuario: usuarioSemSenha });
    },
}

module.exports = usuariosController;