const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const setupAdminAction = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for admin setup...");

        const dineshEmail = "dinesh@gmail.com";
        const adminEmail = "admin@gmail.com";
        const password = "admin123";
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Delete 'dinesh' to avoid clutter if needed
        console.log(`Removing ${dineshEmail}...`);
        await User.deleteOne({ email: dineshEmail });

        // 2. Ensure admin@gmail.com is set up correctly
        console.log(`Setting up ${adminEmail}...`);
        await User.findOneAndUpdate(
            { email: adminEmail },
            {
                name: "Admin",
                password: hashedPassword,
                isAdmin: true
            },
            { upsert: true, new: true }
        );

        console.log("-----------------------------------------");
        console.log(`✅ SUCCESS! LOGIN WITH:`);
        console.log(`EMAIL:    ${adminEmail}`);
        console.log(`PASSWORD: ${password}`);
        console.log("-----------------------------------------");

        process.exit();
    } catch (error) {
        console.error("Error setting up admin:", error);
        process.exit(1);
    }
};

setupAdminAction();
