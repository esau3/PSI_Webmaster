const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReportMetadataSchema = new Schema({
    url: { type: String, required: true, maxLength: 500 },
    passed: { type: Number, required: true},
    warning: { type: Number, required: true},
    failed: { type: Number, required: true},
    inapplicable: { type: Number, required: true},
    failed_type: { type: [String], maxLength: 4}
});

// Virtual for website's URL
WebsiteSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/eval-metadata/${this._id}`;
});

// Export model
module.exports = mongoose.model("Website", WebsiteSchema);
