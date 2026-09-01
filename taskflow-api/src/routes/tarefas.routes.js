//----------------------------------------
// servidor com Express
//----------------------------------------
const express = require('express');
const router = express.Router();

//----------------------------------------
// Variaveis
//----------------------------------------
let tarefas = [
    { id: 1, texto: 'Estudar Node', prioridade: 'alta', coluna: 'afazer' },
    { id: 2, texto: 'Criar API', prioridade: 'alta', coluna: 'andamento' },
    { id: 3, texto: 'Testar Postman', prioridade: 'media', coluna: 'concluido' },
];
let proximoId = 4;

//----------------------------------------
// Rotas - get
//----------------------------------------
router.get('/', (req, res) => {

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

router.get('/estatisticas', (req , res) => {
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

router.get('/estatisticas/resumo', (req, res) => {
     const total = tarefas.length;

     const afazer = tarefas.filter(t => t.coluna === 'afazer').length
     const andamento = tarefas.filter(t => t.coluna === 'andamento').length
     const concluido = tarefas.filter(t => t.coluna === 'concluido').length

     const prioridades = {
        baixa: tarefas.filter(t => t.prioridade === 'baixa').length,
        media: tarefas.filter(t => t.prioridade === 'media').length,
        alta: tarefas.filter(t => t.prioridade === 'alta').length
     };

     const prioridadeComun = Object.entries(prioridades).sort((a, b) => b[1] - a[1])[0][0];

     const resumo = `Você tem ${total} tarefa(s): ${concluido} conluída(s), ${andamento} em adamento e ${afazer} a fazer. Prioridade mais comum: ${prioridadeComun}`

     res.json({resumo});

});

//----------------------------------------
// Rotas/id
//----------------------------------------
router.get('/:id', (req, res) => {

    const id = Number(req.params.id);

    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    res.json(tarefa)
});

//----------------------------------------
// Rotas - POST
//----------------------------------------
router.post('/', (req, res) => {
    const { texto, prioridade, coluna, cidade } = req.body;

    if (!texto) return res.status(400).json({ erro: 'Texto obrigatório' });
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

//----------------------------------------
// Rotas - PUT
//----------------------------------------
router.put('/:id', (req, res) => {

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

//----------------------------------------
// Rotas - DELETE
//----------------------------------------
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    const removida = tarefas.splice(index, 1)[0];

    res.json({ mensagem: 'Tarefa removida', tarefa: removida });
});

//----------------------------------------
// Exportando o router
//----------------------------------------
module.exports = router;