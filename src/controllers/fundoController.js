
const prisma = require('../database/prisma');

// Salvar ou atualizar imagem de fundo
async function salvarFundo(req, res) {
    try {
        const arquivo = req.file;

        if (!arquivo) {
            return res.status(400).json({
                erro: 'Selecione uma imagem.'
            });
        }

        const usuarioId = req.usuario.id;

        await prisma.fundos_usuario.upsert({
            where: {
                usuario_id: usuarioId
            },
            update: {
                imagem: arquivo.buffer,
                tipo_mime: arquivo.mimetype
            },
            create: {
                usuario_id: usuarioId,
                imagem: arquivo.buffer,
                tipo_mime: arquivo.mimetype
            }
        });

        return res.status(200).json({
            mensagem: 'Imagem de fundo atualizada!'
        });

    } catch (erro) {
        console.error('Erro ao salvar fundo:', erro);

        return res.status(500).json({
            erro: 'Erro ao salvar imagem de fundo.'
        });
    }
}

// Buscar imagem de fundo
async function buscarFundo(req, res) {
    try {
        const usuarioId = req.usuario.id;

        const fundo = await prisma.fundos_usuario.findUnique({
            where: {
                usuario_id: usuarioId
            }
        });

        if (!fundo) {
            return res.status(404).json({
                erro: 'Imagem de fundo não encontrada.'
            });
        }

        res.setHeader('Content-Type', fundo.tipo_mime);
        res.setHeader('Cache-Control', 'private, no-store');

        return res.send(Buffer.from(fundo.imagem));

    } catch (erro) {
        console.error('Erro ao buscar fundo:', erro);

        return res.status(500).json({
            erro: 'Erro ao buscar imagem de fundo.'
        });
    }
}

// Remover imagem de fundo
async function removerFundo(req, res) {
    try {
        const usuarioId = req.usuario.id;

        await prisma.fundos_usuario.deleteMany({
            where: {
                usuario_id: usuarioId
            }
        });

        return res.status(200).json({
            mensagem: 'Imagem de fundo removida!'
        });

    } catch (erro) {
        console.error('Erro ao remover fundo:', erro);

        return res.status(500).json({
            erro: 'Erro ao remover imagem de fundo.'
        });
    }
}

module.exports = {
    salvarFundo,
    buscarFundo,
    removerFundo
};
