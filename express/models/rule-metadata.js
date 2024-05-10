const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RuleMetadataSchema = new Schema({
    code: { type: String, required: true, maxLength: 50 },
    name: { type: String, required: true, maxLength: 500 },
    passed: { type: Number, required: true},
    warning: { type: Number, required: true},
    failed: { type: Number, required: true},
    inapplicable: { type: Number, required: true},
    outcome: { type: String, required: true, maxLength: 50 },
    rule_type: {
        type: [String],
        validate: {
          validator: function (v) {
            return v.every(val => ["A", "AA", "AAA"].includes(val));
          }
        }
    }
});



// Virtual for website's URL
RuleMetadataSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/rule-metadata/${this._id}`;
});

// Export model
module.exports = mongoose.model("RuleMetadata", RuleMetadataSchema);
