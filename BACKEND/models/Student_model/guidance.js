const mongoose = require("mongoose");
const schema = mongoose.Schema;

const guidanceSchema = new schema({

    studentGName:{
        type : String,
        required : [true,"name is required"],
    },

    guidanceTitle:{
        type : String,
        required : [true,"title is required"],
    },

    guidanceDiscription:{
        type:String,
        required : [true,"discription is required"]
    },

    guidanceDate:{
        type : Date,
        default: Date.now,
        required : [true,"date is required"],
    }

});

const guidance = mongoose.model("guidances",guidanceSchema);
module.exports = guidance;