const mongoose = require("mongoose");
const Hotel = require("../models/Hotel");

const hotelData = require("./hotelData"); // export array from hotelData.js

mongoose
  .connect("mongodb://localhost:27017/tourplanner")
  .then(async () => {
    console.log("MongoDB connected");

    await Hotel.deleteMany(); // optional: clean old data
    await Hotel.insertMany(hotelData);

    console.log("Hotels inserted successfully");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
