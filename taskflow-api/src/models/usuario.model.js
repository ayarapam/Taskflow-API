
const pool = require('../database/db');

module.exports = {
    listar: async () => {
        const result = await pool.query('SELECT * FROM usuarios');
        return result.rows;
    },
    buscar: async (id) => {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    
    buscarPorEmail: async (email) => {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        return result.rows[0] || null;
    },

    buscarPorNome: async (nome) => {
        const result = await pool.query('SELECT * FROM usuarios WHERE nome = $1', [nome]);
        return result.rows[0] || null;
    },
    adicionar: async ({ nome, email, senha_hash }) => {
        const result = await pool.query(
            'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, senha_hash]
        );
        return result.rows[0];
    },
    atualizar: async (id, dados) => {
        const {nome, email, senha_hash} = dados;
        const result = await pool.query(
        'UPDATE usuarios SET nome=$1, email=$2, senha_hash=$3 WHERE id=$4 RETURNING *',
        [nome, email, senha_hash, id]
        );
        return result.rows[0] || null;
    },

    remover: async (id) => {
        const result = await pool.query('DELETE FROM usuarios WHERE id=$1 RETURNING *', [id]);
        return result.rows[0] || null;
    }
}



