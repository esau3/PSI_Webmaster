#! /usr/bin/env node

console.log(
  'This script populates some test websites and pages to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Website = require("./models/website");
const Page = require("./models/page");

const pages = [];
const websites = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createPages();
  await createWebsites();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function pageCreate(index, page_URL, eval_date, monitor_state) {
  const page = new Page({ page_URL: page_URL, eval_date: eval_date, monitor_state: monitor_state });
  await page.save();
  pages[index] = page;
  console.log(`Added page: ${page_URL}`);
}

async function websiteCreate(index, name, URL, register_date, eval_date, monitor_state, pages) {
  const websitedetail = { 
    name: name,
    URL: URL,
    register_date: register_date,
    eval_date: eval_date,
    monitor_state: monitor_state,
    pages: pages
  };
  if (name != false) websitedetail.name = name;
  if (URL != false) websitedetail.URL = URL;
  if (register_date != false) websitedetail.register_date = register_date;
  if (eval_date != false) websitedetail.eval_date = eval_date;
  if (monitor_state != false) websitedetail.monitor_state = monitor_state;
  if (pages != false) websitedetail.pages = pages;

  const website = new Website(websitedetail);

  await website.save();
  websites[index] = website;
  console.log(`Added website: ${name}`);
}

async function createPages() {
  console.log("Adicionando páginas");
  await Promise.all([
    pageCreate(0, "https://www.netflix.com/home", new Date(), 'Por avaliar'),
    pageCreate(1, "https://www.netflix.com/browse", new Date(), 'Por avaliar'),
    pageCreate(2, "https://www.netflix.com/search", new Date(), 'Por avaliar'),
    pageCreate(3, "https://ciencias.ulisboa.pt/home", new Date(), 'Por avaliar'),
    pageCreate(4, "https://ciencias.ulisboa.pt/cursos", new Date(), 'Por avaliar'),
    pageCreate(5, "https://ciencias.ulisboa.pt/investigacao", new Date(), 'Por avaliar'),
    pageCreate(6, "https://fenix.ciencias.ulisboa.pt/home", new Date(), 'Por avaliar'),
    pageCreate(7, "https://fenix.ciencias.ulisboa.pt/turmas", new Date(), 'Por avaliar'),
    pageCreate(8, "https://fenix.ciencias.ulisboa.pt/avaliacoes", new Date(), 'Por avaliar'),
    pageCreate(9, "https://www.amazon.com/home", new Date(), 'Por avaliar'),
    pageCreate(10, "https://www.amazon.com/categories", new Date(), 'Por avaliar'),
    pageCreate(11, "https://www.amazon.com/account", new Date(), 'Por avaliar'),
    pageCreate(12, "https://www.olx.pt/home", new Date(), 'Por avaliar'),
    pageCreate(12, "https://www.olx.pt/ads", new Date(), 'Por avaliar'),
    pageCreate(12, "https://www.olx.pt/account", new Date(), 'Por avaliar'),
    pageCreate(15, "https://www.wikipedia.org/main", new Date(), 'Por avaliar'),
    pageCreate(16, "https://www.wikipedia.org/random", new Date(), 'Por avaliar'),
    pageCreate(17, "https://www.wikipedia.org/recent", new Date(), 'Por avaliar'),
    pageCreate(18, "https://www.google.com/search", new Date(), 'Por avaliar'),
    pageCreate(19, "https://www.google.com/maps", new Date(), 'Por avaliar'),
    pageCreate(20, "https://www.google.com/gmail", new Date(), 'Por avaliar'),
    pageCreate(21, "https://www.youtube.com/home", new Date(), 'Por avaliar'),
    pageCreate(22, "https://www.youtube.com/trending", new Date(), 'Por avaliar'),
    pageCreate(23, "https://www.youtube.com/subscriptions", new Date(), 'Por avaliar'),
    pageCreate(24, "https://www.facebook.com/home", new Date(), 'Por avaliar'),
    pageCreate(25, "https://www.facebook.com/profile", new Date(), 'Por avaliar'),
    pageCreate(26, "https://www.facebook.com/friends", new Date(), 'Por avaliar'),
    pageCreate(27, "https://twitter.com/home", new Date(), 'Por avaliar'),
    pageCreate(28, "https://twitter.com/explore", new Date(), 'Por avaliar'),
    pageCreate(29, "https://twitter.com/notifications", new Date(), 'Por avaliar'),
  ]);
}


async function createWebsites() {
  console.log("Adding websites");
  await Promise.all([
    websiteCreate(1, "Netflix", "https://www.netflix.com", new Date(), new Date(), randomState(), [pages[0], pages[1], pages[2]]),
    websiteCreate(2, "FCUL", "https://ciencias.ulisboa.pt", new Date(), new Date(), randomState(), [pages[3], pages[4], pages[5]]),
    websiteCreate(3, "Fenix FCUL", "https://fenix.ciencias.ulisboa.pt", new Date(), new Date(), randomState(), [pages[6], pages[7], pages[8]]),
    websiteCreate(4, "Amazon", "https://www.amazon.com", new Date(), new Date(), randomState(), [pages[9], pages[10], pages[11]]),
    websiteCreate(5, "OLX", "https://www.olx.pt", new Date(), new Date(), randomState(), [pages[12], pages[13], pages[14]]),
    websiteCreate(6, "Wikipedia", "https://www.wikipedia.org", new Date(), new Date(), randomState(), [pages[15], pages[16], pages[17]]),
    websiteCreate(7, "Google", "https://www.google.com", new Date(), new Date(), randomState(), [pages[18], pages[19], pages[20]]),
    websiteCreate(8, "Youtube", "https://www.youtube.com", new Date(), new Date(), randomState(), [pages[21], pages[22], pages[23]]),
    websiteCreate(9, "Facebook", "https://www.facebook.com", new Date(), new Date(), randomState(), [pages[24], pages[25], pages[26]]),
    websiteCreate(10, "Twitter", "https://twitter.com", new Date(), new Date(), randomState(), [pages[27], pages[28], pages[29]]),

  ]);
}

function randomState() {
  const states = ["Por avaliar", "Em avaliação", "Avaliado", "Erro na avaliação"];
  const index = Math.floor(Math.random() * states.length);
  return states[index];
}