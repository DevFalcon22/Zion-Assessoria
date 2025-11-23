const express = require('express');
const router = express.Router();
const { consultarBachillerato, gerarPDF } = require('../controllers/consultaController');

// ⚡ POST /api/consulta-bachillerato - Consulta rápida (Axios + Cheerio)
router.post('/consulta-bachillerato', consultarBachillerato);

// 📄 POST /api/gerar-pdf - Gera PDF com Puppeteer
router.post('/gerar-pdf', gerarPDF);

module.exports = router;
