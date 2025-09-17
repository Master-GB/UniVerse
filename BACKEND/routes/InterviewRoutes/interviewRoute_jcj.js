const express = require("express");
const {
  askAI,
} = require("../../controllers/Interview-Controller/interviewController.js");

const router = express.Router();

router.post("/ask", askAI);

// mek GPT kypu ekak bn, wada kre nh
module.exports = router;
