

const express = require("express");
const router = express.Router();
const CareerResourceCon = require("../../controllers/Resources_con/career_resources_controller");

router.post("/add",CareerResourceCon.createResource);
router.get("/display",CareerResourceCon.getResources);
router.get("/getId/:id",CareerResourceCon.displayResourceByID);
router.delete("/delete/:id",CareerResourceCon.deleteResource);
router.put("/update/:id",CareerResourceCon.updateResource);

module.exports = router;