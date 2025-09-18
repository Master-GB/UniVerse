const mongoose = require("mongoose");
const schema = mongoose.Schema;

const MentorCareerSession = new schema({
    mentor_name:{
        type: String,
        required: [true, "mentor name is required"],
    },
    
    mentor_description:{
        type: String,
        
    },

    mentor_email:{
        type: String,
        required: [true, "mentor email is required"],
    },

    session_start_date:{
        type: Date,
        required: [true, "session start date is required"],
    },

    session_start_time:{
        type: String,
        required: [true, "session start time is required"]
    },

    session_create_date:{
        type: Date,
        default: Date.now,
        required: [true, "session create date is required"],
    },
    
    session_create_time:{
        type: String,
        default: () => new Date().toLocaleTimeString("en-GB"), // "HH:MM:SS"
        required: [true, "session create time is required"]
    },

    session_status:{
        type: String,
        enum: ["book", "booked"], // only these values are allowed
        default: "book"
        
    },

    seat_count:{
        type: Number,
        default: 1
    },
    
    session_duration:{
        type: String,
        required: [true, "session duration is required"],
    },

    session_title:{
        type: String,
        required: [true, "session title is required"],
    },

    session_description:{
        type: String,
        required: [true, "session description is required"],
    },

    session_link:{
        type: String,
        required: [true, "session link is required"],
    },

    resource_links: [String], // 
    session_resources: [{
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        buffer: Buffer // <-- add this
    }]

});

const Guidance  = mongoose.model("MentorCareerSession", MentorCareerSession);
module.exports = Guidance;