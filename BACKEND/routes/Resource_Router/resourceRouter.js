const express = require("express");
const router = express.Router();
const resourceCon = require("../../controllers/Resources_con/resources_con");

router.post("/add",resourceCon.addResources);
router.get("/display",resourceCon.displayResource);
router.get("/getId/:id",resourceCon.displayResourceByID);
router.delete("/delete/:id",resourceCon.deleteResource);
router.put("/update/:id",resourceCon.updateResource);

module.exports = router;