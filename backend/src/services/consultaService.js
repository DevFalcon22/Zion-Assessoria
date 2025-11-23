const https = require('https');
const { URLSearchParams } = require('url');
const cheerio = require('cheerio');

/**
 * ⚡ Serviço de consulta RÁPIDA (sem Puppeteer)
 * Usa HTTPS nativo + Cheerio para extrair dados da página do MEC-PY
 */

const CONFIG = {
  URL_BASE: 'https://tramites.mec.gov.py/gestion_tramites/verificar_bachilleratos/',
  TIMEOUT: 15000, // 15 segundos
  HEADERS: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

/**
 * Consulta rápida de bachillerato usando HTTPS nativo + Cheerio
 * @param {string} documento - Número do documento (RG ou CPF)
 * @param {string} fechaNacimiento - Data de nascimento (opcional)
 * @returns {Promise<Object>} Resultado da consulta
 */
async function consultarBachilleratoRapido(documento, fechaNacimiento) {
  try {
    console.log(`⚡ Consulta rápida para: ${documento}`);
    
    // Prepara dados do formulário
    const postData = new URLSearchParams({
      'bachillerato': documento,
      'fecha_nac': fechaNacimiento || ''
    }).toString();
    
    // Faz requisição POST
    const html = await makeHttpsRequest(postData);
    
    // Parse HTML com Cheerio
    const $ = cheerio.load(html);
    
    // Extrai resultado
    const resultado = extrairDados($);
    
    console.log(`✅ Consulta rápida concluída - Status: ${resultado.status}`);
    
    return {
      ...resultado,
      timestamp: new Date().toISOString(),
      metodo: 'rapido'
    };
    
  } catch (error) {
    console.error('❌ Erro na consulta rápida:', error.message);
    throw new Error(`Falha na consulta rápida: ${error.message}`);
  }
}

/**
 * Faz requisição HTTPS usando módulo nativo do Node
 * @param {string} postData - Dados do formulário
 * @returns {Promise<string>} HTML da resposta
 */
function makeHttpsRequest(postData) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'tramites.mec.gov.py',
      port: 443,
      path: '/gestion_tramites/verificar_bachilleratos/',
      method: 'POST',
      headers: {
        ...CONFIG.HEADERS,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(CONFIG.TIMEOUT);
    req.write(postData);
    req.end();
  });
}

/**
 * Extrai dados da página HTML usando Cheerio
 * @param {CheerioAPI} $ - Instância do Cheerio
 * @returns {Object} Dados extraídos
 */
function extrairDados($) {
  let status = 'NAO_VALIDADO';
  let mensagem = '';
  let nome = '';
  let instituicao = '';
  let ano = '';
  let departamento = '';
  let distrito = '';
  let dadosCompletos = {};

  // Verifica se há painel de sucesso (validado)
  const painelSucesso = $('.panel.panel-success, .panel-success');
  const painelErro = $('.panel.panel-danger, .panel-danger, .alert-danger');
  
  if (painelSucesso.length > 0) {
    status = 'VALIDADO';
    
    // Extrai texto completo do resultado
    const textoResultado = painelSucesso.text().trim();
    mensagem = textoResultado;
    
    // Tenta extrair nome (primeira palavra em maiúsculas antes de "es egresado")
    const matchNome = textoResultado.match(/([A-ZÑÁÉÍÓÚ\s]+)\s+es egresado/i);
    if (matchNome) {
      nome = matchNome[1].trim();
    }
    
    // Extrai instituição
    const matchInstituicao = textoResultado.match(/institución:\s*([^en]+)en el año/i);
    if (matchInstituicao) {
      instituicao = matchInstituicao[1].trim();
    }
    
    // Extrai ano
    const matchAno = textoResultado.match(/año\s+(\d{4})/i);
    if (matchAno) {
      ano = matchAno[1];
    }
    
    // Extrai departamento
    const matchDepartamento = textoResultado.match(/departamento\s+([^distrito]+)/i);
    if (matchDepartamento) {
      departamento = matchDepartamento[1].trim();
    }
    
    // Extrai distrito
    const matchDistrito = textoResultado.match(/distrito\s+(?:de\s+)?(.+?)$/i);
    if (matchDistrito) {
      distrito = matchDistrito[1].trim();
    }
    
    // Monta objeto com dados completos
    dadosCompletos = {
      nome,
      instituicao,
      ano,
      departamento,
      distrito,
      textoCompleto: textoResultado
    };
    
  } else if (painelErro.length > 0) {
    status = 'NAO_VALIDADO';
    mensagem = painelErro.text().trim() || 'Nenhum resultado encontrado. Verifique os dados informados.';
  } else {
    // Tenta pegar qualquer painel
    const qualquerPainel = $('.panel');
    if (qualquerPainel.length > 0) {
      mensagem = qualquerPainel.text().trim();
    } else {
      mensagem = 'Não foi possível processar a resposta do servidor.';
    }
  }

  return {
    status,
    mensagem,
    dados: dadosCompletos,
    // Campos individuais para compatibilidade
    nome,
    instituicao,
    ano,
    departamento,
    distrito
  };
}

module.exports = {
  consultarBachilleratoRapido
};
