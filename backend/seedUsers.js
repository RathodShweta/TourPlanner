const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const password = await bcrypt.hash("password123", 10);

        const users = [
            { name: "John Doe", email: "john@example.com", password, gender: "male" },
            { name: "Jane Smith", email: "jane@example.com", password, gender: "female" },
            { name: "Alice Brown", email: "alice@example.com", password, gender: "female" },
            { name: "Bob Wilson", email: "bob@example.com", password, gender: "male" },
            { name: "Charlie Davis", email: "charlie@example.com", password, gender: "male" }
        ];

        for (const user of users) {
            const exists = await User.findOne({ email: user.email });
            if (!exists) {
                await User.create(user);
                console.log(`Created user: ${user.name}`);
            } else {
                console.log(`User already exists: ${user.name}`);
            }
        }

        console.log("Seeding completed!");
        process.exit();
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedUsers();
