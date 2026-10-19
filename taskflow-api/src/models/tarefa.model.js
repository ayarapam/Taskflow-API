const pool = require('../database/db');

module.exports = {

    listar: async () => {
        const result = await pool.query(
            'SELECT * FROM tarefas ORDER BY id'
        );
        return result.rows;
    },

    // listarPorColuna: (coluna) => tarefas.filter(t => t.coluna === coluna),
    // listarPorUsuario: (usuario_id) => tarefas.filter(t => t.usuario_id === usuario_id),
    // listarPorProjeto: (projeto_id) => tarefas.filter(t => t.projeto_id === projeto_id),
    
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

    atualizar: async (id, dados) => {
        const tarefaAtual = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
        const concluidoEm = dados.coluna === 'concluido' ? new Date() : null;

        let iniciadoEm = tarefaAtual.rows[0].iniciada_em;

        if (tarefaAtual.rows[0].coluna === 'andamento' && dados.coluna === 'afazer') {
            iniciadoEm = null;
        } else if (tarefaAtual.rows[0].coluna === 'afazer' && dados.coluna === 'andamento') {
            iniciadoEm = new Date();
        };

        const result = await pool.query(
            `UPDATE tarefas SET 
                texto=$1,
                coluna=$2,
                usuario_id=$3,
                projeto_id=$4,
                idprioridade=$5,
                concluido_em=$6,
                iniciada_em=$7
            WHERE id=$8 
            RETURNING *`,
            [dados.texto, dados.coluna, dados.usuario_id, dados.projeto_id, dados.idprioridade, concluidoEm, iniciadoEm, id]
        );
        return result.rows[0] || null;
    },

    remover: async (id) => {
        const result = await pool.query('DELETE FROM tarefas WHERE id=$1 RETURNING *', [id]);
        return result.rows[0] || null;
    },

};