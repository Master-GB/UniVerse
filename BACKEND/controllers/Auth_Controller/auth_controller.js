const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
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

const deleteFileIfExists = async (absolutePath) => {
  if (!absolutePath) return;
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.error("Failed to remove file", absolutePath, error);
    }
  }
};

const resolveStoredUploadPath = (storedPath) => {
  if (!storedPath) return null;
  const normalized = storedPath.startsWith("/")
    ? storedPath.slice(1)
    : storedPath;
  return path.join(__dirname, "..", "..", normalized);
};

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

    // creates a JWT token after successfull login
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

// Get authenticated user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Get profile error", error);
    res.status(500).json({ error: error.message });
  }
};

// Update authenticated user profile
exports.updateProfile = async (req, res) => {
  const cleanupNewUpload = async () => {
    if (req.file?.path) {
      await deleteFileIfExists(req.file.path);
    }
  };

  try {
    const userId = req.user?.userId;
    if (!userId) {
      await cleanupNewUpload();
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      await cleanupNewUpload();
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {
      name: req.body?.name?.trim(),
      username: req.body?.username?.trim()?.toLowerCase(),
      email: req.body?.email?.trim()?.toLowerCase(),
      phone: req.body?.phone?.trim(),
      password: req.body?.password,
      removeProfilePicture: ["true", true].includes(
        req.body?.removeProfilePicture
      ),
    };

    if (updates.password && updates.password.length < 6) {
      await cleanupNewUpload();
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (updates.username && updates.username !== user.username) {
      const existingUsername = await User.findOne({
        username: updates.username,
        _id: { $ne: userId },
      });
      if (existingUsername) {
        await cleanupNewUpload();
        return res.status(409).json({ message: "Username already in use" });
      }
    } else {
      updates.username = undefined;
    }

    if (updates.email && updates.email !== user.email) {
      const existingEmail = await User.findOne({
        email: updates.email,
        _id: { $ne: userId },
      });
      if (existingEmail) {
        await cleanupNewUpload();
        return res.status(409).json({ message: "Email already in use" });
      }
    } else {
      updates.email = undefined;
    }

    if (updates.name) {
      user.name = updates.name;
    }

    if (updates.phone) {
      user.phone = updates.phone;
    }

    if (updates.username) {
      user.username = updates.username;
    }

    if (updates.email) {
      user.email = updates.email;
    }

    if (updates.password) {
      user.password = updates.password;
    }

    const previousPicturePath = user.profilePicture;
    if (req.file) {
      user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    } else if (updates.removeProfilePicture) {
      user.profilePicture = null;
    }

    await user.save();

    if (req.file && previousPicturePath) {
      const absolutePreviousPath = resolveStoredUploadPath(previousPicturePath);
      await deleteFileIfExists(absolutePreviousPath);
    }

    if (updates.removeProfilePicture && previousPicturePath) {
      const absolutePreviousPath = resolveStoredUploadPath(previousPicturePath);
      await deleteFileIfExists(absolutePreviousPath);
    }

    res.json({
      message: "Profile updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Update profile error", error);
    if (req.file?.path) {
      await deleteFileIfExists(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
};

// Logout user (stateless JWT - client should discard token)
exports.logout = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.lastLogout = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error", error);
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
