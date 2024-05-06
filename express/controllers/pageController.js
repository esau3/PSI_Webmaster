const Page = require("../models/page");
const Website = require("../models/website");
const asyncHandler = require("express-async-handler");

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

// Handle Page deletion on DELETE.
exports.page_delete = asyncHandler(async (req, res, next) => {
  const page = await Page.findById(req.params.id).exec();
  res.send(JSON.stringify(page));
  if (page === null) {
    // No results.
    const err = new Error("Page not found");
    err.status = 404;
    return next(err);
  }
  await Page.findByIdAndDelete(req.params.id).exec();
  // Update the Website that contains the page
  await Website.findOneAndUpdate(
    { pages: req.params.id },
    { $pull: { pages: req.params.id } },
    { new: true }
  ).exec();
});
