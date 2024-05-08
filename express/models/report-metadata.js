const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReportMetadataSchema = new Schema({
    page_url: { type: String, required: true, maxLength: 500 },
    total_passed: { type: Number, required: true},
    total_warning: { type: Number, required: true},
    total_failed: { type: Number, required: true},
    total_inapplicable: { type: Number, required: true},
    rules: [{ type: Schema.Types.ObjectId, ref: "RuleMetadata" }]
});



// Define o caminho virtual para o URL
ReportMetadataSchema.virtual("url").get(function () {
    // Retorna o URL baseado no ID
    return `/eval-metadata/${this._id}`;
  });


// Export model
module.exports = mongoose.model("ReportMetadata", ReportMetadataSchema);
