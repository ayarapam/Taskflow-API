//----------------------------------------
// VARIAVEIS
//----------------------------------------
let usuarios = [
    {
        id: 1,
        nome: 'admin',
        email: 'admin@taskflow.com',
        senha: '1234'
    },
    {
        id: 2,
        nome: 'ayara',
        email: 'yaya@taskflow.com',
        senha: '1234'
    },
];
let proximoIdUsuario = 3;

module.exports = {
    listar: () => usuarios,
    buscarPorId: (id) => usuarios.find(u => u.id === id),
    buscarPorEmail: (email) => usuarios.find(u => u.email === email),
    buscarPorNome: (nome) => usuarios.find(u => u.nome === nome),
    adicionar: (nome, email, senha) => {
        const novoUsuario = { 
            id: proximoIdUsuario++, 
            nome, 
            email, 
            senha 
        };
        usuarios.push(novoUsuario);
        return novoUsuario;
    },
    atualizar: (id, dados) => {
        const idx = usuarios.findIndex(u => u.id === id);
        if (idx === -1) return null;
        usuarios[idx] = { id, ...dados };
        return usuarios[idx];
    },
    remover: (id) => {
        const idx = usuarios.findIndex(u => u.id === id);
        if (idx === -1) return null;
        return usuarios.splice(idx, 1)[0];
    }

}



