const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  faculty: { type: String, required: true },
  level: { type: String, required: true },
  conducting: { type: String, required: true },
  duration: { type: String, default: "" },
  students: { type: Number, default: 0 },
  hours: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
