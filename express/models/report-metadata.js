const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReportMetadataSchema = new Schema({
    url: { type: String, required: true, maxLength: 500 },
    total_passed: { type: Number, required: true},
    total_warning: { type: Number, required: true},
    total_failed: { type: Number, required: true},
    total_inapplicable: { type: Number, required: true},
    rules: [{ type: Schema.Types.ObjectId, ref: "RuleMetadata" }]
});



// Virtual for website's URL
ReportMetadataSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/eval-metadata/${this._id}`;
});

// Export model
module.exports = mongoose.model("ReportMetadata", ReportMetadataSchema);
