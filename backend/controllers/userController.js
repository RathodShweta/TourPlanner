const User = require("../models/User");

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, gender } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if email is taken by another user
    const emailTaken = await User.findOne({ email, _id: { $ne: userId } });
    if (emailTaken) {
      return res.status(400).json({ message: "Email already in use by another account" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone: phone || "", gender: gender || "" },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        photo: updatedUser.photo,
        gender: updatedUser.gender,
        isAdmin: updatedUser.isAdmin
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= GET PROFILE ================= */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("followers", "name email photo")
      .populate("following", "name email photo")
      .populate("followRequests", "name email photo");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= UPLOAD PROFILE PHOTO ================= */
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { photo: req.file.filename },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile photo updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        gender: user.gender,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("Upload photo error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
/* ================= SET GENDER & DEFAULT PHOTO ================= */
exports.setGenderAndDefaultPhoto = async (req, res) => {
  try {
    const { gender, photo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { gender, photo },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Initial preferences set",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        photo: updatedUser.photo,
        gender: updatedUser.gender,
        isAdmin: updatedUser.isAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= SEND FOLLOW REQUEST ================= */
exports.followUser = async (req, res) => {
  try {
    const { followId } = req.body;
    const userId = req.user.id;

    if (userId === followId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Add my ID to target user's followRequests list
    await User.findByIdAndUpdate(followId, {
      $addToSet: { followRequests: userId }
    });

    res.json({ message: "Follow request sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= ACCEPT FOLLOW REQUEST ================= */
exports.acceptFollowRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user.id;

    // 1. Remove from requests
    await User.findByIdAndUpdate(userId, {
      $pull: { followRequests: requesterId }
    });

    // 2. MUTUAL FOLLOW as per user request: "both added to each other's Followers and Following"

    // Me following requester
    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: requesterId, followers: requesterId }
    });

    // Requester following me
    await User.findByIdAndUpdate(requesterId, {
      $addToSet: { following: userId, followers: userId }
    });

    res.json({ message: "Follow request accepted (Mutual Connection established)" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= DECLINE FOLLOW REQUEST ================= */
exports.declineFollowRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { followRequests: requesterId }
    });

    res.json({ message: "Follow request declined" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= UNFOLLOW USER ================= */
exports.unfollowUser = async (req, res) => {
  try {
    const { unfollowId } = req.body;
    const userId = req.user.id;

    // Mutual unfollow
    await User.findByIdAndUpdate(userId, {
      $pull: { following: unfollowId, followers: unfollowId }
    });

    await User.findByIdAndUpdate(unfollowId, {
      $pull: { following: userId, followers: userId }
    });

    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= GET ALL USERS (Suggestions) ================= */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("name email photo followers following followRequests gender")
      .limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= BLOCK USER ================= */
exports.blockUser = async (req, res) => {
  try {
    const { blockId } = req.body;
    const userId = req.user.id;

    if (userId === blockId) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { blockedUsers: blockId },
      $pull: { following: blockId, followers: blockId, followRequests: blockId }
    });

    // Also remove me from their lists
    await User.findByIdAndUpdate(blockId, {
      $pull: { following: userId, followers: userId, followRequests: userId }
    });

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= UNBLOCK USER ================= */
exports.unblockUser = async (req, res) => {
  try {
    const { unblockId } = req.body;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { blockedUsers: unblockId }
    });

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= GET OTHER USER PROFILE ================= */
exports.getUserProfile = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id)
      .select("name email photo gender followers following followRequests")
      .populate("followers", "name email photo")
      .populate("following", "name email photo");

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(targetUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
