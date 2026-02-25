const db = require('../config/db');

const obtenerCafeterias = (req, res) => {
    db.query('SELECT * FROM cafeterias', (err, cafeterias) => {
        if (err) return res.status(500).json({ error: 'Error en base de datos' });
        
        db.query('SELECT * FROM resenas', (err, resenas) => {
            if (err) return res.status(500).json({ error: 'Error en base de datos' });

            const resultado = cafeterias.map(cafe => {
                const resenasCafe = resenas.filter(r => r.cafeteria_id === cafe.id);
                
                const suma = resenasCafe.reduce((acc, r) => acc + r.calificacion, 0);
                const promedio = resenasCafe.length ? (suma / resenasCafe.length).toFixed(1) : 0;
                
                return {
                    ...cafe,
                    promedio,
                    lista_resenas: resenasCafe
                };
            });
            
            res.json(resultado);
        });
    });
};

const agregarCafeteria = (req, res) => {
    const { nombre, direccion, especialidad, imagen_url } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

    db.query('INSERT INTO cafeterias (nombre, direccion, especialidad, imagen_url) VALUES (?, ?, ?, ?)', 
    [nombre, direccion, especialidad, imagen_url || null], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al agregar' });
        res.status(201).json({ mensaje: 'Cafetería agregada', id: result.insertId });
    });
};

const actualizarCafeteria = (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, especialidad, imagen_url } = req.body;
    db.query('UPDATE cafeterias SET nombre = ?, direccion = ?, especialidad = ?, imagen_url = ? WHERE id = ?', 
    [nombre, direccion, especialidad, imagen_url || null, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar' });
        res.json({ mensaje: 'Cafetería actualizada' });
    });
};

const eliminarCafeteria = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM cafeterias WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar' });
        res.json({ mensaje: 'Cafetería eliminada' });
    });
};

const agregarResena = (req, res) => {
    const { cafeteria_id, calificacion, comentario } = req.body;
    const usuario_id = req.usuario.id;

    if (!calificacion || calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ error: 'Calificación inválida (1-5)' });
    }

    db.query('INSERT INTO resenas (usuario_id, cafeteria_id, calificacion, comentario) VALUES (?, ?, ?, ?)',
    [usuario_id, cafeteria_id, calificacion, comentario], (err) => {
        if (err) return res.status(500).json({ error: 'Error al guardar reseña' });
        res.status(201).json({ mensaje: 'Reseña agregada exitosamente' });
    });
};

module.exports = { obtenerCafeterias, agregarCafeteria, actualizarCafeteria, eliminarCafeteria, agregarResena };