
console.log('TaskFlow API — pronto para o Express!')
require('dotenv').config();
const express = require('express');

//----------------------------------------
// rotas - controllers
//----------------------------------------
const tarefasRoutes = require('./src/routes/tarefas.routes.js');
const usuariosRoutes = require('./src/routes/usuarios.routes.js');
const projetosRoutes = require('./src/routes/projetos.routes.js');
const prioridadesRoutes = require('./src/routes/prioridades.routes.js');
const authRoutes = require('./src/routes/auth.routes.js')
const tratarErros = require('./src/middlewares/erro.middleware.js');
const autenticar = require('./src/middlewares/autenticar.js');
const logger = require('./src/middlewares/logger.js');
const validarContentType = require('./src/middlewares/validarContentType.js');
const temporizador = require('./src/middlewares/temporizador.js');
const criarErro = require("./src/utils/criarErro.js");
const cors = require('cors');


const swaggerUi = require('swagger-ui-express');
const SWAGGER_CDN =
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14';

const openapi = require('./src/docs/openapi.js');

//----------------------------------------
// Configuração do Express
//----------------------------------------
const app = express();

// //----------------------------------------
// // Config PORTA
// //----------------------------------------
// const PORTA = process.env.PORTA || 3000;

//----------------------------------------
// cors
//----------------------------------------
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
}));

//----------------------------------------
//
//----------------------------------------
app.use(express.json());

//----------------------------------------
// Middlewares
//----------------------------------------
app.use(validarContentType);
app.use(logger);
app.use(temporizador);


app.get('/', (req, res) => {
    res.json({ api: 'taskflow', versão: '1.0', status: 'online' });
});

//----------------------------------------
// Rotas
//----------------------------------------
app.use('/auth', authRoutes);
app.use('/tarefas', autenticar, tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', autenticar, projetosRoutes);
app.use('/prioridades', autenticar, prioridadesRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi, {
    customCssUrl: `${SWAGGER_CDN}/swagger-ui.css`,
    customJs: [
        `${SWAGGER_CDN}/swagger-ui-bundle.js`,
        `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`,
    ],
}));
//----------------------------------------
// Rota 404
//----------------------------------------
app.use((req, res) => {
    const rota = `${req.method} ${req.url}`;
    throw criarErro(404, `Rota não encontrada: ${rota}`);
});

//----------------------------------------
// middleware - Error
//----------------------------------------
app.use(tratarErros);

module.exports = app;
