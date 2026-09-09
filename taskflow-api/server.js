
console.log('TaskFlow API — pronto para o Express!')

require('dotenv').config();
const express = require('express');

//----------------------------------------
// rotas - controllers
//----------------------------------------
const tarefasRoutes = require('./src/routes/tarefas.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const projetosRoutes = require('./src/routes/projetos.routes');
const logger = require('./src/middlewares/logger'); 
const validarContentType = require('./src/middlewares/validarContentType');
const temporizador = require('./src/middlewares/temporizador');
//const corsMiddlewares = require ('./src/middlewares/cors')

//----------------------------------------
// cors
//----------------------------------------
const cors = require('cors');

//----------------------------------------
// Configuração do Express
//----------------------------------------
const app = express();

//----------------------------------------
// Config PORTA
//----------------------------------------
const PORTA = process.env.PORTA || 3000;

//----------------------------------------
// cors
//----------------------------------------
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'https://www.google.com',
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
//app.use(corsMiddlewares);

//----------------------------------------
// Rotas
//----------------------------------------
app.use('/tarefas', tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', projetosRoutes);

//----------------------------------------
// Rota 404
//----------------------------------------
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        metodo: req.method,
        caminho: req.url,
    });
});

//----------------------------------------
// app.listen 
//----------------------------------------
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});