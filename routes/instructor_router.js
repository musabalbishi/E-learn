const router = require("express").Router();
const { verifyToken, checkInstructor } = require("../middleware/verifyToken");
const Controller = require("../controller/authController");
//landing page
router.get("/", (req, res) => {
  res.render("landingPage.ejs");
});

// dashboard
router.get("/dashboard", checkInstructor, Controller.getDashboard);
// register instructor
router.get("/register", Controller.getRegisterPage);
router.post("/register", Controller.createInstructor);

// login instructor
router.get("/login", Controller.getLoginPage);
router.post("/login", Controller.loginInstructor);

// add course (one to one)
router.get("/addCourse", checkInstructor, Controller.getAddCoursePage);
router.post("/addCourse", checkInstructor, Controller.addCourse);

// Details
router.get("/details/:courseId", checkInstructor, Controller.getDetails);

// update
router.get(
  "/updateCourse/:courseId",
  checkInstructor,
  Controller.getUpdateCoursePage
);

router.post(
  "/updateCourse/:courseId",
  checkInstructor,
  Controller.updateCourse
);

// Delete the course
router.get("/deleteCourse/:id", checkInstructor, Controller.deleteCourse);
//
router.get("/myCourses", checkInstructor, Controller.getCourses);
// logout
router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { expiresIn: "1000" });
  res.redirect("/instructor/login");
});
module.exports = router;
