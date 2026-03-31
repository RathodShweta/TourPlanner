const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const {
    updateProfile,
    getProfile,
    uploadProfilePhoto,
    setGenderAndDefaultPhoto,
    followUser,
    unfollowUser,
    getAllUsers,
    acceptFollowRequest,
    declineFollowRequest,
    blockUser,
    unblockUser,
    getUserProfile
} = require("../controllers/userController");

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
router.get("/profile", protect, getProfile);

// PUT /api/users/update-profile
router.put("/update-profile", protect, updateProfile);

// POST /api/users/upload-photo
router.post("/upload-photo", protect, upload.single("photo"), uploadProfilePhoto);

// POST /api/users/set-gender
router.post("/set-gender", protect, setGenderAndDefaultPhoto);

// POST /api/users/follow
router.post("/follow", protect, followUser);

// POST /api/users/unfollow
router.post("/unfollow", protect, unfollowUser);

// POST /api/users/accept-follow
router.post("/accept-follow", protect, acceptFollowRequest);

// POST /api/users/decline-follow
router.post("/decline-follow", protect, declineFollowRequest);

// POST /api/users/block
router.post("/block", protect, blockUser);

// POST /api/users/unblock
router.post("/unblock", protect, unblockUser);

// GET /api/users/profile/:id
router.get("/profile/:id", protect, getUserProfile);

// GET /api/users/all (Suggestions)
router.get("/all", protect, getAllUsers);

module.exports = router;
