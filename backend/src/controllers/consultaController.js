const { consultarBachilleratoMEC } = require('../services/puppeteerService');
const { gerarPDFBachillerato } = require('../services/pdfService');
const { gerarPDFCustomizado } = require('../services/pdfCustomService');

// Cache temporário de HTML (expira em 5 minutos)
const htmlCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Cache de dados da consulta para PDF customizado
const dadosCache = new Map();

/**
 * Controller para consulta de bachillerato
 * Usa Puppeteer para automação (site requer JavaScript)
 */
async function consultarBachillerato(req, res) {
  try {
    const { bachillerato, fechaNacimiento } = req.body;

    // Validação básica
    if (!bachillerato || bachillerato.trim() === '') {
      return res.status(400).json({
        error: 'Número de documento é obrigatório',
        status: 'ERROR'
      });
    }

    console.log(`📋 Consulta para: ${bachillerato}`);
    
    // PUPPETEER DESABILITADO - Servidor tem apenas 500MB RAM
    // Retorna resultado simulado para demonstração
    const resultado = {
      status: 'VALIDADO',
      mensagem: `Datos del Egresado\n\nConsulta realizada para documento ${bachillerato}\n\nNOTA: Sistema em modo demonstração. O servidor Oracle Free Tier (500MB RAM) não suporta automação com navegador. Para consultas reais, é necessário upgrade do servidor ou migração para outra plataforma.`,
      bachillerato,
      timestamp: new Date().toISOString()
    };

    // Salva dados para PDF customizado
    const cacheKey = `${bachillerato}_${fechaNacimiento || ''}`;
    dadosCache.set(cacheKey, {
      documento: bachillerato,
      fechaNacimiento: fechaNacimiento || '',
      mensagem: resultado.mensagem,
      timestamp: Date.now()
    });
    console.log(`💾 Dados salvos para PDF customizado (modo demo)`);

    return res.status(200).json(resultado);

  } catch (error) {
    console.error('❌ Erro na consulta:', error);
    
    return res.status(500).json({
      error: 'Erro ao processar consulta',
      detalhes: error.message,
      status: 'ERROR'
    });
  }
}

/**
 * 📄 Controller para geração de PDF
 * Usa Puppeteer apenas quando necessário
 * Retorna PDF em base64 para visualização
 */
async function gerarPDF(req, res) {
  try {
    const { bachillerato, fechaNacimiento } = req.body;

    // Validação básica
    if (!bachillerato || bachillerato.trim() === '') {
      return res.status(400).json({
        error: 'Número de documento é obrigatório',
        status: 'ERROR'
      });
    }

    console.log(`📄 Gerando PDF para: ${bachillerato}`);

    // Busca dados do cache
    const cacheKey = `${bachillerato}_${fechaNacimiento || ''}`;
    const cached = dadosCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      // Usa PDF customizado (INSTANTÂNEO - ~100ms)
      console.log('⚡ Gerando PDF customizado (sem Puppeteer) - INSTANTÂNEO!');
      const pdfBuffer = await gerarPDFCustomizado(cached);
      
      const pdfBase64 = pdfBuffer.toString('base64');
      
      return res.status(200).json({
        status: 'VALIDADO',
        pdfBase64,
        tamanho: `${(pdfBuffer.length / 1024).toFixed(2)} KB`,
        timestamp: new Date().toISOString(),
        metodo: 'customizado'
      });
    }
    
    // Se não tem cache, tenta usar HTML salvo (rápido)
    const htmlCached = htmlCache.get(cacheKey);
    let htmlSalvo = null;
    
    if (htmlCached && (Date.now() - htmlCached.timestamp < CACHE_TTL)) {
      htmlSalvo = htmlCached.html;
      console.log('⚡ Usando HTML do cache - Geração rápida!');
    }

    // Gera PDF usando Puppeteer (fallback - lento)
    console.log('⏳ Gerando PDF com Puppeteer (pode demorar 30s+)...');
    const pdfBuffer = await gerarPDFBachillerato(bachillerato, fechaNacimiento, htmlSalvo);

    // Converte para base64
    const pdfBase64 = pdfBuffer.toString('base64');

    // Retorna PDF em base64
    return res.status(200).json({
      status: 'VALIDADO',
      pdfBase64,
      tamanho: `${(pdfBuffer.length / 1024).toFixed(2)} KB`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    
    return res.status(500).json({
      error: 'Erro ao gerar PDF',
      detalhes: error.message,
      status: 'ERROR'
    });
  }
}

module.exports = {
  consultarBachillerato,
  gerarPDF
};
