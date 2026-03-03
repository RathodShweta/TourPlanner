const User = require("../models/User");

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;

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
      { name, email, phone: phone || "" },
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
        phone: updatedUser.phone
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
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
