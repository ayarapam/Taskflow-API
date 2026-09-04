//----------------------------------------
// variáveis
//----------------------------------------
let projetos = [
    { id: 1, nome: 'Projeto 1', descricao: 'Descrição do Projeto 1', ativo: true },
    { id: 2, nome: 'Projeto 2', descricao: 'Descrição do Projeto 2', ativo: false },
    { id: 3, nome: 'Projeto 3', descricao: 'Descrição do Projeto 3', ativo: true },
];
let proximoId = 4;

module.exports = {
    listar: () => projetos,
    buscarPorId: (id) => projetos.find(p => p.id === id),
    adicionar: (nome, descricao, ativo) => {
        console.log('ativo:', ativo);
        const novoProjeto = {
            id: proximoId++,
            nome,
            descricao,
            ativo: ativo ?? true
        };
        projetos.push(novoProjeto);
        return novoProjeto;
    },
    atualizar: (id, dados) => {
        const idx = projetos.findIndex(p => p.id === id);
        if (idx === -1) return null;
        projetos[idx] = { ...projetos[idx], ...dados, id };
        return projetos[idx];
    },
    remover: (id) => {
        const idx = projetos.findIndex(p => p.id === id);
        if (idx === -1) return null;
        return projetos.splice(idx, 1)[0];
    }
};