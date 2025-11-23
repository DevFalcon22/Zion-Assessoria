const { consultarBachilleratoRapido } = require('../services/consultaService');
const { gerarPDFBachillerato } = require('../services/pdfService');

/**
 * ⚡ Controller para consulta RÁPIDA de bachillerato
 * Usa Axios + Cheerio (sem Puppeteer)
 * Retorna apenas dados JSON em ~1 segundo
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

    console.log(`📋 Consulta rápida para: ${bachillerato}`);
    if (fechaNacimiento) {
      console.log(`📅 Data de nascimento: ${fechaNacimiento}`);
    }

    // Chama serviço de consulta rápida (Axios + Cheerio)
    const resultado = await consultarBachilleratoRapido(bachillerato, fechaNacimiento);

    // Retorna JSON limpo e rápido
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

    // Gera PDF usando Puppeteer
    const pdfBuffer = await gerarPDFBachillerato(bachillerato, fechaNacimiento);

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
