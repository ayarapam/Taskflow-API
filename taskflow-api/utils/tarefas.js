//----------------------------------------
// module.exports — exportar múltiplas funções
//----------------------------------------
// utils/tarefas.js
// Dados em memória — array de tarefas
const tarefas = [];

function listarTodas() {
  return tarefas;
}
function buscarPorId(id) {
  return tarefas.find(t => t.id === id);
}
function adicionar(tarefa) {
  tarefas.push(tarefa);
  return tarefa;
}
// Exportar objeto com todas as funções:
module.exports = { listarTodas, buscarPorId, adicionar };

