const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

async function connectDB() {
  const conn = await mongoose.connect(process.env.DB_URL);
  if (!conn) console.log("connection error");
  console.log("database is connected successfully");
}

connectDB();
