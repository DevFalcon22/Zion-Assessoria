const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * ⚠️ CONFIGURAÇÃO - AJUSTAR OS SELETORES CONFORME O SITE REAL
 * 
 * Acesse o site e use o DevTools (F12) para encontrar os seletores corretos:
 * - INPUT_SELECTOR: seletor do campo de input onde digita o bachillerato
 * - BUTTON_SELECTOR: seletor do botão que submete a consulta
 * - RESULT_SELECTOR: seletor do elemento que contém o resultado
 * - VALIDADO_TEXT: texto que indica que está validado (pode ser regex)
 */
const CONFIG = {
  URL: 'https://tramites.mec.gov.py/gestion_tramites/verificar_bachilleratos/',
  
  // ✅ SELETORES AJUSTADOS CONFORME O SITE REAL:
  INPUT_SELECTOR: '#form_buscar_documento_estudiante',     // Campo do documento do estudante
  INPUT_DATE_SELECTOR: '#form_buscar_fecha_nacimiento',     // Campo de data de nascimento
  BUTTON_SELECTOR: '.btn-primary',                          // Botão de buscar (alterado)
  RESULT_SELECTOR: '.panel.panel-success',                  // Painel de resultado (sucesso)
  ERROR_SELECTOR: '.panel.panel-danger',                    // Painel de erro
  
  // Textos que indicam validação (case insensitive)
  VALIDADO_KEYWORDS: ['es egresado de la institución', 'Datos del Egresado', 'egresado'],
  
  // Timeout em milissegundos - reduzido para compatibilidade com Vercel Free (60s)
  TIMEOUT: 45000  // 45 segundos (deixa 15s de margem para processamento)
};

/**
 * Função principal que consulta o bachillerato usando Puppeteer
 * @param {string} bachillerato - Número de documento do estudante
 * @param {string} fechaNacimiento - Data de nascimento (DD/MM/AAAA) - OPCIONAL
 * @returns {Object} Resultado da consulta com status e PDF se validado
 */
