//----------------------------------------
// variáveis
//----------------------------------------
const { buscarPorId } = require('../controllers/tarefas.controller');
const pool = require('../database/db');
const prisma = require("../database/prisma")

const incluir = {
    tarefas: { select: { texto: true } },
    usuarios: { select: { nome: true } },
};

function formatarProjeto(projeto) {
    const { tarefas, usuarios, ...resto } = projeto;
    return {
        ...resto,
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
        const result = await prisma.projetos.create({
            data: {
                nome: nome,
                descricao: descricao || null,
                usuario_id: usuario_id
            }
        });
        return result;
    },
    atualizar: async (id, dados) => {
        // const result = await pool.query(
        //     `UPDATE projetos SET
        //      nome       = COALESCE($1, nome),
        //      descricao  = COALESCE($2, descricao),
        //      usuario_id = COALESCE($3, usuario_id)
        //     WHERE id = $4
        //  RETURNING *`,
        //     [dados.nome, dados.descricao, dados.ativo, id]
        // );
        // return result.rows[0] || null;
        const projeto = await prisma.projetos.update({
            where:{id:id},
            data: {
                nome: dados.nome,
                descricao: dados.descricao || null,
                usuario_id: Number(dados.usuario_id),
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