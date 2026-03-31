const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const fixAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Fixing Admin Account...");

        const email = "admin@gmail.com";
        const password = "admin123";
        const hashedPassword = await bcrypt.hash(password, 10);

        // Delete any existing ones to be super clean
        await User.deleteMany({ email: email });

        const newUser = new User({
            name: "Admin",
            email: email,
            password: hashedPassword,
            isAdmin: true
        });

        await newUser.save();

        console.log("-----------------------------------------");
        console.log(`✅ FIXED! LOGIN WITH:`);
        console.log(`EMAIL:    ${email}`);
        console.log(`PASSWORD: ${password}`);
        console.log("-----------------------------------------");

        process.exit();
    } catch (error) {
        console.error("Error fixing admin:", error);
        process.exit(1);
    }
};

fixAdmin();
