const express = require("express");
const router = express.Router();
const authController = require("../../controllers/Auth_Controller/auth_controller");
const profilePictureUpload = require("../../middleware/profilePictureUpload");

// POST /api/auth/register
router.post("/register", profilePictureUpload, authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
