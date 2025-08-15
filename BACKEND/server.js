const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

const guidanceRouter = require("./routes/student_routes/guidanceR");

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/guidance",guidanceRouter);

const URL = process.env.MONGODB_URL;
mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("Mongo-DB Connection Successful!");
});

app.listen(PORT,() =>{
    console.log(`Server is up and running on port no ${PORT}`);
})

