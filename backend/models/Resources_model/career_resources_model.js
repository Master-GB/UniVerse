import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CareerResourceSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ["interview", "skill", "salary", "company", "video"],
        required: true
    },
    category: {
        type: String,
        required: [true, "category is required"],
    },
    url: {
        type: String,
        required: [true, "URL is required"],
    },
    actionText: { type: String, default: "View Resource" },
    level: { type: String, default: "All Levels" },
    duration: { type: String },
    premium: { type: Boolean, default: false }
}, { timestamps: true });

const CareerResource = model("careerresources", CareerResourceSchema);
export default CareerResource;