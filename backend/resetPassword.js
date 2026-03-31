const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for password reset...");

        const email = "dinesh@gmail.com";
        const newPassword = "admin123";

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            console.log(`User ${email} not found!`);
            process.exit();
        }

        console.log(`Success! Password for ${email} has been reset to: ${newPassword}`);
        process.exit();
    } catch (error) {
        console.error("Error resetting password:", error);
        process.exit(1);
    }
};

resetPassword();
