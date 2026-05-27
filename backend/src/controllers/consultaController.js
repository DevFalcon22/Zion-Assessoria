const { consultarMEC } = require("../services/mecAxiosService");
const { fallbackMEC } = require("../services/mecPuppeteerFallback");

// cache simples
const cache = new Map();
const TTL = 5 * 60 * 1000;

async function consultarBachillerato(req, res) {
  try {
    const { bachillerato, fechaNacimiento } = req.body;

    if (!bachillerato) {
      return res.status(400).json({
        status: "ERROR",
        error: "Documento obrigatório"
      });
    }

    const key = `${bachillerato}_${fechaNacimiento || ""}`;

    // cache hit
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < TTL) {
      return res.json({
        ...cached.data,
        cache: true
      });
    }

    let resultado;

    try {
  console.log("📤 Enviando para MEC...");

  const resultado = await consultarBachilleratoMEC(bachillerato, fechaNacimiento);

  console.log("📥 RESPOSTA BRUTA:");
  console.log(resultado);

  return res.json(resultado);

} catch (error) {
  console.error("❌ ERRO DETALHADO:");
  console.error(error.response?.data || error.message);

  return res.status(500).json({
    error: error.message,
    detalhes: error.response?.data || null
  });
}
  }
}

module.exports = {
  consultarBachillerato
};
