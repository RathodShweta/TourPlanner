const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for admin promotion...");

        const user = await User.findOne();
        if (!user) {
            console.log("No users found in database. Please register first!");
            process.exit();
        }

        user.isAdmin = true;
        await user.save();

        console.log(`Success! ${user.email} is now an Admin.`);
        process.exit();
    } catch (error) {
        console.error("Error promoting user:", error);
        process.exit(1);
    }
};

makeAdmin();
