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

    buscarPorId: async (id) => {
        const tarefa = await prisma.tarefas.findUnique({
            where: { id },
            include: incluirNomes,
        });
        return tarefa ? formatarTarefa(tarefa) : null;
    },

    adicionar: async ({
        texto,
        idprioridade,
        coluna,
        usuario_id,
        projeto_id,
        ordem,
    }) => {
        const result = await prisma.tarefas.create({
            data: {
                texto: texto,
                idprioridade: idprioridade || 2,
                coluna: coluna || "afazer",
                usuario_id: usuario_id,
                projeto_id: projeto_id,
                ordem: ordem || 0,
            },
            include: incluirNomes
        });
        return formatarTarefa(result);
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
        const tarefaAtual = await prisma.tarefas.findUnique({
            where: { id }
        });
        if (!tarefaAtual) return null;

        const finalizadaEm = dados.coluna === "concluido" ? new Date() : null;

        let iniciadaEm = tarefaAtual.iniciada_em;

        if (tarefaAtual.coluna === "andamento" && dados.coluna === "afazer") {
            iniciadaEm = null;
        } else if (
            tarefaAtual.coluna === "afazer" &&
            dados.coluna === "andamento"
        ) {
            iniciadaEm = new Date();
        }

        const tarefa = await prisma.tarefas.update({
            where: { id },
            data: {
                texto: dados.texto,
                coluna: dados.coluna,
                idprioridade: dados.idprioridade,
                usuario_id: dados.usuario_id,
                projeto_id: dados.projeto_id,
                iniciada_em: iniciadaEm,
                concluida_em: finalizadaEm,
            },
            include: incluirNomes,
        });

        return formatarTarefa(tarefa)
    },

    remover: async (id) => {
        try {
            const tarefa = await prisma.tarefas.delete({
                where: { id: id },
                include: incluirNomes,
            });
            return formatarTarefa(tarefa);

        } catch (erro) {
            if (erro.code === 'P2025'){
                return null;
            }
            throw erro;
        }
    },

};

module.exports = tarefaModel