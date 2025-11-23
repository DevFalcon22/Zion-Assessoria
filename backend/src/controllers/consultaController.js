const { consultarBachilleratoMEC } = require('../services/puppeteerService');
const { gerarPDFBachillerato } = require('../services/pdfService');

// Cache temporário de HTML (expira em 5 minutos)
const htmlCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

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
    if (fechaNacimiento) {
      console.log(`📅 Data de nascimento: ${fechaNacimiento}`);
    }

    // Chama serviço Puppeteer
    const resultado = await consultarBachilleratoMEC(bachillerato, fechaNacimiento);

    // Salva HTML no cache para geração rápida de PDF
    if (resultado.htmlCompleto) {
      const cacheKey = `${bachillerato}_${fechaNacimiento || ''}`;
      htmlCache.set(cacheKey, {
        html: resultado.htmlCompleto,
        timestamp: Date.now()
      });
      console.log(`💾 HTML salvo no cache: ${cacheKey}`);
      
      // Remove HTML do retorno (não enviar para frontend)
      delete resultado.htmlCompleto;
    }

    // Retorna resultado
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

    // Tenta buscar HTML do cache
    const cacheKey = `${bachillerato}_${fechaNacimiento || ''}`;
    const cached = htmlCache.get(cacheKey);
    
    let htmlSalvo = null;
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < CACHE_TTL) {
        htmlSalvo = cached.html;
        console.log(`⚡ Usando HTML do cache (${Math.round(age/1000)}s atrás) - Geração SUPER rápida!`);
      } else {
        htmlCache.delete(cacheKey);
        console.log('⏰ Cache expirado, fará nova consulta...');
      }
    }

    // Gera PDF usando Puppeteer (rápido se tem HTML, lento se não tem)
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
