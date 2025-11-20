const express = require('express');
const cors = require('cors');
const path = require('path');
const consultaRoutes = require('./routes/consultaRoutes');

// Carrega variáveis de ambiente
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta prints
app.use('/prints', express.static(path.join(__dirname, '../prints')));

// Rota especial para debug
app.get('/debug/screenshot', (req, res) => {
  const debugPath = path.join(__dirname, '../prints/debug_no_button.png');
  const fs = require('fs');
  
  if (fs.existsSync(debugPath)) {
    res.sendFile(debugPath);
  } else {
    res.status(404).json({ error: 'Screenshot de debug não encontrado' });
  }
});

// Rotas
app.use('/api', consultaRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Zion Assessoria MEC - Consulta de Bachilleratos',
    version: '1.0.0',
    endpoints: {
      consulta: 'POST /api/consulta-bachillerato',
      downloads: 'GET /prints/:filename'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Acesse: http://localhost:${PORT}`);
});
