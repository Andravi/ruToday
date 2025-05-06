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

axios
  .get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);

    let pratosAlmoco = [];
    let pratosJanta = [];
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
    pratosAlmoco = pratosAlmoco.filter((n) => n);
    pratosJanta = pratosJanta.filter((n) => n);

    console.log("Pratos do Almoço:", pratosAlmoco);
    console.log("Pratos da Janta:", pratosJanta);
  })
  .catch((error) => {
    console.error("Erro ao acessar a página:", error.message);
  });
