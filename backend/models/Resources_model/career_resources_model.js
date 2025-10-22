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
        enum: ["salary","interview","skill","company","professional"],
        required: true
    },
    category: {
        type: String,
        enum: ["Interview Prep", "Salary data", "Skill Development", "Company Insights", "Professional Skill"],
        required: [true, "category is required"],
    },
    url: {
        type: String,
        required: [true, "URL is required"],
    },
    actionText: { type: String, default: "View Resource" },

    level: { 
        type: String,
        enum: ["Beginner","Mid-Senior", "All Level", "Senior", "Intermediate"],
        default: "All Levels" 
    },
    duration: { type: String },
    premium: { type: Boolean, default: false }
}, { timestamps: true });

const CareerResource = model("careerresources", CareerResourceSchema);
export default CareerResource;