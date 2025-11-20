const express = require('express');
const router = express.Router();
const { consultarBachillerato } = require('../controllers/consultaController');

// POST /api/consulta-bachillerato
router.post('/consulta-bachillerato', consultarBachillerato);

module.exports = router;