async function consultarBachilleratoMEC(bachillerato, fechaNacimiento = '') {
  let browser = null;
  
  try {
    console.log('🌐 Abrindo navegador...');
    
    // DEBUG: Mude para false para ver o navegador em ação
    const DEBUG_MODE = process.env.DEBUG_PUPPETEER === 'true';
    
    // Inicia o Puppeteer
    browser = await puppeteer.launch({
      headless: DEBUG_MODE ? false : 'new',  // false = mostra navegador
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      slowMo: DEBUG_MODE ? 100 : 0  // Desacelera ações em debug
    });

    const page = await browser.newPage();
    
    // Configurações da página
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Desabilitar imagens e CSS para carregar mais rápido
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if(['image', 'stylesheet', 'font'].includes(req.resourceType())){
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`🔗 Acessando: ${CONFIG.URL}`);
    await page.goto(CONFIG.URL, { 
      waitUntil: 'domcontentloaded',  // Mais rápido que networkidle2
      timeout: CONFIG.TIMEOUT 
    });

    // Aguarda a página carregar completamente e scripts executarem
    await page.waitForTimeout(3000);

    console.log('✍️ Preenchendo campos do formulário...');
    
    // Espera o campo de documento aparecer
    await page.waitForSelector(CONFIG.INPUT_SELECTOR, { timeout: CONFIG.TIMEOUT });
    
    // Limpa o campo e digita o número do documento
    await page.click(CONFIG.INPUT_SELECTOR, { clickCount: 3 }); // Seleciona tudo
    await page.type(CONFIG.INPUT_SELECTOR, bachillerato);

    // Se houver data de nascimento, preenche também
    if (fechaNacimiento && fechaNacimiento.trim() !== '') {
      console.log('📅 Preenchendo data de nascimento...');
      await page.waitForSelector(CONFIG.INPUT_DATE_SELECTOR, { timeout: CONFIG.TIMEOUT });
      await page.click(CONFIG.INPUT_DATE_SELECTOR, { clickCount: 3 });
      await page.type(CONFIG.INPUT_DATE_SELECTOR, fechaNacimiento);
      
      // Pressiona Enter para disparar a busca (alguns sites precisam disso)
      await page.keyboard.press('Enter');
      console.log('⌨️ Enter pressionado após preencher data');
    } else {
      // Se não tem data, pressiona Enter no campo do documento
      await page.click(CONFIG.INPUT_SELECTOR);
      await page.keyboard.press('Enter');
      console.log('⌨️ Enter pressionado após preencher documento');
    }

    // IMPORTANTE: Este site NÃO tem botão submit, ele carrega automaticamente após preencher!
    console.log('⏳ Aguardando carregamento automático dos dados...');
    
    // Espera o resultado aparecer (pode demorar alguns segundos)
    await page.waitForTimeout(2000);

    console.log('⏳ Aguardando resultado...');
    
    // Espera aparecer resultado (sucesso OU erro) - com timeout maior
    try {
      await Promise.race([
        page.waitForSelector(CONFIG.RESULT_SELECTOR, { timeout: 15000, visible: true }),
        page.waitForSelector(CONFIG.ERROR_SELECTOR, { timeout: 15000, visible: true }),
        page.waitForSelector('.panel', { timeout: 15000, visible: true }) // Qualquer painel
      ]);
      console.log('✅ Resultado encontrado!');
    } catch (err) {
      // Tenta pegar o HTML da página para debug
      const pageHTML = await page.evaluate(() => document.body.innerText);
      console.log('📄 Texto da página:', pageHTML.substring(0, 1000));
      
      throw new Error('Nenhum resultado apareceu após preencher os campos. Verifique os dados informados.');
    }

    // Aguarda um pouco mais para garantir que o conteúdo carregou
    await page.waitForTimeout(2000);

    // Tenta extrair o texto do resultado (sucesso ou erro)
    let resultadoTexto = '';
    
    // Primeiro tenta encontrar o painel de sucesso
    const successPanel = await page.$('.panel.panel-success, .panel-success');
    
    if (successPanel) {
      resultadoTexto = await page.evaluate(el => el.innerText, successPanel);
      console.log('📄 Resultado (SUCESSO) extraído:', resultadoTexto.substring(0, 200));
    } else {
      // Se não tem painel de sucesso, procura painel de erro
      const errorPanel = await page.$('.panel.panel-danger, .panel-danger, .alert-danger');
      
      if (errorPanel) {
        resultadoTexto = await page.evaluate(el => el.innerText, errorPanel);
        console.log('📄 Resultado (ERRO/AVISO) extraído:', resultadoTexto.substring(0, 200));
      } else {
        // Se não encontrou painéis específicos, pega qualquer div com classe panel
        const anyPanel = await page.$('.panel');
        
        if (anyPanel) {
          resultadoTexto = await page.evaluate(el => el.innerText, anyPanel);
          console.log('📄 Resultado (PAINEL GENÉRICO) extraído:', resultadoTexto.substring(0, 200));
        } else {
          // Última tentativa: pega o texto do corpo da página
          resultadoTexto = await page.evaluate(() => {
            // Procura por texto que contenha "egresado" ou "Datos"
            const body = document.body.innerText;
            if (body.includes('egresado') || body.includes('Datos del Egresado')) {
              return body;
            }
            return 'Nenhum resultado encontrado';
          });
          console.log('📄 Resultado (BODY) extraído:', resultadoTexto.substring(0, 200));
        }
      }
    }

    // Verifica se está validado
    const isValidado = CONFIG.VALIDADO_KEYWORDS.some(keyword => 
      resultadoTexto.toUpperCase().includes(keyword.toUpperCase())
    );

    const status = isValidado ? 'VALIDADO' : 'NAO_VALIDADO';
    
    let pdfBuffer = null;

    // Se está validado, gera o PDF em memória (não salva no disco)
    if (isValidado) {
      console.log('✅ Bachillerato validado! Gerando PDF em memória...');

      // Aplica media print CSS antes de gerar o PDF (simula "Imprimir")
      await page.emulateMediaType('print');

      // Aguarda renderização com CSS de impressão
      await page.waitForTimeout(1000);

      // Gera o PDF em memória (não salva no disco) - modo paisagem
      pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,  // Modo paisagem
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%; padding: 5px;">
            Documento gerado em: ${new Date().toLocaleString('pt-BR')} | Zion Assessoria
          </div>
        `,
        margin: {
          top: '15mm',
          right: '10mm',
          bottom: '20mm',
          left: '10mm'
        },
        scale: 0.9
      });

      console.log(`📑 PDF gerado em memória (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
    } else {
      console.log('❌ Bachillerato não validado');
    }

    // Fecha o navegador
    await browser.close();

    // Retorna o resultado com PDF em base64 (se validado)
    return {
      status,
      mensagem: resultadoTexto.trim(),
      bachillerato,
      pdfBase64: pdfBuffer ? pdfBuffer.toString('base64') : null,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Erro no Puppeteer:', error);
    
    // Fecha o navegador em caso de erro
    if (browser) {
      await browser.close();
    }

    // Lança o erro com mais contexto
    throw new Error(`Falha na automação: ${error.message}`);
  }
}

module.exports = {
  consultarBachilleratoMEC
};
