const file = require("../663b48bf5ba7461b74c8abc6.json");
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
    const page = await Page.findById(req.params.id).populate('report').exec();
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
  //console.log(page);
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

/*
// Display detail page for a specific ReportMetadata.
exports.report_detail = async (req, res, next) => {
  try {
    const report_metadata = await ReportMetadata.findById(req.params.id).exec();
    if (!report_metadata) {
      const err = new Error("Report not found");
      err.status = 404;
      throw err;
    }
    res.send(JSON.stringify(report_metadata));
  } catch (error) {
    next(error);
  }
};*/

// Handle Page evaluation on GET.
exports.page_eval = asyncHandler(async (req, res, next) => {

  // Get details of website and their pages (in parallel)
  const page = await Page.findById(req.params.id).exec();

  if (page === null) {
    const err = new Error("Page not found");
    err.status = 404;
    return next(err);
  }

  //se ja existir um report feito a essa pagina
  if(page.report) {
    const reportMetadata = page.report;
    console.log(page);

    res.send(reportMetadata);
  } else {

  //inicializar
  const qualweb = new QualWeb(plugins);
  await qualweb.start(clusterOptions, launchOptions);

  //ir buscar o url correto
  let toEval = page.page_URL;
  console.log(toEval);

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
  const metadata = report[toEval].metadata;
  const assertions = report[toEval].modules['act-rules'].assertions;
  //console.log(assertions);

  //console.log(metadata);

  const rulesArray = [];

  for (const assertionKey in assertions) {
    if (assertions.hasOwnProperty(assertionKey)) {
        const assertion = assertions[assertionKey];
        const ruleMetadata = new RuleMetadata ({
          code: assertion.code,
          name: assertion.name,
          passed: assertion.metadata.passed,
          warning: assertion.metadata.warning,
          failed: assertion.metadata.failed,
          inapplicable: assertion.metadata.inapplicable,
          outcome: assertion.metadata.outcome,
          type: getErrorLevel(assertion.metadata['success-criteria'])
        })
        rulesArray.push(ruleMetadata);
    }
  }

  //console.log(rulesArray);

  const reportMetadata = new ReportMetadata({
    page_url: toEval,
    total_passed: metadata.passed,
    total_warning: metadata.warning,
    total_failed: metadata.failed,
    total_inapplicable: metadata.inapplicable,
    rules: rulesArray
  });
  

  await reportMetadata.save();

  page.report = reportMetadata;
  console.log(page);
  await page.save();

  //res.send(report);
  res.send(reportMetadata);
  
  await qualweb.stop();
  
  }});

//funcao que retorna o level do teste
function getErrorLevel(successCriteria) {
  const levels = new Set(); // Usamos um Set para garantir apenas um de cada nível
  for (const criteria of successCriteria) {
      levels.add(criteria.level);
  }
  return Array.from(levels);
}

// para depois poder chamar o website_controller.update_website()
async function find_website_id(page_id) {
  const website = await Website.findOne({ pages: page_id }).exec();   
  if (website === null) {
    const err = new Error("Website not found");
    err.status = 404;
    return next(err);
  }
  return website._id;
}
