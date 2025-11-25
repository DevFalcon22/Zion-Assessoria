const PDFDocument = require('pdfkit');

/**
 * 📄 Gera PDF customizado com pdfkit (sem navegador)
 * Baseado na estrutura visual do MEC Paraguay
 */
function gerarPDFCustomizado(dados) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks = [];
      
      // Captura o buffer do PDF
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ===== CABEÇALHO =====
      doc.fontSize(10)
         .fillColor('#666')
         .text('Inicio (https://tramites.mec.gov.py/gestion_tramites/index)', { align: 'left' });
      
      doc.moveDown(1);
      
      // Título principal
      doc.fontSize(20)
         .fillColor('#000')
         .font('Helvetica-Bold')
         .text('Verificación de egresados de la Educación Media', { align: 'left' });
      
      doc.moveDown(1.5);
      
      // ===== CAMPOS DO FORMULÁRIO =====
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#000')
         .text('Documento Estudiante (*)', { continued: false });
      
      doc.moveDown(0.3);
      
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#333')
         .text(dados.documento || '', { align: 'left' });
      
      doc.moveDown(1);
      
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#000')
         .text('Fecha de Nacimiento (*)', { continued: false });
      
      doc.moveDown(0.3);
      
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#333')
         .text(dados.fechaNacimiento || '', { align: 'left' });
      
      doc.moveDown(2);
      
      // ===== CAIXA DE RESULTADO =====
      const boxY = doc.y;
      const boxWidth = doc.page.width - 100;
      const boxHeight = 100;
      
      // Borda da caixa
      doc.rect(50, boxY, boxWidth, boxHeight)
         .stroke('#ddd');
      
      // Título "Datos del Egresado"
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#000')
         .text('Datos del Egresado', 50, boxY + 15, { 
           width: boxWidth,
           align: 'center'
         });
      
      // Mensagem do resultado
      doc.moveDown(1);
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#333')
         .text(dados.mensagem || '', 60, doc.y + 10, {
           width: boxWidth - 20,
           align: 'left'
         });
      
      doc.moveDown(3);
      
      // ===== RODAPÉ =====
      const footerY = doc.page.height - 80;
      
      doc.fontSize(8)
         .fillColor('#666')
         .font('Helvetica')
         .text('Aviso Legal (https://tramites.mec.gov.py/gestion_tramites/legal)', 50, footerY, {
           width: boxWidth / 2,
           continued: true
         })
         .text(' | Acerca de (https://tramites.mec.gov.py/gestion_tramites/about)', {
           width: boxWidth / 2
         });
      
      doc.moveDown(0.5);
      
      // Rodapé removido conforme solicitado
      
      // Finaliza o PDF
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  gerarPDFCustomizado
};
