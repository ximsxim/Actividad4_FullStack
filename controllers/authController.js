const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const hash = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, "usuario")';
    
    db.query(query, [nombre, email, hash], (err) => {
        if (err) return res.status(500).json({ error: 'El correo ya está registrado' });
        res.status(201).json({ mensaje: 'Usuario creado' });
    });
};

const loginUsuario = (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const match = await bcrypt.compare(password, results[0].password);
        if (!match) return res.status(401).json({ error: 'Password incorrecto' });

        const token = jwt.sign({ id: results[0].id, rol: results[0].rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};

module.exports = { registrarUsuario, loginUsuario };