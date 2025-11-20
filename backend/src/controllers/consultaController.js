const { consultarBachilleratoMEC } = require('../services/puppeteerService');

/**
 * Controller para consultar bachillerato
 * Recebe o número de documento e opcionalmente a data de nascimento
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

    console.log(`📋 Iniciando consulta para documento: ${bachillerato}`);
    if (fechaNacimiento) {
      console.log(`📅 Data de nascimento: ${fechaNacimiento}`);
    }

    // Chama o serviço do Puppeteer
    const resultado = await consultarBachilleratoMEC(bachillerato, fechaNacimiento);

    // Retorna o resultado
    return res.status(200).json(resultado);

  } catch (error) {
    console.error('❌ Erro ao consultar bachillerato:', error);
    
    return res.status(500).json({
      error: 'Erro ao processar consulta',
      detalhes: error.message,
      status: 'ERROR'
    });
  }
}

module.exports = {
  consultarBachillerato
};
