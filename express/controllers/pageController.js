const file = require("./663b48bf5ba7461b74c8abc6.json");
const Page = require("../models/page");
const Website = require("../models/website");
const ReportMetadata = require("../models/report-metadata");
const RuleMetadata = require("../models/rule-metadata");
const asyncHandler = require("express-async-handler");
const { QualWeb } = require('@qualweb/core');

const plugins = {
      adBlock: false,
      stealth: true
    };

const clusterOptions = {
      timeout: 60 * 1000,
    };

const launchOptions = {
  args: ['--no-sandbox',
        '--ignore-certificate-errors']
    };

// Display list of all Pages.
exports.page_list = async (req, res, next) => {
  try {
    const allPages = await Page.find().exec();
    res.send(JSON.stringify(allPages));
  } catch (error) {
    next(error);
  }
};

// Display detail page for a specific Page.
exports.page_detail = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id).exec();
    if (!page) {
      const err = new Error("Page not found");
      err.status = 404;
      throw err;
    }
    res.send(JSON.stringify(page));
  } catch (error) {
    next(error);
  }
};

// Handle Page deletion on DELETE.
exports.page_delete = asyncHandler(async (req, res, next) => {

  const page = await Page.findById(req.params.id).exec();
  console.log(page);
  if (!page) {
    // No results.
    const err = new Error("Page not found");
    err.status = 404;
    return next(err);
  }
  await Page.findByIdAndDelete(req.params.id).exec();

  await Website.findOneAndUpdate(
    { pages: req.params.id },
    { $pull: { pages: req.params.id } },
    { new: true }
  ).exec();
});


// Handle Page evaluation on GET.
exports.page_eval = asyncHandler(async (req, res, next) => {

  //inicializar
  const qualweb = new QualWeb(plugins);
  await qualweb.start(clusterOptions, launchOptions);

  // Get details of website and their pages (in parallel)
  const page = await Page.findById(req.params.id).exec();
  if (page === null) {
    const err = new Error("Page not found");
    err.status = 404;
    return next(err);
  }

  //ir buscar o url correto
  let toEval = page.page_URL;

  // especificar as opções, incluindo o url a avaliar
  const qualwebOptions = {
    url: toEval, // substituir pelo url a avaliar, /eval/page/id
    "execute": {
      // choose which modules to execute
      // if this option is not specified, the default values below will be applied, otherwise unspecified values will default to false
      "wappalyzer": true, // wappalyzer module (https://github.com/qualweb/wappalyzer)
      "act": true, // act-rules module (https://github.com/qualweb/act-rules)
      "wcag": true, // wcag-techniques module (https://github.com/qualweb/wcag-techniques)
      "bp": false, // best-practices module (https://github.com/qualweb/best-practices)
      "counter": false // counter module (https://github.com/qualweb/counter)
    }
  };

  // executar a avaliação, recebendo o relatório
  const report = await qualweb.evaluate(qualwebOptions);

  //const metadata = report.metadata;
  const metadata = file.metadata;
  console.log(file.lengh());
  console.log(metadata);

  /*const reportMetadata = new ReportMetadata({
    url: report.url.completeUrl,
    total_passed: report.metadata.passed,
    total_warning: report.metadata.warning,
    total_failed: report.metadata.failed,
    total_inapplicable: metadata.metadata.inapplicable,
    rules: []
  });

  console.log(reportMetadata);*/





  res.send(report);

  // parar o avaliador e libertar recursos
  await qualweb.stop();
});




