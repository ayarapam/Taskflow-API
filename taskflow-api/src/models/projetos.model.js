//----------------------------------------
// variáveis
//----------------------------------------
const pool = require('../database/db');

module.exports = {
    listar: async () => {
        const result = await pool.query('SELECT * FROM projetos ORDER BY nome');
        return result.rows;
    },
    buscarPorId: async (id) => {
        const result = await pool.query('SELECT * FROM projetos WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    adicionar: async (nome, descricao, ativo, usuario_id) => {
        console.log('ativo:', ativo);
        const result = await pool.query(
            'INSERT INTO projetos (nome, descricao, ativo, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, descricao || null, usuario_id]
        );
        return result.rows[0];
    },
    atualizar: async (id, dados) => {
        const result = await pool.query(
            `UPDATE projetos SET
             nome       = COALESCE($1, nome),
             descricao  = COALESCE($2, descricao),
             usuario_id = COALESCE($3, usuario_id)
            WHERE id = $4
         RETURNING *`,
            [dados.nome, dados.descricao, dados.ativo, id]
        );
        return result.rows[0] || null;
    },
    remover: async (id) => {
        const result = await pool.query('DELETE FROM projetos WHERE id=$1 RETURNING *', [id]);
        return result.rows[0] || null;
    }
};