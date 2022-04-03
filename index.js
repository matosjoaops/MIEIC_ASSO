const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrap() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://paginas.fe.up.pt/~estudar/vida-na-feup/associacoes-de-estudantes/"
  );

  const parseAssociations = function (associations) {
    results = [];

    for (const association of associations) {
      const name = association.querySelector(
        "span.fusion-toggle-heading"
      ).textContent;
      const body = association.querySelector("div.panel-body").innerHTML;
      results.push({ name, body });
    }
    return results;
  };

  const associations1 = await page.$$eval(
    "#accordion-37-1 > div",
    parseAssociations
  );

  const associations2 = await page.$$eval(
    "#accordion-37-2 > div",
    parseAssociations
  );

  const associations = associations1.concat(associations2);

  fs.writeFileSync("data.json", JSON.stringify(associations), { flag: "a" });

  await browser.close();
}

scrap();
