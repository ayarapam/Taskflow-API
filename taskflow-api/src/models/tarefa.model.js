
let tarefas = [
    { id: 1, texto: 'Estudar Node', prioridade: 'alta', coluna: 'afazer' },
    { id: 2, texto: 'Criar API', prioridade: 'alta', coluna: 'andamento' },
    { id: 3, texto: 'Testar Postman', prioridade: 'media', coluna: 'concluido' },
];

let proximoId = 4;

module.exports = {
    listar: () => tarefas,
    listarPorColuna: (coluna) => tarefas.filter(t => t.coluna === coluna),
    listarPorUsuario: (usuarioId) => tarefas.filter(t => t.usuarioId === usuarioId),
    listarPorProjeto: (projetoId) => tarefas.filter(t => t.projetoId === projetoId),
    buscarPorId: (id) => tarefas.find(t => t.id === id),
    adicionar: (texto, prioridade, coluna, usuarioId) => {
        const novaTarefa = {
            id: proximoId++,
            texto,
            prioridade: prioridade || 'media',
            coluna: coluna || 'afazer',
            usuarioId: usuarioId || null
        };
        tarefas.push(novaTarefa);
        return novaTarefa;
    },
    contarEmAndamentoPorUsuario: (usuarioId, excluirId) =>
        tarefas.filter(t =>
            t.usuarioId === usuarioId &&
            t.coluna === 'andamento' &&
            t.id !== excluirId
        ).length,
    contarPorProjeto: (projetoId) =>
        tarefas.filter(t => t.projetoId === projetoId).length,
    contarPorUsuario: (usuarioId) =>
        tarefas.filter(t => t.usuarioId === usuarioId).length,
    totalPorColuna: (lista) => ({
        afazer: lista.filter(t => t.coluna === 'afazer').length,
        andamento: lista.filter(t => t.coluna === 'andamento').length,
        concluido: lista.filter(t => t.coluna === 'concluido').length,
    }),
    estatisticas: () => {
        const totalTarefa = tarefas.length;
        const porColuna = {
            afazer: tarefas.filter(t => t.coluna === 'afazer').length,
            andamento: tarefas.filter(t => t.coluna === 'andamento').length,
            concluido: tarefas.filter(t => t.coluna === 'concluido').length
        };
        const porPrioridade = {
            baixa: tarefas.filter(t => t.prioridade === 'baixa').length,
            media: tarefas.filter(t => t.prioridade === 'media').length,
            alta: tarefas.filter(t => t.prioridade === 'alta').length
        }
        const comMaisTarefas = Object.entries(porColuna).sort((a, b) => b[1])[0][0];
        return {
            totalTarefa,
            porColuna,
            porPrioridade,
            'Mais tarefas': comMaisTarefas
        };
    },
    resumo: () => {
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
        return `Você tem ${total} tarefa(s): ${concluido} conluída(s), ${andamento} em adamento e ${afazer} a fazer. Prioridade mais comum: ${prioridadeComun}`;
    },
    atualizar: (id, dados) => {
        const idx = tarefas.findIndex(t => t.id === id);
        if (idx === -1) return null;
        tarefas[idx] = { ...tarefas[idx], ...dados, id };
        return tarefas[idx];
    },
    remover: (id) => {
        const idx = tarefas.findIndex(t => t.id === id);
        if (idx === -1) return null;
        return tarefas.splice(idx, 1)[0];
    },

};