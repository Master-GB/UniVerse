const mongoose = require("mongoose");
const schema = mongoose.Schema;

const articleSchema = new schema({
    article_title:{
        type: String,
        required: [true, "article title is required"],
    },
    article_description:{
        type: String,
        required: [true, "article description is required"],
    },
    article_category:{
        type: String,
        enum: ['Tech News', 'AI', 'Tools', 'Web','Entrepreneurship', 'Engineering'],
        default: 'Tech News'
    },

    article_author:{
        type: String,
        required: [true, "article author is required"],
    },
    article_date:{
        type: Date,
        default: Date.now,
        required: [true, "article date is required"],
    },
    artivle_duration:{
        type: String,
        required: [true, "article duration is required"],
    },
      article_image: {
        data: Buffer,        // binary data of image
        contentType: String  // e.g., 'image/png', 'image/jpeg'
    }
}, { timestamps: true });

module.exports = mongoose.model("MentorArticle", articleSchema);