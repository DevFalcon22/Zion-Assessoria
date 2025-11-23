const puppeteer = require('puppeteer-core');
const path = require('path');

/**
 * 📄 Serviço de geração de PDF usando Puppeteer
 * Usado apenas quando o usuário quer visualizar/baixar o PDF
 */

const CONFIG = {
  URL_BASE: 'https://tramites.mec.gov.py/gestion_tramites/verificar_bachilleratos/',
  TIMEOUT: 45000, // 45 segundos
  CHROME_PATH: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/microsoft-edge-stable'
};

/**
 * Gera PDF da página de verificação do MEC-PY
 * @param {string} documento - Número do documento
 * @param {string} fechaNacimiento - Data de nascimento (opcional)
 * @returns {Promise<Buffer>} Buffer do PDF gerado
 */
async function gerarPDFBachillerato(documento, fechaNacimiento) {
  let browser = null;
  
  try {
    console.log(`📄 Gerando PDF para documento: ${documento}`);
    
    // Inicia navegador headless
    browser = await puppeteer.launch({
      executablePath: CONFIG.CHROME_PATH,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    });

    const page = await browser.newPage();
    
    // Configura viewport
    await page.setViewport({ 
      width: 1366, 
      height: 768 
    });

    // Navega para a página
    console.log('🌐 Acessando página do MEC...');
    await page.goto(CONFIG.URL_BASE, { 
      waitUntil: 'networkidle0',
      timeout: CONFIG.TIMEOUT 
    });

    // Aguarda formulário carregar
    await page.waitForTimeout(2000);

    // Preenche o formulário
    console.log('✍️ Preenchendo formulário...');
    
    await page.waitForSelector('#id_bachillerato', { timeout: CONFIG.TIMEOUT });
    await page.type('#id_bachillerato', documento);

    if (fechaNacimiento) {
      await page.waitForSelector('#id_fecha_nac', { timeout: CONFIG.TIMEOUT });
      await page.type('#id_fecha_nac', fechaNacimiento);
      
      // Pressiona Enter para submeter
      await page.keyboard.press('Enter');
      console.log('⏳ Aguardando resultado...');
      
      // Aguarda resultado aparecer
      await page.waitForTimeout(5000);
      
      // Verifica se resultado apareceu
      await Promise.race([
        page.waitForSelector('.panel.panel-success', { timeout: 15000, visible: true }),
        page.waitForSelector('.panel.panel-danger', { timeout: 15000, visible: true }),
        page.waitForSelector('.panel', { timeout: 15000, visible: true })
      ]);
      
      console.log('✅ Resultado carregado!');
    }

    // Aguarda página estabilizar
    await page.waitForTimeout(2000);

    // Aplica CSS de impressão
    console.log('🖨️ Aplicando estilo de impressão...');
    await page.emulateMediaType('print');
    
    // Aguarda renderização com CSS de impressão
    await page.waitForTimeout(1000);

    // Gera PDF em memória
    console.log('📑 Gerando PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,  // Modo paisagem
      printBackground: true,
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

    console.log(`✅ PDF gerado com sucesso (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error.message);
    throw new Error(`Falha ao gerar PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  gerarPDFBachillerato
};
