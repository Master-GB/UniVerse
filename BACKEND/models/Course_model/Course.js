const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  faculty: { type: String, required: true },        // Faculty dropdown
  name: { type: String, required: true },           // Course Name
  description: { type: String },                    // Description
  level: { type: String, default: "Certificate Level" }, // Always Certificate Level
  duration: { type: String, default: "1-2 hours" },      // Always 1-2 hours
  image: { type: String },                          // Course image
  content: { type: [String] }                       // Array of course content pages
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
