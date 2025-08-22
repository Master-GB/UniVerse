const mongoose = require("mongoose");
const { Schema } = mongoose;

const MentorshipAnnouncementSchema = new Schema({
    anc_create_mentor_name: {
        type: String,
        required: [true, "Mentor name is required"],
    },
    anc_create_date: {
        type: Date,
        default: Date.now,
        required: [true, "Announcement creation date is required"],
    },
    anc_create_time: {
        type: String,
        default: () => new Date().toLocaleTimeString("en-GB"), // HH:MM:SS
        required: [true, "Announcement creation time is required"],
    },
    anc_title: {
        type: String,
        required: [true, "Announcement title is required"],
    },
    anc_description: {
        type: String,
        required: [true, "Announcement description is required"],
    },
    anc_link: {
        type: String,
        default: ''
    },
    announcement_type: {
        type: String,
        enum: ['academic', 'technical', 'general', 'career'],
        default: 'academic'
    },
    anc_resources: [{
        filename: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        path: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true // This adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("MentorshipAnnouncement", MentorshipAnnouncementSchema);