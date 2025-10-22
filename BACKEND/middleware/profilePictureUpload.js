const multer = require("multer");
const path = require("path");
const fs = require("fs");

const profilePicturesDir = path.join(
  __dirname,
  "..",
  "uploads",
  "profile-pictures"
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync(profilePicturesDir, { recursive: true });
      cb(null, profilePicturesDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error("Only JPG, PNG, or WebP images are allowed."));
      return;
    }
    cb(null, true);
  },
});

const handleProfilePictureUpload = (req, res, next) => {
  const uploadSingle = upload.single("profilePicture");

  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "Profile picture must be 3 MB or smaller." });
      }
      return res
        .status(400)
        .json({ message: err.message || "Image upload failed." });
    }
    return next();
  });
};

module.exports = handleProfilePictureUpload;
