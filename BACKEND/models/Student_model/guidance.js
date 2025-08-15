const mongoose = require("mongoose");
const schema = mongoose.Schema;

const guidanceSchema = new schema({

    name:{
        type : String,
        required : [true,"name is required"],
    },

    title:{
        type : String,
        required : [true,"title is required"],
    },

    discription:{
        type:String,
        required : [true,"discription is required"]
    },

    date:{
        type : Date,
        default: Date.now,
        required : [true,"date is required"],
    }

});

const guidance = mongoose.model("guidances",guidanceSchema);
module.exports = guidance;