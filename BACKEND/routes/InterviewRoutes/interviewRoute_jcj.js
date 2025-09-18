const express = require("express");
const {
  askAI,
} = require("../../controllers/Interview-Controller/interviewController.js");

const router = express.Router();

router.post("/ask", askAI);

module.exports = router;
