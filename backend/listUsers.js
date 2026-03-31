const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, "name email isAdmin password");
        console.log("USERS IN DB:");
        users.forEach(u => {
            console.log(`- ${u.name} | ${u.email} | isAdmin: ${u.isAdmin} | PassHash: ${u.password?.substring(0, 10)}...`);
        });
        process.exit();
    } catch (error) {
        console.error("Error listing users:", error);
        process.exit(1);
    }
};

listUsers();
