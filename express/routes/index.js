const express = require("express");
const router = express.Router();

// Require controller modules.
const website_controller = require("../controllers/websiteController");
const page_controller = require("../controllers/pageController");


// GET home page.
router.get("/", function (req, res) {
    res.send("hi");
});

// GET request for list of all Website items.
router.get("/websites", website_controller.website_list);

// GET request for one Website.
router.get("/website/:id", website_controller.website_detail);

// POST request for creating Website.
router.post("/website", website_controller.website_create_post);

// DELETE request to delete Website.
router.delete("/website/:id", website_controller.website_delete);

// DELETE request to delete Page.
router.delete("/page/:id", page_controller.page_delete);

// GET request for list of all Page items.
router.get("/pages", page_controller.page_list);

// GET request for one Page.
router.get("/page/:id", page_controller.page_detail);

// GET request for evaluation of a Website and its Pages
//router.get("/website/:id/eval", website_controller.website_eval);

// GET request for evaluation of a Website and its Pages
router.get("/eval/page/:id", page_controller.page_eval);

// PUT request to update a Page.
//router.put("/page/:id", page_controller.page_update);

// PUT request to update a Page.
router.put("/website/:id", website_controller.page_update);

module.exports = router;