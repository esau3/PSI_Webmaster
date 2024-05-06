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
  const website = await Website.findById(req.params.id).populate('pages', 'page_URL').exec();

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
      pages: req.body.pages
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
  res.send(JSON.stringify(website));
    if (website === null) {
      // No results.
      const err = new Error("Website not found");
      err.status = 404;
      return next(err);
    }
    await Page.deleteMany({ _id: { $in: website.pages } }).exec();
    await Website.findByIdAndDelete(req.params.id).exec();
  });


// Handle Update Pages on PUT.
exports.page_update = asyncHandler(async (req, res, next) => {
  try {
    // Encontrar o website pelo ID
    const website = await Website.findById(req.params.id).exec();

    if (!website) {
      const err = new Error("Website not found");
      err.status = 404;
      throw err;
    }

    // Adicionar a nova página ao final da lista de páginas do website
    website.pages.push(req.body); // Assumindo que req.body contém os dados da página a ser adicionada

    // Salvar o website atualizado
    await website.save();

    res.send("Page added to website successfully");
  } catch (error) {
    next(error);
  }
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
    url: req.params.url // substituir pelo url a avaliar
  };

  // executar a avaliação, recebendo o relatório
  const report = await qualweb.evaluate(qualwebOptions);

  // parar o avaliador
  await qualweb.stop();
});