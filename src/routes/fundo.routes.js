
const express = require('express');
const multer = require('multer');

const {
    salvarFundo,
    buscarFundo,
    removerFundo
} = require('../controllers/fundoController');

const autenticar = require('../middlewares/autenticar');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, callback) => {
        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!tiposPermitidos.includes(file.mimetype)) {
            return callback(
                new Error('Formato de imagem não permitido.')
            );
        }

        callback(null, true);
    }
});

router.post(
    '/',
    autenticar,
    upload.single('imagem'),
    salvarFundo
);

router.get('/', autenticar, buscarFundo);

router.delete('/', autenticar, removerFundo);

module.exports = router;
