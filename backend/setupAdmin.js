const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const setupAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for admin setup...");

        const oldEmail = "dinesh@gmail.com";
        const newEmail = "admin@gmail.com";
        const password = "admin123";

        // 1. Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Try to update 'dinesh' to 'admin'
        let user = await User.findOne({ email: oldEmail });

        if (user) {
            user.email = newEmail;
            user.name = "Admin User";
            user.password = hashedPassword;
            user.isAdmin = true;
            await user.save();
            console.log(`Success! Updated existing user ${oldEmail} to ${newEmail}`);
        } else {
            // If dinesh doesn't exist, just create the admin user
            user = await User.findOneAndUpdate(
                { email: newEmail },
                { name: "Admin User", password: hashedPassword, isAdmin: true },
                { upsert: true, new: true }
            );
            console.log(`Success! Created/Updated ${newEmail} as Admin.`);
        }

        console.log("-----------------------------------------");
        console.log(`NEW ADMIN LOGIN: ${newEmail}`);
        console.log(`NEW ADMIN PASS:  ${password}`);
        console.log("-----------------------------------------");

        process.exit();
    } catch (error) {
        console.error("Error setting up admin:", error);
        process.exit(1);
    }
};

setupAdmin();
