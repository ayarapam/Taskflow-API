//const { buscarPorId } = require('../controllers/usuarios.controller');
const pool = require('../database/db');
const prisma = require('../database/prisma');

const incluirNomes = {
    projetos: { select: { nome: true } },
    usuarios: { select: { nome: true } },
    prioridades: { select: { descricao: true, cor: true } },
};

function formatarTarefa(tarefa) {
    const { projetos, usuarios, prioridades, ...resto } = tarefa;
    return {
        ...resto,
        projeto: projetos?.nome,
        usuario: usuarios?.nome,
        prioridade: prioridades?.descricao,
        prioridade_cor: prioridades?.cor
    };
}

const tarefaModel = {

    listar: async () => {
        const lista = await prisma.tarefas.findMany({
            select: {
            id: true,
            texto: true,
            coluna: true,
            usuario_id: true,
            projeto_id: true,
            idprioridade: true,
            concluida_em: true,
            iniciada_em: true,
            ordem: true,
            ...incluirNomes,
            },
            orderBy: { id: 'asc' },
        });
        return lista.map(formatarTarefa);
    },

    // listar: async () => {
    //     const result = await prisma.tarefas.findMany({
    //         select: {
    //             id: true,
    //             texto: true,
    //             coluna: true,
    //             usuario_id: true,
    //             projeto_id: true,
    //             idprioridade: true,
    //             concluida_em: true,
    //             iniciada_em: true,
    //             ordem: true,
    //             prioridades: {
    //                 select: {
    //                     descricao: true,
    //                     cor: true
    //                 },
    //             },
    //             projetos: {
    //                 select: {
    //                     nome: true
    //                 }
    //             },
    //             usuarios: {
    //                 select: {
    //                     nome: true
    //                 }
    //             }
    //         },
    //         orderBy: { id: 'asc' }
    //     });
    //     return result;
    // },

    listarPorColuna: async (coluna) => {
        const result = await pool.query(
            'SELECT * FROM tarefas WHERE coluna = $1',
            [coluna]
        );
        return result.rows;
    },

    listarPorUsuario: async (usuarioId) => {
        const result = await pool.query(
            'SELECT * FROM tarefas WHERE usuario_id = $1',
            [usuarioId]
        );
        return result.rows;
    },

    listarPorProjeto: async (projetoId) => {
        const result = await pool.query(
            'SELECT * FROM tarefas WHERE projeto_id = $1',
            [projetoId]
        );
        return result.rows;
    },

    buscarPorId: async (id) =>{
        const tarefa = await prisma.tarefas.findUnique({
            where: {id},
            include: incluirNomes,
        });
        return tarefa ? formatarTarefa(tarefa) : null;
    },

    // buscarPorId: async (id) => {
    //     const result = await pool.query(
    //         `SELECT t.*, p.nome as projeto, u.nome as usuario, pr.descricao as prioridade, pr.cor as prioridade_cor FROM tarefas t
    //         inner join projetos p on t.projeto_id = p.id 
    //         inner join usuarios u on t.usuario_id = u.id 
    //         inner join prioridades pr on t.idprioridade = pr.id 
    //         WHERE t.id = $1`, [id]
    //     );
    //     return result.rows[0] || null;
    // },

    adicionar: async ({ texto, idprioridade, coluna, usuario_id, projeto_id, ordem }) => {
        const result = await pool.query(
            'INSERT INTO tarefas (texto,idprioridade,coluna,usuario_id,projeto_id,ordem) VALUES ($1,$2,$3,$4,$5,$6)RETURNING id',
            [texto, idprioridade || 2, coluna || 'afazer', usuario_id, projeto_id, ordem || 0]
        );
        return result.rows[0];
    },

    estatisticas: async (filtroColuna) => {
        const params = filtroColuna ? [filtroColuna] : [];
        const where = filtroColuna ? 'WHERE coluna = $1' : '';

        const total = await pool.query(
            `SELECT COUNT(*) AS total FROM tarefas ${where}`, params
        );
        const porColuna = await pool.query(
            `SELECT coluna, COUNT(*) AS total FROM tarefas ${where} GROUP BY coluna`, params
        );

        const totais = { afazer: 0, andamento: 0, concluido: 0 };
        porColuna.rows.forEach(r => { totais[r.coluna] = parseInt(r.total); });

        return {
            total: parseInt(total.rows[0].total),
            porColuna: totais,
        };
    },

    contarEmAndamentoPorUsuario: async (usuarioId, excluirId) => {
        const result = await pool.query(
            'SELECT COUNT(*) FROM tarefas WHERE usuario_id = $1 AND coluna = $2 AND id != $3',
            [usuarioId, 'andamento', excluirId]
        );
        return parseInt(result.rows[0].count);
    },
    contarPorProjeto: async (projetoId) => {
        const result = await pool.query(
            'SELECT COUNT(*) FROM tarefas WHERE projeto_id = $1',
            [projetoId]
        );
        return parseInt(result.rows[0].count);
    },
    contarPorUsuario: async (usuarioId) => {
        const result = await pool.query(
            'SELECT COUNT(*) FROM tarefas WHERE usuario_id = $1',
            [usuarioId]
        );
        return parseInt(result.rows[0].count);
    },
    totalPorColuna: (lista) => ({
        afazer: lista.filter(t => t.coluna === 'afazer').length,
        andamento: lista.filter(t => t.coluna === 'andamento').length,
        concluido: lista.filter(t => t.coluna === 'concluido').length,
    }),

    atualizar: async (id, dados) => {
        const resultadoAtual = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
        const tarefaAtual = resultadoAtual.rows[0];
        if (!tarefaAtual) return null;

        const concluidaEm = dados.coluna === 'concluido' ? new Date() : null;

        let iniciadaEm = tarefaAtual.iniciada_em;
        if (tarefaAtual.coluna === 'andamento' && dados.coluna === 'afazer') {
            iniciadaEm = null;
        } else if (tarefaAtual.coluna === 'afazer' && dados.coluna === 'andamento') {
            iniciadaEm = new Date();
        }

        await pool.query(
            `UPDATE tarefas SET
                texto        = $1,
                coluna       = $2,
                usuario_id   = $3,
                projeto_id   = $4,
                idprioridade = $5,
                concluida_em = $6,
                iniciada_em  = $7
            WHERE id = $8`,
            [dados.texto, dados.coluna, dados.usuario_id, dados.projeto_id,
            dados.idprioridade, concluidaEm, iniciadaEm, id]
        );

        return tarefaModel.buscarPorId(id);
    },

    remover: async (id) => {
        const result = await pool.query('DELETE FROM tarefas WHERE id=$1 RETURNING id', [id]);
        return result.rows[0] || null;
    },

};

module.exports = tarefaModel