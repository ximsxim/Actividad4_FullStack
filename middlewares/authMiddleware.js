const jwt = require('jsonwebtoken');

const verificarAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ error: 'Token no proporcionado' });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });
        if (decoded.rol !== 'admin') return res.status(403).json({ error: 'Permisos insuficientes' });
        req.usuario = decoded;
        next();
    });
};

const verificarUsuario = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ error: 'Token no proporcionado' });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });
        req.usuario = decoded;
        next();
    });
};

module.exports = { verificarAdmin, verificarUsuario };