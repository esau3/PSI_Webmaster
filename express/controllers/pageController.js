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
  const page = await Page.findById(req.params.id).populate({
    path: 'report',
    populate: {
      path: 'rules',
      model: 'RuleMetadata'
    }
  }).exec();

  //ja vai buscar as rules
  //console.log("page rules: ", page.report.rules);

  select: 'code name passed warning failed outcome rule_type'
  if (page === null) {
    const err = new Error("Page not found");
    err.status = 404;
    return next(err);
  }

  

  //se ja existir um report feito a essa pagina,
  //lembrando que é passado o id em page.report
  //console.log(page.report);
  //ISTO AINDA NAO ESTA A FUNCIONAR, NETAO VAMOS FZR UM NOVO REPORT SEMPRE
  if(page.report && page.report.rules.length !== 0) {

    console.log("nao fez nova avaliacao");

    const reportMetadata = await ReportMetadata.findById(page.report).populate('rules').exec()
    
    //console.log("report rules: ", reportMetadata.rules)
    res.send(reportMetadata);
  } else {
    res.send(generate_new_report(page._id));
  }});

exports.new_report = asyncHandler(async (req, res, next) => {

  // Get details of website and their pages (in parallel)
  const page = await Page.findById(req.params.id).populate({
    path: 'report',
    populate: {
      path: 'rules',
      model: 'RuleMetadata'
    }
  }).exec();

  //ja vai buscar as rules
  //console.log("page rules: ", page.report.rules);
  select: 'code name passed warning failed outcome rule_type'
  if (page === null) {
    const err = new Error("Page not found");
    err.status = 404;
    return next(err);
  } 
    res.send(generate_new_report(page._id));
  });

async function generate_new_report(pageId) {
  //atualizar estado da pagina
  const page = await Page.findByIdAndUpdate(
    pageId,
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

  if (report[toEval] && report[toEval].metadata && report[toEval].modules && report[toEval].modules['act-rules']) {

    //const metadata = report.metadata;
    const metadata = report[toEval].metadata;
    const act_assertions = report[toEval].modules['act-rules'].assertions;

    const wcag_assertions = report[toEval].modules['wcag-techniques'].assertions;
    //assertions.push(report[toEval].modules['wcag-rules'].assertions);
    //const alo = report[toEval].modules['wcag-rules'].assertions;
    //console.log(alo);

    //console.log(metadata);

    const rulesArray = [];

    for (const assertionKey in act_assertions) {
      if (act_assertions.hasOwnProperty(assertionKey)) {
          const assertion = act_assertions[assertionKey];
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
          await ruleMetadata.save();
          rulesArray.push(ruleMetadata._id);
          //console.log("creating rules: ", ruleMetadata._id)
      }
    }


    //we have to dup the code... assertions are not iterable
    for (const assertionKey in wcag_assertions) {
      if (wcag_assertions.hasOwnProperty(assertionKey)) {
          const assertion = wcag_assertions[assertionKey];
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
          await ruleMetadata.save();
          rulesArray.push(ruleMetadata._id);
          //console.log("creating rules: ", ruleMetadata._id)
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

    //await update_page_state(page._id);
  
    //console.log(page._id);
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
    //console.log(reportMetadata);
    //res.send(reportMetadata);
  } else {
    //erro na avaliacao
    await Page.findByIdAndUpdate(
      page._id,
      { 
        $set: { 
          monitor_state: "Erro na avaliação",
          eval_date: Date.now()
        }
      },
      { new: true }
    );
      const err = new Error("Erro na avaliação do QualWeb!");
      err.status = 500;
      return next(err);
  }
    
    await qualweb.stop();
    return report;
}

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
  const page = await Page.findById(page_id).populate().exec();
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
