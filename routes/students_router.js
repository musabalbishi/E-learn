const router = require("express").Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const {
  verifyStudentToken,
  verifyStudent,
} = require("../middleware/verifyToken");
const salt = 10;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN);
};

//
const Controller = require("../controller/studentController");

router.post("/register", Controller.createStudent);

router.post("/login", Controller.studentLogin);

// get all course
router.get("/courses", verifyStudentToken, Controller.getCourses);

router.post("/courses/add/:courseId", verifyStudentToken, Controller.addCourse);

// PS : check again if the student id was deleted from the instructor collection
router.delete(
  "/courses/delete/:courseId",
  verifyStudentToken,
  Controller.deleteCourse
);

router.get("/courses/myCourses", verifyStudentToken, Controller.getMyCourses);
module.exports = router;
