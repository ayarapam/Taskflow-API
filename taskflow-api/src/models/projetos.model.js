//----------------------------------------
// variáveis
//----------------------------------------
const pool = require('../database/db');

module.exports = {
    listar: async () => {
        const result = await pool.query('SELECT * FROM projetos');
        return result.rows;
    },
    buscarPorId: async (id) => {
        const result = await pool.query('SELECT * FROM projetos WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    adicionar: async (nome, descricao, ativo) => {
        console.log('ativo:', ativo);
        const result = await pool.query(
            'INSERT INTO projetos (nome, descricao, ativo) VALUES ($1, $2, $3) RETURNING *',
            [nome, descricao, ativo ?? true]
        );
        return result.rows[0];
    },
    atualizar: async (id, dados) => {
        const result = await pool.query(
            'UPDATE projetos SET nome=$1, descricao=$2, ativo=$3 WHERE id=$4 RETURNING *',
            [dados.nome, dados.descricao, dados.ativo, id]
        );
        return result.rows[0] || null;
    },
    remover: async (id) => {
        const result = await pool.query('DELETE FROM projetos WHERE id=$1 RETURNING *', [id]);
        return result.rows[0] || null;
    }
};