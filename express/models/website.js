const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WebsiteSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  URL: { type: String, required: true, maxLength: 500 },
  register_date: { type: Date, default: Date.now },
  eval_date: { type: Date, default: new Date(0) },       
  monitor_state: {
    type: String,
    required: true,
    enum: ["Por avaliar", "Em avaliação", "Avaliado", "Erro na avaliação"],
    default: "Por avaliar",
  },
  pages: [{ type: Schema.Types.ObjectId, ref: "Page" }], 
});

// Virtual for website's URL
WebsiteSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/website/${this._id}`;
});

// Export model
module.exports = mongoose.model("Website", WebsiteSchema);
