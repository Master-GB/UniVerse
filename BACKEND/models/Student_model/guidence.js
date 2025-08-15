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
    }

}) 