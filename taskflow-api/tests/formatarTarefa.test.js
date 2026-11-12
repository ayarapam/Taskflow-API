const formatarTarefa = require('../src/utils/formatarTarefa');

function tarefaDoPrisma() {
    return {
        id: 1,
        texto: 'definir tabelas do banco',
        coluna: 'afazer',
        projetos: { nome: 'Taskflow' },
        usuarios: { nome: 'Ana lima' },
        prioridades: {
            descricao: 'Alta',
            cor: '#FF0000'
        }
    };
}

test('achata as relaçoes no formato que o front-end espera', () => {
    const resultado = formatarTarefa(tarefaDoPrisma());
    expect(resultado).toEqual({
        id: 1,
        texto: 'definir tabelas do banco',
        coluna: 'afazer',
        projeto: 'Taskflow',
        usuario: 'Ana lima',
        prioridade: 'Alta',
        prioridade_cor: '#FF0000'
    });
});

test('deixe o campo undefined quando a relação não estiver presente', () => {
    const tarefa = tarefaDoPrisma();
    delete tarefa.prioridades;
    const resultado = formatarTarefa(tarefa);
    expect(resultado.prioridade).toBeUndefined();
    expect(resultado.projeto).toBe('Taskflow');
});

test('não altere a tarefa original', () => {
    const tarefa = tarefaDoPrisma();
    const resultado = formatarTarefa(tarefa);
    expect(resultado).not.toBe(tarefa);
    expect(tarefa).toHaveProperty('projetos', { nome: 'Taskflow' });
});

test('lança TypeError se receber null', () => {
    expect(() => formatarTarefa(null)).toThrow(TypeError);
});