const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const Instructor = require("../models/Instructor");

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  // check if token exist
  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN, (e, decodedToken) => {
      if (e) {
        console.log(e.message);
        res.redirect("/instructor/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/instructor/login");
  }
};

const checkInstructor = (req, res, next) => {
  const tokenn = req.cookies.jwt;
  if (tokenn) {
    jwt.verify(tokenn, process.env.JWT_TOKEN, async (e, decodedToken) => {
      if (e) {
        console.log(e.message);
        res.locals.instructor = null;
        next();
      } else {
        console.log(decodedToken);
        let instructor = await Instructor.findById(decodedToken.id);
        res.locals.instructor = instructor;
        next();
      }
    });
  } else {
    res.locals.instructor = null;
    next();
  }
};

const verifyStudentToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).send("invalid token");
  }
};

module.exports = { verifyToken, checkInstructor, verifyStudentToken };
