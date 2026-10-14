//----------------------------------------
// VARIAVEIS
//----------------------------------------
// let usuarios = [
//     {
//         id: 1,
//         nome: 'admin',
//         email: 'admin@gmail.com',
//         senha: '123456'
//     },
//     {
//         id: 2,
//         nome: 'ayara',
//         email: 'yaya@gmail.com',
//         senha: '123456'
//     },
// ];
// let proximoIdUsuario = 3;

module.exports = {
    listar: async () => {
        const result = await pool.query(
            'SELECT * FROM usuarios ORDER BY id'
        );
        return result.rows;
    },
    buscar: async (id) => {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    },
    buscarPorEmail: async (email) => {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    },
    buscarPorNome: async (nome) => {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE nome = $1',
            [nome]
        );
        return result.rows[0] || null;
    },
    adicionar: async ({ nome, email, senha }) => {
        const result = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1,$2,$3) RETURNING *',
            [nome, email, senha]
        );
        return result.rows[0];
    },
    atualizar: async (id, dados) => {
        const { nome, email, senha } = dados;
        const result = await pool.query(
            'UPDATE usuarios SET nome=$1,email=$2,senha=$3 WHERE id=$4 RETURNING *',
            [nome, email, senha, id]
        );
        return result.rows[0] || null;
    },
    remover: async (id) => {
        const result = await pool.query(
            'DELETE FROM usuarios WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0] || null;
    }

}



