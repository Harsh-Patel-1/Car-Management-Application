const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  images: {
    type: [String],
    validate: [(arr) => arr.length <= 10, "Maximum 10 images allowed"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Car", carSchema);
