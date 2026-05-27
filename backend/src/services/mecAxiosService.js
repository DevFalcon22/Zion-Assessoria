const axios = require("axios");
const cheerio = require("cheerio");

async function consultarMEC(bachillerato, fechaNacimiento) {
  try {
    const response = await axios.post(
      "https://tramites.mec.gov.py/gestion_tramites/verificar_bachilleratos/buscar_bachillerato",
      new URLSearchParams({
        bachillerato,
        fechaNacimiento: fechaNacimiento || ""
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0",
          "Accept": "*/*"
        },
        timeout: 15000
      }
    );

    const html = response.data;

    const $ = cheerio.load(html);

    // CASO: não encontrado
    if ($(".none-result").length > 0) {
      return {
        status: "NOT_FOUND",
        encontrado: false,
        mensagem: $(".none-result").text().trim()
      };
    }

    // CASO: encontrado (genérico)
    const resultadoTexto = $("#verificar-bachilleratos-lista").text().trim();

    return {
      status: "FOUND",
      encontrado: true,
      mensagem: resultadoTexto || "Registro encontrado",
      raw: html
    };

  } catch (error) {
    throw new Error("Erro Axios MEC: " + error.message);
  }
}

module.exports = {
  consultarMEC
};
