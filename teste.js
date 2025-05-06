const axios = require("axios");
const cheerio = require("cheerio");

const url =
  "https://www.ufc.br/restaurante/cardapio/1-restaurante-universitario-de-fortaleza";

let pratosAlmoco = [];
let sucoAlmoco = "";
let acompanhamentoAlmoco = "";
let pratosJanta = [];
let sucoJanta = "";
let acompanhamentoJantar = "";

const querCarioca = false; // pegar por argumentos no momento da chamada
const querPure = false; // pegar por argumentos no momento da chamada

function pushToList(list, item, index) {
  if (item.includes("(Contém")) {
    list[index - 1] = list[index - 1] + item;
    list.push(null);
  } else {
    list.push(item);
  }
}

axios
  .get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);

    $(".almoco .principal .desc, .almoco .vegetariano .desc").each(
      (index, element) => {
        let prato = $(element).text();
        pushToList(pratosAlmoco, prato, index);
      }
    );

    $(".jantar .principal .desc, .jantar .vegetariano .desc").each(
      (index, element) => {
        let prato = $(element).text();
        pushToList(pratosJanta, prato, index);
      }
    );

    $(".almoco .suco .desc").each((index, element) => {
      sucoAlmoco = $(element).text();
    });

    $(".jantar .suco .desc").each((index, element) => {
      sucoJanta = $(element).text();
    });

    $(".almoco .guarnicao .desc").each((index, element) => {
      acompanhamentoAlmoco = $(element).text();
    });

    $(".jantar .guarnicao .desc").each((index, element) => {
      acompanhamentoJantar = $(element).text();
    });

    pratosAlmoco = pratosAlmoco.filter((n) => n);
    pratosJanta = pratosJanta.filter((n) => n);

    console.log("ALMOÇO:");
    console.log("Pratos:", pratosAlmoco);
    console.log("Acompanhamento:", acompanhamentoAlmoco);
    console.log("Suco de", sucoAlmoco);

    console.log();

    console.log("JANTAR:");
    console.log("Pratos:", pratosJanta);
    console.log("Acompanhamento:", acompanhamentoJantar);
    console.log("Suco de", sucoJanta);
  })
  .catch((error) => {
    console.error("Erro ao acessar a página:", error.message);
  });
