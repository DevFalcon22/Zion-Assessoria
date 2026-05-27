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

    // CACHE
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

      // ✔ usa Axios primeiro
      resultado = await consultarMEC(bachillerato, fechaNacimiento);

      console.log("📥 RESPOSTA MEC OK");

    } catch (error) {
      console.log("⚠️ Axios falhou, usando Puppeteer...");

      resultado = await fallbackMEC(bachillerato, fechaNacimiento);
    }

    // salva cache
    cache.set(key, {
      time: Date.now(),
      data: resultado
    });

    return res.json(resultado);

  } catch (error) {
    console.error("❌ ERRO DETALHADO:");
    console.error(error.message);

    return res.status(500).json({
      status: "ERROR",
      error: error.message
    });
  }
}

module.exports = {
  consultarBachillerato
};
