//mensagem para o terminal
console.log('TaskFlow API — pronto para o Express!')

//----------------------------------------
// 1 . servidor com Express
//----------------------------------------
// 1. Importar o Express
const express = require('express');

// 2. Criar a aplicação Express
const app = express();

// 3. Definir a porta
const PORTA = 3000;

// 4. Primeira rota — GET /
app.get('/', (req, res) => {
    res.json({ mensagem: 'TaskFlow API funcionando!' });
});

// 5. Iniciar o servidor
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

// Rodar: npm run dev
// Terminal: Servidor rodando em http://localhost:3000

//----------------------------------------
// 2. desasfio para criar rota 
//----------------------------------------
// Outra rota
const tarefa = [{ id: 1, texto: 'Estudar Node', coluna: 'afazer' },];

// método caminho callback
app.get('/tarefa', (req, res) => {
    // | |
    // | res — objeto de resposta
    // req — objeto de requisição

    //para acessar o cabeçalho
    console.log(req.headers);

    console.log('baseUrl:', req.host);
    console.log('URL:', req.url);

    // res.json() envia JSON como resposta
    res.json(tarefa);
});

//----------------------------------------
// 2.1 rota com permissão de usuario
//----------------------------------------
// app.get('/tarefa', (req, res) => {
//     if(req.headers['tokenapi'] === '63d5d83b-7137-442e-9017-2dbf997c2871'){
//         res.json(tarefa);
//     } else {
//         res.status(401).json({erro: 'Acesso negado'})
//     }
// });


// req — o que veio do cliente:
// req.method → 'GET'
// req.url → '/tarefas
// req.headers → { accept: 'application/json', ... }
// res — como responder ao cliente:
// res.json(dados) → envia JSON (status 200)
// res.send('texto') → envia texto puro
// res.status(404).json({}) → status + JSON
//63d5d83b-7137-442e-9017-2dbf997c2871


//----------------------------------------
// 2.2 desasfio para criar rota e testar os metodos de retorno
//----------------------------------------

// res.json() — envia JSON com status 200
app.get('/ok', (req, res) => {
    res.json({ status: 'ok', dados: [1, 2, 3] });
});

// res.status().json() — status personalizado + JSON
app.get('/criado', (req, res) => {
    res.status(201).json({ mensagem: 'Criado com sucesso' });
});

// res.status().json() — erro com status 400
app.get('/erro', (req, res) => {
    res.status(400).json({ erro: 'Dados inválidos' });
});

// res.send() — envia texto puro (menos comum em APIs)
app.get('/texto', (req, res) => {
    res.send('Resposta em texto simples');
});

// Nunca chamar mais de um método res por rota!
// res.json() já encerra a resposta automaticamente

//----------------------------------------
// 3 . desasfio para criar rota /tarefas
//----------------------------------------
// Dados em memória — substitui o banco por enquanto
const tarefas = [
    { id: 1, texto: 'Estudar Node', prioridade: 'alta', coluna: 'afazer' },
    { id: 2, texto: 'Criar API', prioridade: 'alta', coluna: 'andamento' },
    { id: 3, texto: 'Testar Postman', prioridade: 'media', coluna: 'concluido' },
];

// :id é um parâmetro de rota — captura qualquer valor Exemplo:
// GET /tarefas/1 → req.params.id = '1'
// GET /tarefas/2 → req.params.id = '2'
app.get('/tarefas/:id', (req, res) => {

    // req.params.id chega como STRING — converter para número
    const id = Number(req.params.id);

    // Buscar a tarefa no array
    const tarefa = tarefas.find(t => t.id === id);

    // Se não encontrou — retornar 404
    if (!tarefa) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    // Se encontrou — retornar a tarefa
    res.json(tarefa)
});
// Testar no Postman:
// GET http://localhost:3000/tarefas/1 → tarefa com id 1
// GET http://localhost:3000/tarefas/99 → 404 Tarefa não encontrada

//params faz com que o id determine oque é aprensentado, 
// inves de ser fixo como '/' colocasse o : que vai significar paramentro 
// e atraves desse paramentro o resultado é adpatado

//----------------------------------------
// 3.1 req.query — filtrar tarefas
//----------------------------------------
//req.query captura os parâmetros da query string — os filtros passados na URL após o ?. 
// Não mudam a definição da rota, são opcionais e muito usados para filtros e buscas.

// A definição da rota não muda — query string é opcional
// GET /tarefas → retorna todas
// GET /tarefas?coluna=afazer → só as da coluna afazer
// GET /tarefas?prioridade=alta → só as de alta prioridade

app.get('/tarefas', (req, res) => {

    // req.query contém os filtros da URL
    const { coluna, prioridade } = req.query;
    //vai procurar valores que tenham o nome 'coluna' ou 'prioridade'

    // uma forma mais verbosa de executar, ditando uma por uma
    //const coluna = req.query['coluna']
    //const prioridade = req.query['prioridade']

    // Começar com todas as tarefas
    let resultado = tarefas; //caso fosse contastante não oderia funcianar por não ser flexivel, quando se é atribuidp mais de um vez

    // Filtrar por coluna se informado
    if (coluna) {
        resultado = resultado.filter(t => t.coluna === coluna);
    }

    // Filtrar por prioridade se informado
    if (prioridade) {
        resultado = resultado.filter(t => t.prioridade === prioridade);
    }

    res.json(resultado); // não posso ter mais de um renponse chamanddo mais de um loca
});
// req.query é um parametro de pergunta, 
// req.query = uma desconstrução,
// ela checa uma informação dentro do Json e apartir dela filtr
//--------------------------------------------
// 4 . Rota 404 — capturar rotas não encontradas
//--------------------------------------------
//O Express processa as rotas na ordem em que foram definidas. Se nenhuma rota corresponder à requisição, ela chega ao final do
//arquivo sem resposta. app.use() no final captura tudo que não foi tratado.

// Rota 404 — DEVE SER A ÚLTIMA
// app.use() captura QUALQUER método e QUALQUER caminho
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        metodo: req.method,
        caminho: req.url,
    });
});
// Testar no Postman:
// GET http://localhost:3000/qualquer-coisa → 404