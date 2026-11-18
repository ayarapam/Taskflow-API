
//const { buscarPorId } = require('../controllers/tarefas.controller');
const pool = require('../database/db');
const prisma = require('../database/prisma');

// const incluirNomes = {
//     tarefas: { select: { texto: true } },
//     projetos: { select: { nome: true } },
// };

// function formatarUsuario(usuario) {
//     const { tarefas, projetos, ...resto } = usuario;
//     return {
//         ...resto,
//         tarefa: tarefas?.texto,
//         projeto: projetos?.nome
//     };
// };


module.exports = {
    listar: async () => {
        // const result = await pool.query('SELECT * FROM usuarios');
        // return result.rows;

        const lista = await prisma.usuarios.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
            },
            orderBy: { id: 'asc' },
        });
        return lista;
    },


    buscar: async (id) => {
        // const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        // return result.rows[0] || null;
        const usuario = await prisma.usuarios.findUnique({
            where: { id: id },
            select: {
                id: true,
                nome: true,
                email: true,
                //include: incluirNomes,
            },
        });
        return usuario //? formatarUsuario(usuario) : null;
    },

    buscarPorEmail: async (email) => {
        const result = await pool.query('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1', [email]);
        return result.rows[0] || null;
    },

    buscarPorNome: async (nome) => {
        const result = await pool.query('SELECT * FROM usuarios WHERE nome = $1', [nome]);
        return result.rows[0] || null;
    },
    adicionar: async ({ nome, email, senha_hash }) => {
        // const result = await pool.query(
        //     'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
        //     [nome, email, senha_hash]
        // );
        // return result.rows[0];
        const result = await prisma.usuarios.create({
            data: {
                nome: nome,
                email: email,
                senha_hash: senha_hash,

            },
        });
        return result;
    },

    atualizar: async (id, dados) => {
        // const { nome, email, senha_hash } = dados;
        // const result = await pool.query(
        //     'UPDATE usuarios SET nome=$1, email=$2, senha_hash=$3 WHERE id=$4 RETURNING id, nome, email',
        //     [nome, email, senha_hash, id]
        // );
        // return result.rows[0] || null;
        const usuario = await prisma.usuarios.update({
            where: { id },
            data: {
                nome: dados.nome,
                email: dados.email,
                senha_hash: dados.senha_hash,
            },
        });
        return usuario;
    },

    remover: async (id) => {
        // const result = await pool.query('DELETE FROM usuarios WHERE id=$1 RETURNING id, nome, email', [id]);
        // return result.rows[0] || null;
        try {
            const usuario = await prisma.usuarios.delete({
                where: { id: id },
            });
            return usuario;

        } catch (erro) {
            if (erro.code === 'P2025'){
                return null;
            }
            throw erro;
        }
    }
}



