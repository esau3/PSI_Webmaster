const Website = require("../models/website");
const Page = require("../models/page");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Websites.
exports.website_list = asyncHandler(async (req, res, next) => {
  const allWebsites = await Website.find().sort({ name: 1 }).exec();                     // TODO? mudar name
  res.send(JSON.stringify(allWebsites));
});

// Display detail page for a specific Website.
exports.website_detail = asyncHandler(async (req, res, next) => {
  // Get details of website and their pages (in parallel)
  const website = await Website.findById(req.params.id)
  .populate({
    path: 'pages',
    select: 'page_URL eval_date monitor_state'
  })
  .exec();

  if (website === null) {
    // No results.
    const err = new Error("Website not found");
    err.status = 404;
    return next(err);
  }
  res.send(JSON.stringify(website));
});

// Handle Website create on POST.
exports.website_create_post = [
  // Validate and sanitize the name field.
  body("name", "Website name must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .escape(),

                                                                                        //TODO sanitize url
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a website object with escaped and trimmed data.
    const website = new Website({
      name: req.body.name,
      URL: req.body.url,
      pages: req.body.pages,
      monitor_state: "Por avaliar"
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("website_form", {
        title: "Create Website",
        website: website,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Website with same name already exists.
      const websiteExists = await Website.findOne({ name: req.body.name }).exec();
      if (websiteExists) {
        // Website exists, redirect to its detail page.
        res.redirect(websiteExists.url);
      } else {
        await website.save();
        // New website saved. Redirect to website detail page.
        res.redirect(website.url);
      }
    }
  }),
];

// Handle Website deletion on DELETE.
exports.website_delete = asyncHandler(async (req, res, next) => {
  const website = await Website.findById(req.params.id).exec();
  //res.send(JSON.stringify(website));
    if (website === null) {
      const err = new Error("Website not found");
      err.status = 404;
      return next(err);
    }
    await Page.deleteMany({ _id: { $in: website.pages } }).exec();
    await Website.findByIdAndDelete(req.params.id).exec();
  });



// Handle Update Pages on PUT.
exports.page_update = asyncHandler(async (req, res, next) => {
  
  const website = await Website.findById(req.params.id).exec();
  
  if (website === null) {
    const err = new Error("Website not found");
    err.status = 404;
    return next(err);
  }

  const existingPage = await Page.findOne({ page_URL: req.body.url }).exec();
  if (existingPage) {
    // A página já existe, então não a adicionamos novamente
    return res.status(409).send("Page already exists");
  }

  const page = new Page({
    page_URL: req.body.url,
    eval_date: req.body.eval_date,
    monitor_state: req.body.monitor_state
  });

  website.pages.push(page); 

  await website.save();
  await page.save();
  res.redirect(page.url);
  //update_website(req.params.id);
});

// Handle Website evaluation on GET.
exports.website_eval = asyncHandler(async (req, res, next) => {
  // Get details of website and their pages (in parallel)
  const website = await Website.findById(req.params.id).exec();
  if (website === null) {
    // No results.
    const err = new Error("Website not found");
    err.status = 404;
    return next(err);
  }

  // especificar as opções, incluindo o url a avaliar
  const qualwebOptions = {
    url: req.params.url, // substituir pelo url a avaliar
    output: 'json'
  };

  // executar a avaliação, recebendo o relatório
  const report = await qualweb.evaluate(qualwebOptions);

  console.log(report);
  // parar o avaliador e libertar recursos
  await qualweb.stop();
  //update_website(req.params.id);
});

//funcao que atualiza os estados conforme o report
async function update_website(websiteId) {
  const website = await Website.findById(websiteId).exec();
  if (website === null) {
    const err = new Error("Website not found");
    err.status = 404;
    return next(err);
  }

  //using flags to determine website state
  var none_eval_flag = true;
  var all_eval_flag = true;
  var all_during_flag = true;
  var page_state;

  for (let i = 0; i < website.pages.length; i++) {
    page_state = website.pages[i].monitor_state;

    if(page_state === "Erro na avaliação") {
      await Website.findByIdAndUpdate(
        websiteId,
        { $set: { monitor_state: "Erro na avaliação" } },
        { new: true }
      )
      break;
    } else if(page_state === "Por avaliar") {
      all_eval_flag = false;
      all_during_flag = false;
    } else if(page_state === "Conforme" || page_state === "Não Conforme") {
      none_eval_flag = false;
      all_during_flag = false;
    } else if(page_state === "Em avaliação") {
      all_eval_flag = false;
      none_eval_flag = false;
    }
  }

  //update website according to flags
  if(all_during_flag || (!none_eval_flag && !all_eval_flag)) {
    await Website.findByIdAndUpdate(
      websiteId,
      { $set: { monitor_state: "Em avaliação" } },
      { new: true }
    )
  } else if(all_eval_flag) {
    await Website.findByIdAndUpdate(
      websiteId,
      { $set: { monitor_state: "Avaliado" } },
      { new: true }
    )
  } else if(none_eval_flag) {
    await Website.findByIdAndUpdate(
      websiteId,
      { $set: { monitor_state: "Por avaliar" } },
      { new: true }
    )
  }

};