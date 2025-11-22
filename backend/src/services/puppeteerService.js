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
  
  // Timeout em milissegundos - aumentado para servidor grátis
  TIMEOUT: 90000  // 90 segundos
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
    
    console.log('📸 Tirando screenshot inicial...');
    const initialScreenshot = path.join(__dirname, '../../prints/debug_initial.png');
    await page.screenshot({ path: initialScreenshot, fullPage: true });

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
      // Se não apareceu resultado após preencher, tira screenshot
      const debugPath = path.join(__dirname, '../../prints/debug_after_fill.png');
      await page.screenshot({ path: debugPath, fullPage: true });
      console.log(`📸 Screenshot após preenchimento salvo em: ${debugPath}`);
      
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
    
    let pdfUrl = null;

    // Se está validado, gera o PDF
    if (isValidado) {
      console.log('✅ Bachillerato validado! Gerando PDF...');
      
      const printsDir = path.join(__dirname, '../../prints');
      
      // Garante que a pasta prints existe
      if (!fs.existsSync(printsDir)) {
        fs.mkdirSync(printsDir, { recursive: true });
      }

      const filename = `bachillerato_${bachillerato}_${Date.now()}.pdf`;
      const pdfPath = path.join(printsDir, filename);

      // Remove apenas os links de navegação, mantém o resto (incluindo logo)
      await page.evaluate(() => {
        // Remove apenas os links de navegação do topo (Inicio, Portal MEC, etc)
        const navLinks = document.querySelectorAll('a[href*="Inicio"], a[href*="Portal"], a[href*="Consultar"], a[href*="Iniciar"]');
        navLinks.forEach(link => {
          // Remove só se for texto, não imagem
          if (!link.querySelector('img')) {
            link.remove();
          }
        });
        
        // Remove menu hamburguer se houver
        const menuBtn = document.querySelector('.navbar-toggle, button[data-toggle]');
        if (menuBtn) menuBtn.remove();
        
        // Remove botão "Ayuda" se houver
        const ayudaBtn = document.querySelector('a[href*="Ayuda"]');
        if (ayudaBtn) ayudaBtn.remove();
        
        // Ajusta o body para PDF
        document.body.style.padding = '20px';
        document.body.style.margin = '0';
      });

      // Aguarda a página se ajustar
      await page.waitForTimeout(1000);

      // Remove elementos desnecessários (menu, rodapé, etc)
      await page.evaluate(() => {
        // Remove cabeçalhos, menus e rodapés que podem atrapalhar
        const selectorsToHide = [
          'header', 'nav', 'footer', 
          '.header', '.navbar', '.footer',
          '[role="banner"]', '[role="navigation"]'
        ];
        selectorsToHide.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            el.style.display = 'none';
          });
        });
      });

      // Gera o PDF com altura automática (captura página completa)
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        landscape: false,  // Modo retrato (melhor para formulários)
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm'
        },
        scale: 0.95,  // Escala para caber melhor
        preferCSSPageSize: false
      });

      pdfUrl = `/prints/${filename}`;
      console.log(`📑 PDF gerado: ${pdfUrl}`);
    } else {
      console.log('❌ Bachillerato não validado');
    }

    // Fecha o navegador
    await browser.close();

    // Retorna o resultado
    return {
      status,
      mensagem: resultadoTexto.trim(),
      bachillerato,
      pdfUrl,
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
