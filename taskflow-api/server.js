
console.log('TaskFlow API — pronto para o Express!')

//----------------------------------------
// servidor com Express
//----------------------------------------
const express = require('express');

//----------------------------------------
// Importar o router
//----------------------------------------
const tarefasRoutes = require('./src/routes/tarefas.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');

//----------------------------------------
// servidor com Expres
//----------------------------------------
const app = express();
const PORTA = 3000;
app.use(express.json());

//----------------------------------------
// rotas
//----------------------------------------
app.use('/tarefas', tarefasRoutes);
app.use('/usuarios', usuariosRoutes);

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