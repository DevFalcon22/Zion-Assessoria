// API Route Proxy para geração de PDF
// Faz proxy das requisições HTTPS do frontend para HTTP do backend

export default async function handler(req, res) {
  // Apenas aceitar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Backend Oracle Cloud (IP fixo como fallback)
  const BACKEND_URL = process.env.BACKEND_URL || 'http://146.235.29.239:5000';
  
  console.log('📄 Proxy PDF: Conectando ao backend:', BACKEND_URL);

  try {
    // Fazer requisição ao backend Oracle Cloud com timeout de 50 segundos
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50000);

    const response = await fetch(`${BACKEND_URL}/api/gerar-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      signal: controller.signal
    });

    clearTimeout(timeout);

    // Pega resposta do backend
    const data = await response.json();

    // Retorna resposta do backend
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('❌ Erro no proxy PDF:', error.message);

    // Se foi timeout
    if (error.name === 'AbortError') {
      return res.status(504).json({
        error: 'Timeout ao gerar PDF',
        detalhes: 'A geração do PDF demorou muito tempo. Tente novamente.',
        status: 'ERROR'
      });
    }

    // Erro de conexão
    return res.status(503).json({
      error: 'Erro ao conectar com o servidor',
      detalhes: error.message,
      status: 'ERROR'
    });
  }
}

// Configuração do Vercel
export const config = {
  api: {
    bodyParser: true,
    responseLimit: '10mb'
  }
};
