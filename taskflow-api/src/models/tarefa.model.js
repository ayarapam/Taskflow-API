const pool = require('../database/db');

module.exports = {

    listar: async () => {
        const result = await pool.query(
            'SELECT * FROM tarefas ORDER BY id'
        );
        return result.rows;
    },
    listarPorColuna: (coluna) => tarefas.filter(t => t.coluna === coluna),
    listarPorUsuario: (usuario_id) => tarefas.filter(t => t.usuario_id === usuario_id),
    listarPorProjeto: (projeto_id) => tarefas.filter(t => t.projeto_id === projeto_id),
    buscarPorId: async (id) => {
        const result = await pool.query(
            'SELECT * FROM tarefas WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    },
    adicionar: async ({ texto, idprioridade, coluna, usuario_id, projeto_id, ordem }) => {
        const result = await pool.query(
            'INSERT INTO tarefas (texto,idprioridade,coluna,usuario_id,projeto_id,ordem) VALUES ($1,$2,$3,$4,$5,$6)RETURNING *',
            [texto, idprioridade || 2, coluna || 'afazer', usuario_id, projeto_id, ordem || 0]
        );
        return result.rows[0];
    },

    contarEmAndamentoPorUsuario: (usuario_id, excluir_id) =>
        tarefas.filter(t =>
            t.usuario_id === usuario_id &&
            t.coluna === 'andamento' &&
            t.id !== excluir_id
        ).length,
    contarPorProjeto: (projeto_id) =>
        tarefas.filter(t => t.projeto_id === projeto_id).length,
    contarPorUsuario: (usuario_id) =>
        tarefas.filter(t => t.usuario_id === usuario_id).length,
    totalPorColuna: (lista) => ({
        afazer: lista.filter(t => t.coluna === 'afazer').length,
        andamento: lista.filter(t => t.coluna === 'andamento').length,
        concluido: lista.filter(t => t.coluna === 'concluido').length,
    }),
    // estatisticas: () => {
    //     const totalTarefa = tarefas.length;
    //     const porColuna = {
    //         afazer: tarefas.filter(t => t.coluna === 'afazer').length,
    //         andamento: tarefas.filter(t => t.coluna === 'andamento').length,
    //         concluido: tarefas.filter(t => t.coluna === 'concluido').length
    //     };
    //     const porPrioridade = {
    //         baixa: tarefas.filter(t => t.prioridade === 'baixa').length,
    //         media: tarefas.filter(t => t.prioridade === 'media').length,
    //         alta: tarefas.filter(t => t.prioridade === 'alta').length
    //     }
    //     const comMaisTarefas = Object.entries(porColuna).sort((a, b) => b[1])[0][0];
    //     return {
    //         totalTarefa,
    //         porColuna,
    //         porPrioridade,
    //         'Mais tarefas': comMaisTarefas
    //     };
    // },
    // resumo: () => {
    //     const total = tarefas.length;
    //     const afazer = tarefas.filter(t => t.coluna === 'afazer').length
    //     const andamento = tarefas.filter(t => t.coluna === 'andamento').length
    //     const concluido = tarefas.filter(t => t.coluna === 'concluido').length
    //     const prioridades = {
    //         baixa: tarefas.filter(t => t.prioridade === 'baixa').length,
    //         media: tarefas.filter(t => t.prioridade === 'media').length,
    //         alta: tarefas.filter(t => t.prioridade === 'alta').length
    //     };
    //     const prioridadeComun = Object.entries(prioridades).sort((a, b) => b[1] - a[1])[0][0];
    //     return `Você tem ${total} tarefa(s): ${concluido} conluída(s), ${andamento} em adamento e ${afazer} a fazer. Prioridade mais comum: ${prioridadeComun}`;
    // },

    atualizar: async (id, dados) => {
        const { texto, prioridade, coluna, usuario_id } = dados;
        const result = await pool.query(
            'UPDATE tarefas SET texto=$1,prioridade=$2,coluna=$3,usuario_id=$4 WHERE id=$5 RETURNING *',
            [texto, prioridade, coluna, usuario_id, id]
        );
        return result.rows[0] || null;
    },
    remover: async (id) => {
        const result = await pool.query('DELETE FROM tarefas WHERE id=$1 RETURNING *', [id]);
        return result.rows[0] || null;
    },

};