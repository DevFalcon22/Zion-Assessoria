// API Route Proxy para evitar Mixed Content
// Faz proxy das requisições HTTPS do frontend para HTTP do backend

export default async function handler(req, res) {
  // Apenas aceitar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const BACKEND_URL = process.env.BACKEND_URL || 'http://146.235.29.239:5000';

  try {
    // Fazer requisição ao backend Oracle Cloud
    const response = await fetch(`${BACKEND_URL}/api/consulta-bachillerato`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // Retornar a resposta do backend
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Erro no proxy:', error);
    res.status(500).json({ 
      error: 'Erro ao conectar com o backend',
      message: error.message 
    });
  }
}
