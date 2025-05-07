/**
 * @typedef {Object} Refeicao
 * @property {string[]} pratos
 * @property {string} suco
 * @property {string|null} guarnicao
 * @property {boolean|null} temCarioca
 */

const axios = require("axios");
const cheerio = require("cheerio");

const url =
  "https://www.ufc.br/restaurante/cardapio/1-restaurante-universitario-de-fortaleza";

function pushToList(list, item, index) {
  if (item.includes("(Contém")) {
    list[index - 1] = list[index - 1] + item;
    list.push(null);
  } else {
    list.push(item);
  }
}

/**
 * Pega informações essenciais das informações de hoje a depender do tipo de refeição escolhida.
 * @param {import("cheerio").CheerioAPI} $ - A página usando o Cheerio.
 * @param {String} tipoRefeicao - Tipo de refeição, 'almoco' ou 'jantar'.
 */
function getRefeicao($, tipoRefeicao) {
  let refeicao = {};
  let pratos = [];
  let suco = "";
  let guarnicaos = [];
  let temCarioca = false;

  $(
    `.${tipoRefeicao} .principal .desc, .${tipoRefeicao} .vegetariano .desc`
  ).each((index, element) => {
    let prato = $(element).text();
    pushToList(pratos, prato, index);
  });

  $(`.${tipoRefeicao} .suco .desc`).each((index, element) => {
    suco = $(element).text();
  });

  $(`.${tipoRefeicao} .guarnicao .desc`).each((index, element) => {
    guarnicao = $(element).text();
    pushToList(guarnicaos, guarnicao, index);
  });

  $(`.${tipoRefeicao} .acompanhamento .desc`).each((index, element) => {
    acompanhamento = $(element).text();
    if (acompanhamento.includes("Carioca")) temCarioca = true;
  });

  pratos = pratos.filter((n) => n);
  refeicao.pratos = pratos;
  refeicao.suco = suco;
  refeicao.guarnicao = guarnicaos[0];
  refeicao.temCarioca = temCarioca;
  return refeicao;
}

function showInformations(refeicao) {
  console.log("Pratos:", refeicao.pratos);
  console.log("Acompanhamento:", refeicao.guarnicao);
  console.log("Suco de", refeicao.suco);
  if (refeicao.temCarioca) console.log("--> Tem Carioca!!!!");
}

axios
  .get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);
    let almoco = getRefeicao($, "almoco");
    let janta = getRefeicao($, "jantar");

    // Pode ter um momento de input para pegar qual opção quer
    console.log("ALMOÇO:");
    showInformations(almoco);
    console.log();
    console.log("JANTAR:");
    showInformations(janta);
  })
  .catch((error) => {
    console.error("Erro ao acessar a página:", error.message);
  });
