const express = require("express");
const router = express.Router();
const guidanceCon = require("../../controllers/Student-Controller/guidanceC");

router.post("/add",guidanceCon.addGuidance);
router.get("/display",guidanceCon.displayGuidance);
router.get("/getID/:id",guidanceCon.displayByIDGuidance);
router.delete("/delete/:id",guidanceCon.deleteGuidance);
router.put("/update/:id",guidanceCon.updateGuidance);


module.exports = router;