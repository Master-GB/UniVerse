const mongoose = require("mongoose");
const schema = mongoose.Schema;

const guidanceSchema = new schema({

    studentGName:{
        type : String
    },

    guidanceTitle:{
        type : String,
        required : [true,"title is required"],
    },

    guidanceDiscription:{
        type:String,
        required : [true,"discription is required"]
    },

    status:{
        type:String,
        enum: ["pending", "answered"],
        default: "pending",
        required: [true, "status is required"]
    },

    guidanceDate:{
        type : Date,
        default: Date.now,
        required : [true,"date is required"],
    },

    mentorName: {
        type: String,
        default: "Not Assigned",
    },

    response: {
        type: String,
        default: "No response yet",
    },

    responseDate:{
        type: Date,
        default: Date.now,
    } 

});

const guidance = mongoose.model("guidances",guidanceSchema);
module.exports = guidance;