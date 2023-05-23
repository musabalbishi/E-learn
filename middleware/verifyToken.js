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

module.exports = { verifyToken, checkInstructor };
