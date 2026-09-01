
console.log('TaskFlow API — pronto para o Express!')

//----------------------------------------
// servidor com Express
//----------------------------------------
const express = require('express');

//----------------------------------------
// Importar o router
//----------------------------------------
const tarefasRoutes = require('./src/routes/tarefas.routes');

//----------------------------------------
// Importar o router
//----------------------------------------
const app = express();
const PORTA = 3000;
app.use(express.json());

//----------------------------------------
// rotas
//----------------------------------------
app.use('/tarefas', tarefasRoutes);

//----------------------------------------
// Variaveis
//----------------------------------------
const tarefa = [{ id: 1, texto: 'Estudar Node', coluna: 'afazer' },];

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
// Rotas
//----------------------------------------
app.get('/', (req, res) => {
    res.json({ mensagem: 'TaskFlow API funcionando!' });
});

app.get('/tarefa', (req, res) => {
    console.log(req.headers);
    console.log('baseUrl:', req.host);
    console.log('URL:', req.url);
    res.json(tarefa);
});

app.get('/ok', (req, res) => {
    res.json({ status: 'ok', dados: [1, 2, 3] });
});

app.get('/criado', (req, res) => {
    res.status(201).json({ mensagem: 'Criado com sucesso' });
});

app.get('/erro', (req, res) => {
    res.status(400).json({ erro: 'Dados inválidos' });
});

app.get('/texto', (req, res) => {
    res.send('Resposta em texto simples');
});

app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

app.get('/estatisticas', (req , res) => {
    const {coluna} = req.query

    let tarefasfilt = tarefas;

    if (coluna){
        tarefasfilt = tarefas.filter(t => t.coluna === coluna);
    }

    const totalTarefa = tarefas.length

    const porColuna = {
        afazer: tarefasfilt.filter(t => t.coluna === 'afazer').length,
        andamento: tarefasfilt.filter(t => t.coluna === 'andamento').length,
        concluido: tarefasfilt.filter(t => t.coluna === 'concluido').length
    };

    const porPrioridade = {
        baixa: tarefasfilt.filter(t => t.prioridade === 'baixa').length,
        media: tarefasfilt.filter(t => t.prioridade === 'media').length,
        alta: tarefasfilt.filter(t => t.prioridade === 'alta').length
    }

    const comMaisTarefas = Object.entries(porColuna).sort((a, b) => b[1])[0][0];

    res.json({
        totalTarefa,
        porColuna,
        porPrioridade,
        'Mais tarefas': comMaisTarefas
    });

})

app.get('/estatisticas/resumo', (req, res) => {
     const total = tarefas.length;

     const afazer = tarefas.filter(t => t.coluna === 'afazer').length
     const andamento = tarefas.filter(t => t.coluna === 'andamento').length
     const concluido = tarefas.filter(t => t.coluna === 'concluido').length

     const prioridades = {
        baixa: tarefas.filter(t => t.prioridade === 'baixa').length,
        media: tarefas.filter(t => t.prioridade === 'media').length,
        alta: tarefas.filter(t => t.prioridade === 'alta').length
     };

     const prioridadeComun = Object.entries(prioridades).sort((a, b) => b[1])[0][0];

     const resumo = `Você tem ${total} tarefa(s): ${concluido} conluída(s), ${andamento} em adamento e ${afazer} a fazer. Prioridade mais comum: ${prioridadeComun}`

     res.json({resumo});

});

//----------------------------------------
// Rotas/:id
//----------------------------------------

app.get('/usuarios/:id', (req, res) => {
    const usuario = usuarios.find(u => u.id === Number(req.params.id));
    if (!usuario) return res.status(404).json({ erro: 'Não encontrada' });
    res.json(usuario);
});

//----------------------------------------
// Rotas - post 
//----------------------------------------

app.post('/usuarios', (req, res) => {
    const {nome , email, senha} = req.body;

    if (!nome, !email, !senha){
        return res.status(400).json({ erro:'Todos os campos sâo obrigatorios'})
    }

    const emailEx = usuarios.find(u => u.email === email);

    if (emailEx) {
        return res.status(406).json({erro: 'Email já cadastrado'});
    }

    const novousuario = { 
        id: proximoIdUsuario++, 
        nome,
        email,
        senha
    };
    
    usuarios.push(novousuario);

    res.status(201).json(novousuario);
});

//----------------------------------------
// Rotas - put
//----------------------------------------

app.put('/usuarios/:id', (req, res) => {

    const id = Number(req.params.id);
    const idx = usuarios.findIndex(u => u.id === id);
    const emailEx = usuarios.find(u => u.email === req.body.email && u.id !== id)

    if (emailEx){
        return res.status(400).json({ erro:'Email já cadastrado'});
    }

    if (idx === -1) return res.status(404).json({ erro: 'Usuario não encontrado' });
    usuarios[idx] = { id, ...req.body };
    res.json(usuarios[idx]);

});

//----------------------------------------
// Rotas - delete
//----------------------------------------
app.delete('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!usuarios.find(u => u.id === id)) return res.status(404).json({ erro: 'Usuario não encontrado' });
    usuarios = usuarios.filter(u => u.id !== id);
    res.json({ mensagem: 'Usuario removida', id });
});

//----------------------------------------
// Rota 404
//----------------------------------------
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        metodo: req.method,
        caminho: req.url,
    });
});

//----------------------------------------
// app.listen 
//----------------------------------------
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
