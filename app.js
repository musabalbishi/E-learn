const express = require("express");
const DatabaseConnection = require("./conn");
require("dotenv").config();
const parser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

// connect to mongoDB
DatabaseConnection;

//
const app = express();
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const instructorRouter = require("./routes/instructor_router");
app.use("/instructor", instructorRouter);

// Port
app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});
