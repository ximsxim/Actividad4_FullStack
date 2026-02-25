const express = require('express');
const router = express.Router();
const { verificarAdmin, verificarUsuario } = require('../middlewares/authMiddleware');
const { obtenerCafeterias, agregarCafeteria, actualizarCafeteria, eliminarCafeteria, agregarResena } = require('../controllers/cafeteriasController');

router.get('/', obtenerCafeterias);
router.post('/', verificarAdmin, agregarCafeteria);
router.put('/:id', verificarAdmin, actualizarCafeteria);
router.delete('/:id', verificarAdmin, eliminarCafeteria);

// Ruta para reseñas
router.post('/resenas', verificarUsuario, agregarResena);

module.exports = router;