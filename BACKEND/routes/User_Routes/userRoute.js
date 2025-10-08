const express = require("express");
const router = express.Router();
const authController = require("../../controllers/Auth_Controller/auth_controller");
const profilePictureUpload = require("../../middleware/profilePictureUpload");
const verifyToken = require("../../middleware/auth");

// POST /api/auth/register
router.post("/register", profilePictureUpload, authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/profile
router.get("/profile", verifyToken, authController.getProfile);

// PUT /api/auth/profile
router.put(
	"/profile",
	verifyToken,
	profilePictureUpload,
	authController.updateProfile
);

// POST /api/auth/logout
router.post("/logout", verifyToken, authController.logout);

module.exports = router;
