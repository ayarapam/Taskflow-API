//----------------------------------------
// variáveis
//----------------------------------------
let projetos = [
    { id: 1, nome: 'Projeto 1', descricao: 'Descrição do Projeto 1', ativo: true },
    { id: 2, nome: 'Projeto 2', descricao: 'Descrição do Projeto 2', ativo: false },
    { id: 3, nome: 'Projeto 3', descricao: 'Descrição do Projeto 3', ativo: true },
];
let proximoId = 4;

//----------------------------------------
// Controller
//----------------------------------------
const projetosController = {

//----------------------------------------
// rotas - get
//----------------------------------------
    listar (req, res) {
        res.json(projetos);
    },

//----------------------------------------
// Rotas - get/:id
//----------------------------------------
    buscarPorId (req, res){
        const { id } = req.params;
        const projeto = projetos.find(p => p.id === parseInt(id)); 

        if (!projeto) {
            return res.status(404).json({ erro: 'Projeto não encontrado' });
        }

        res.json(projeto);
    },
//----------------------------------------
// rotas - post
//----------------------------------------
    criar (req, res) {
        const { nome, descricao, ativo } = req.body;

        if (!nome) {
            return res.status(400).json({ erro: 'Nome é obrigatório' });
        }

        const novoProjeto = { 
            id: proximoId++, 
            nome, 
            descricao, 
            ativo: true 
        };

        projetos.push(novoProjeto);

        res.status(201).json(novoProjeto);
    },

//----------------------------------------
// rotas - put
//----------------------------------------
    atualizar (req, res) {
        const { id } = req.params;
        const { nome, descricao, ativo } = req.body;
        const indice = projetos.findIndex(p => p.id === parseInt(id));

        if (indice === -1) {
            return res.status(404).json({ erro: 'projeto não encontrado' });
        }

        const projetoAtualizado = { id, nome, descricao, ativo };
        projetos[indice] = projetoAtualizado;

        res.json(projetoAtualizado);
    },


//----------------------------------------
// rotas - delete
//----------------------------------------
    remover (req, res) {
        const id = Number(req.params.id);
        const indice = projetos.findIndex(p => p.id === parseInt(id));

        if (indice === -1) {
            return res.status(404).json({ erro: 'Projeto não encontrado' });
        }

        projetos.splice(indice, 1);
        res.json({ mensagem: 'Projeto removido com sucesso' });
    }

};

module.exports = projetosController;