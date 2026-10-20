const pool = require('../database/db');

module.exports = {
    listar: async () => {
        const result = await pool.query('SELECT * FROM prioridades');
        return result.rows;
    },      
}