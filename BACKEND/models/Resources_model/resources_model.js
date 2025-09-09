const mongoose = require("mongoose");
const schema = mongoose.Schema;

const AcadamicVideoSchema = new schema({

    title :{
        type:String,
        required:[true,"Title is required"],
    },

    description:{
        type:String
    },

    category: { 
        type: String,
        required: [true,"category is required"],
    },

    sub_category :{
        type: String,
        required: [true,"sub_category is required"],
    },

    typeOfRes:{
        type:String,
         enum: ["LectureVideo", "LectureNote", "PastPapper", "Papper", "Other"], 
    },

    contentType: { 
        type: String, 
        enum: ["pdf", "video", "link", "image", "document"], 
        required: true 
    },

    fileUrl: { 
        type: String,
        required:[true,"file Url is required"], 
    },

    thumbnailUrl: { 
        type: String 
    },

    updatedAt: {
         type: Date, 
         default: Date.now 
    },


   // relatedQuizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],


});

const AcadamicVideo = mongoose.model("acadamicvideos",AcadamicVideoSchema);
module.exports = AcadamicVideo;