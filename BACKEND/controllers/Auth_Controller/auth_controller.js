const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const User = require("../../models/User_Model/UserModel");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  phone: user.phone,
  role: user.role,
  profilePicture: user.profilePicture,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// User Registration
exports.register = async (req, res) => {
  const removeUploadedProfilePicture = async () => {
    if (!req.file?.path) return;
    try {
      await fs.unlink(req.file.path);
    } catch (cleanupError) {
      if (cleanupError.code !== "ENOENT") {
        console.error(
          "Failed to remove uploaded profile picture:",
          cleanupError
        );
      }
    }
  };

  let userCreated = false;

  try {
    const { name, username, email, phone, password, confirmPassword, role } =
      req.body;

    if (!name || !username || !email || !phone || !password || !role) {
      await removeUploadedProfilePicture();
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (password.length < 6) {
      await removeUploadedProfilePicture();
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      await removeUploadedProfilePicture();
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });
    if (existingUser) {
      await removeUploadedProfilePicture();
      return res.status(409).json({ message: "User already exists" });
    }

    const profilePicturePath = req.file
      ? `/uploads/profile-pictures/${req.file.filename}`
      : null;

    const newUser = new User({
      name,
      username: normalizedUsername,
      email: normalizedEmail,
      phone,
      password,
      role,
      profilePicture: profilePicturePath,
    });

    await newUser.save();
    userCreated = true;

    if (!process.env.JWT_SECRET) {
      console.warn("JWT_SECRET is not configured. Skipping token generation.");
      return res.status(201).json({
        message: "User created successfully",
        user: sanitizeUser(newUser),
      });
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error("Register error", error);
    if (!userCreated) {
      await removeUploadedProfilePicture();
    }
    res.status(500).json({ error: error.message });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const loginInput =
      req.body.login || req.body.username || req.body.email || "";
    const { password } = req.body;

    if (!loginInput || !password) {
      return res.status(400).json({ message: "Login and password required" });
    }

    const user = await User.findByLogin(loginInput);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.warn("JWT_SECRET is not configured. Skipping token generation.");
      return res.json({ user: sanitizeUser(user) });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    user.lastLogin = new Date();
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ error: error.message });
  }
};
