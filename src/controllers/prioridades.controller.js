const prioridadesModel = require('../models/prioridades.model');

const prioridadesController = {
    async listar(req, res) {
        const resultado = await prioridadesModel.listar();
        res.json(resultado);
    }

}

module.exports = prioridadesController;