
console.log('TaskFlow API — pronto para o Express!')

//----------------------------------------
// servidor com Express
//----------------------------------------
const express = require('express');
const app = express();
const PORTA = 3000;
app.use(express.json());

//----------------------------------------
// Variaveis
//----------------------------------------
const tarefa = [{ id: 1, texto: 'Estudar Node', coluna: 'afazer' },];
let tarefas = [
    { id: 1, texto: 'Estudar Node', prioridade: 'alta', coluna: 'afazer' },
    { id: 2, texto: 'Criar API', prioridade: 'alta', coluna: 'andamento' },
    { id: 3, texto: 'Testar Postman', prioridade: 'media', coluna: 'concluido' },
];
let proximoId = 4;
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

app.get('/tarefas', (req, res) => {

    const { coluna, prioridade } = req.query;

    let resultado = tarefas; 
    if (coluna) {
        resultado = resultado.filter(t => t.coluna === coluna);
    }

    if (prioridade) {
        resultado = resultado.filter(t => t.prioridade === prioridade);
    }

    res.json(resultado); 
});

app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

//----------------------------------------
// Rotas/:id
//----------------------------------------
app.get('/tarefas/:id', (req, res) => {

    const id = Number(req.params.id);

    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    res.json(tarefa)
});

app.get('/usuarios/:id', (req, res) => {
    const usuario = usuarios.find(u => u.id === Number(req.params.id));
    if (!usuario) return res.status(404).json({ erro: 'Não encontrada' });
    res.json(usuario);
});

//----------------------------------------
// Rotas - post 
//----------------------------------------

app.post('/tarefas', (req, res) => {
    const { texto, prioridade, coluna, cidade } = req.body;

    const novaTarefa = {
        id: proximoId++,  
        texto: texto,
        prioridade: prioridade || 'media',  
        coluna: coluna || 'afazer',
        cidade: cidade || '',
    };

    tarefas.push(novaTarefa);

    res.status(201).json(novaTarefa);
});

app.post('/usuarios', (req, res) => {

    const novousuario = { id: proximoIdUsuario++, ...req.body };
    
    usuarios.push(novousuario);

    res.status(201).json(novousuario);
});

//----------------------------------------
// Rotas - put
//----------------------------------------

app.put('/tarefas/:id', (req, res) => {

    const id = Number(req.params.id);
    const { texto, prioridade, coluna, cidade } = req.body;

    const indice = tarefas.findIndex(t => t.id === id);

    if (indice === -1) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    const tarefaAtualizada = { id, texto, prioridade, coluna, cidade };
    tarefas[indice] = tarefaAtualizada;

    res.json(tarefaAtualizada);
});

app.put('/usuarios/:id', (req, res) => {

    const id = Number(req.params.id);
    const idx = usuarios.findIndex(u => u.id === id);

    if (idx === -1) return res.status(404).json({ erro: 'Usuario não encontrado' });
    usuarios[idx] = { id, ...req.body };
    res.json(usuarios[idx]);

});

//----------------------------------------
// Rotas - delete
//----------------------------------------

app.delete('/tarefas/:id', (req, res) => {
    const id = Number(req.params.id);

    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    tarefas = tarefas.filter(t => t.id !== id);

    res.json({ mensagem: 'Tarefa removida com sucesso', id });
});

app.delete('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!usuarios.find(u => u.id === id)) return res.status(404).json({ erro: 'Usuario não encontrado' });
    usuarios = usuarios.filter(u => u.id !== id);
    res.json({ mensagem: 'Usuario removida', id });
});

//----------------------------------------
// app.listen 
//----------------------------------------
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
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
