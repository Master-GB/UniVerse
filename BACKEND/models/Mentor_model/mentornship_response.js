const mongoose = require("mongoose");
const schema = mongoose.Schema;

const mentorshipResponseSchema = new schema({
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

    session_resources:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fs.files'
    }


});

const Guidance  = mongoose.model("MentorshipResponse", mentorshipResponseSchema);
module.exports = Guidance;