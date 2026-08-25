//----------------------------------------
// criando seu próprio módulo - Função somar
//----------------------------------------
// require('./calcular') retorna o que calcular.js exportou
const somar = require('./calcular');
// Usar a função importada normalmente:
console.log(somar(2, 3)); // 5
console.log(somar(10, 7)); // 17
// Rodar no terminal:
// node app.js

//----------------------------------------
// module.exports — exportar múltiplas funções
//----------------------------------------

const tarefasUtils = require('./utils/tarefas');
// Destructuring — extrair funções do objeto:
const { listarTodas, adicionar } = require('./utils/tarefas');

adicionar({ id: 1, texto: 'Estudar Node', coluna: 'afazer' });
console.log(listarTodas()); 
// [{ id: 1, texto: 'Estudar Node', ... }]

