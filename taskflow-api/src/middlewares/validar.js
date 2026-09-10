function validar(schema) {
    return function (req, res, next) {
        const erros = [];

        for (const campo in schema) {
            const regras = schema[campo];
            const valor = req.body[campo];
            const ausente = valor === undefined || valor === null || valor === '';

            if (regras.obrigatorio && ausente) {
                erros.push(`O campo '${campo}' é obrigatório`);
                continue; 
            }
            if (!ausente && regras.tipo && typeof valor !== regras.tipo) {
                erros.push(
                    `O campo '${campo}' deve ser do tipo ${regras.tipo}`
                );
            }
        }

        if (erros.length > 0)
            return res.status(400).json({ erros });
        next();
    };
}
module.exports = validar;
