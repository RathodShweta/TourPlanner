const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const { updateProfile, getProfile, uploadProfilePhoto } = require("../controllers/userController");

// Multer config for profile photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "profile_photos/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.id}-${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// GET /api/users/profile
router.get("/profile", authMiddleware, getProfile);

// PUT /api/users/update-profile
router.put("/update-profile", authMiddleware, updateProfile);

// POST /api/users/upload-photo
router.post("/upload-photo", authMiddleware, upload.single("photo"), uploadProfilePhoto);

module.exports = router;
