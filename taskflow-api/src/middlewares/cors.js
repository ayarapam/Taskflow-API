function corsMiddleware(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.google.com'); // Permitir apenas o domínio específico
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Cabeçalhos permitidos
    res.setHeader('Access-Control-Max-Age', '86400'); 

    if (req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }

    next();
}

module.exports = corsMiddleware;