// function validarContentType(req, res, next) {
//     const metodosComBody = ['POST', 'PUT', 'PATCH'];
//     if (metodosComBody.includes(req.method)) {
//         const contentType = req.headers['content-type'];
        
//         if (!contentType || !contentType.includes('application/json')) {
//             return res.status(415).json({
//                 erro: 'Content-Type inválido. Use: application/json',
//             });
//         }
//     }
//     next();
// }

// module.exports = validarContentType;


function validarContentType(req, res, next) {
    const metodosComBody = ['POST', 'PUT', 'PATCH'];

    if (metodosComBody.includes(req.method)) {
        const contentType = req.headers['content-type'] || '';

        const aceitaJson = contentType.includes('application/json');

        const aceitaArquivo = contentType.includes('multipart/form-data');

        if (!aceitaJson && !aceitaArquivo) {
            return res.status(415).json({
                erro: 'Content-Type inválido. Use application/json ou multipart/form-data.'
            });
        }
    }

    next();
}

module.exports = validarContentType;
