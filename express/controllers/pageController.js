const Page = require("../models/page");
const Website = require("../models/website");
const asyncHandler = require("express-async-handler");

// Display list of all Pages.
/*exports.page_list = asyncHandler(async (req, res, next) => {
  const allPages = await Page.find().sort({ name: 1 }).exec();
  res.send(JSON.stringify(allPages));
});*/

// Display detail page for a specific Page.
exports.page_detail = asyncHandler(async (req, res, next) => {
  // Get details of page and the associated website (in parallel)
  const page = await Page.findById(req.params._id).exec();
  if (page === null) {
    // No results.
    const err = new Error("Page not found");
    err.status = 404;
    return next(err);
  }

  res.send(JSON.stringify(page));
});
