const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PageSchema = new Schema({
  //website: { type: Schema.Types.ObjectId, ref: "Website", required: true },
  page_URL: { type: String, required: true, minLength: 1, maxLength: 500 },
  eval_date: { type: Date, default: new Date(0) },
  monitor_state: {
    type: String,
    required: true,
    enum: ["Por avaliar", "Em avaliação", "Conforme", "Não conforme", "Erro na avaliação"],
    default: "Por avaliar",
  },
  report: { type: Schema.Types.ObjectId, ref: "ReportMetadata" }
});

// Virtual for page's URL
PageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/page/${this._id}`;
});

// Export model
module.exports = mongoose.model("Page", PageSchema);
