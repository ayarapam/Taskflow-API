//----------------------------------------
// variáveis
//----------------------------------------
//const { buscarPorId } = require('../controllers/tarefas.controller');
//const pool = require('../database/db');
const prisma = require("../database/prisma")

const incluir = {
    tarefas: { select: { texto: true } },
    usuarios: { select: { nome: true } },
};

function formatarProjeto(projeto) {
    const { tarefas, usuarios, ...resto } = projeto;
    
    return {
        ...resto,
        status: projeto.ativo === false ? 'concluido' : 'ativo',
        tarefa: tarefas?.texto,
        usuario: usuarios?.nome,
    };

    
};

module.exports = {
    listar: async () => {
        const lista = await prisma.projetos.findMany({
            select: {
                id: true,
                nome: true,
                descricao: true,
                usuario_id: true,
                ativo: true,
                criado_em: true,
                ...incluir,
            },
            orderBy: { nome: 'asc' }
        })

        return lista.map(formatarProjeto);
    },


    buscarPorId: async (id) => {
        const projeto = await prisma.projetos.findUnique({
            where: { id: id },
            select: {
                id: true,
                nome: true,
                descricao: true,
                usuario_id: true,
                criado_em: true,
                ...incluir
            }
        }
        );
        return projeto ? formatarProjeto(projeto) : null;
    },

    adicionar: async (nome, descricao, usuario_id) => {
        // const result = await pool.query(
        //     'INSERT INTO projetos (nome, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *',
        //     [nome, descricao || null, usuario_id]
        // );
        // return result.rows[0];
        const projeto = await prisma.projetos.create({
            data: {
                nome,
                descricao: descricao || null,
                usuario_id
            },
            select: {
                id: true,
                nome: true,
                descricao: true,
                usuario_id: true,
                criado_em: true,
                ...incluir,
            }
        });
        return formatarProjeto(projeto);
    },

    atualizar: async (id, dados) => {
        const projeto = await prisma.projetos.update({
            where: { id: Number(id) },
            data: {
                nome: dados.nome,
                descricao: dados.descricao ?? null,
                ...(dados.status !== undefined ? { ativo: dados.status === 'ativo' } : {}),
            },
            select: {
                id: true,
                nome: true,
                descricao: true,
                usuario_id: true,
                ativo: true,
                criado_em: true,
                ...incluir,
            }
        });
        return formatarProjeto(projeto)
    },
    
    remover: async (id) => {
        try {
            const projeto = await prisma.projetos.delete({
                where: { id: id }
            });

            return formatarProjeto(projeto)
        } catch (erro) {
            if (erro.code === 'P2025')
                return null;
            throw erro;
        }
    },
};