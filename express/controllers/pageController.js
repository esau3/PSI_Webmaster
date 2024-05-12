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
    const page = await Page.findById(req.params.id).populate().exec();
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
exports.page_report = asyncHandler(async (req, res, next) => {

  // Get details of website and their pages (in parallel)
  const page = await Page.findById(req.params.id).exec();

  if (page === null) {
    const err = new Error("Page not found");
    err.status = 404;

    //atualizar estado da pagina
  await Page.findByIdAndUpdate(
    page._id,
    { $set: { monitor_state: "Erro na avaliação" } },
    { new: true }
  )

    return next(err);
  }

  //se ja existir um report feito a essa pagina,
  //lembrando que é passado o id em page.report
  if(page.report && page.report.length === 1) {

    const reportMetadata = await ReportMetadata.findById(page.report).exec();
    console.log("Nao fez nova eval, ja existia uma!");
    res.send(reportMetadata);
  } else {

  //atualizar estado da pagina
  await Page.findByIdAndUpdate(
    page._id,
    { $set: { monitor_state: "Em avaliação" } },
    { new: true }
  )

  //inicializar
  const qualweb = new QualWeb(plugins);
  await qualweb.start(clusterOptions, launchOptions);

  //ir buscar o url correto
  let toEval = page.page_URL;
  //console.log(toEval);

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
          rule_type: getErrorLevel(assertion.metadata['success-criteria'])
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

  await Page.findByIdAndUpdate(
    page._id,
    { 
      $set: { 
        monitor_state: "Conforme",
        eval_date: Date.now()
      }
    },
    { new: true }
  );

  page.report = reportMetadata;
  //console.log(page);
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

async function update_page_state(page_id) {
  const page = await Page.findById(page_id).exec();
  if (page === null) {
    const err = new Error("Page not found");
    err.status = 404;
    return next(err);
  }

  if (page.report === null) {
    return null;                  // assim? 
  }
  
  const err_types = [];
  const rules = page.report.rules;

  for (let i = 0; i < rules.length; i++) {
    if (rules[i].failed > 0) {
      for (let j = 0; j < rules[i].rule_type.length; j++) {
        if (err_types.indexOf(rules[i].rule_type[j]) === -1) {
          err_types.push(rules[i].rule_type[j]);
        }
      }
    }
  }

  if (err_types.indexOf("A") != -1 || err_types.indexOf("AA") != -1) {
    await Page.findByIdAndUpdate(
      page_id,
      { $set: { monitor_state: "Não conforme" } },
      { new: true }
    )
  } else {
    await Page.findByIdAndUpdate(
      page_id,
      { $set: { monitor_state: "Conforme" } },
      { new: true }
    )
  }
}

// Display list of all Pages.
exports.reports_list = async (req, res, next) => {
  try {
    const allReports = await ReportMetadata.find().exec();
    res.send(JSON.stringify(allReports));
  } catch (error) {
    next(error);
  }
};
