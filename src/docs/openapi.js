const prioridades = require('./prioridades.docs');
const projetos = require('./projetos.docs');
const usuarios = require('./usuarios.docs');
const auth = require('./auth.docs');
const tarefas = require('./tarefas.docs');
const comum = require('./comum');


module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'TaskFlow API',
        version: '1.0.0',
        description: 'API do TaskFlow - SENAI CTGAS-ER',
    },
    servers: [{ url: '/', description: 'Este servidor' }],
    security: [{ bearerAuth: [] }],

    paths: { ...tarefas.paths, ...prioridades.paths, ...projetos.paths, ...usuarios.paths, ...auth.paths },

    components: {
        schemas: { ...comum.schemas, ...tarefas.schemas, ...projetos.schemas, ...usuarios.schemas, ...prioridades.schemas, ...auth.schemas },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};