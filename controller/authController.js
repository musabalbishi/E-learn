const Instructor = require("../models/Instructor");
const Course = require("../models/Course");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const { registerationValidation, loginValidation } = require("../validations");
const bcrypt = require("bcrypt");

const salt = 10;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN);
};
module.exports = {
  //create instructor
  getRegisterPage: (req, res) => {
    res.render("regForm.ejs");
  },
  createInstructor: async (req, res) => {
    // deconstructing
    const { username, email, phone, password } = req.body;
    // validate inputs
    const { error } = registerationValidation(req.body);
    //   this is for the api
    if (error) return res.status(400).send(error.details[0].message);
    // Check if Email exists
    const isEmailExist = await Instructor.exists({ email: req.body.email });
    if (isEmailExist) {
      res.status(400).json({ msg: "email already exist" });
      return;
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    // create instructor
    const instructor = await Instructor.create({
      username: username,
      email: email,
      phone: phone,
      password: hashedPassword,
    });
    const token = createToken(instructor._id);
    res.cookie("jwt", token, { httpOnly: true });
    res.status(201).json({ instructor: instructor._id });
    //   res.redirect("/instructor/login");
  },
  //login
  getLoginPage: (req, res) => {
    res.render("loginForm.ejs");
  },
  loginInstructor: async (req, res) => {
    const instructor = await Instructor.findOne({
      username: req.body.username,
    });
    //
    if (!instructor)
      return res.status(400).json({ error: "username or password is wrong" });
    //
    const password = req.body.password;
    const auth = await bcrypt.compare(password, instructor.password);
    if (auth) {
      const token = createToken(instructor._id);
      res.cookie("jwt", token, { httpOnly: true });
      // res.send({ instructor: instructor._id });
      res.redirect("/instructor/");
    } else {
      return res.json({ error: "wrong password" });
    }
  },
  //add course
  getAddCoursePage: (req, res) => {
    res.render("addCourse.ejs");
  },
  addCourse: async (req, res) => {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      classroom: req.body.classroom,
      instructor: res.locals.instructor._id,
    });
    await Instructor.findByIdAndUpdate(res.locals.instructor._id, {
      $addToSet: {
        courses: course._id,
      },
    });
    res.redirect("/instructor/");
  },

  // update course
  getUpdateCoursePage: async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId);
    res.render("updateCourse.ejs", { course: course });
  },
  updateCourse: async (req, res) => {
    await Course.findByIdAndUpdate(req.params.courseId, {
      name: req.body.name,
      description: req.body.description,
      classroom: req.body.classroom,
    });
    res.redirect("/instructor/");
  },

  deleteCourse: async (req, res) => {
    const deletedCourse = await Course.findById(req.params.id);
    await Instructor.findByIdAndUpdate("646c941689950089163b4fcf", {
      $pull: { courses: deletedCourse._id },
    });
    await Course.findByIdAndDelete(req.params.id);
    res.redirect("/instructor/");
  },

  // get courses
  getCourses: async (req, res) => {
    cDetails = await Instructor.findById(res.locals.instructor._id).populate(
      "courses"
    );
    res.render("myCourses.ejs", { det: cDetails });
  },
  // details page
  getDetails: async (req, res) => {
    const courseDetails = await Course.findById(req.params.courseId);
    res.render("details.ejs", { details: courseDetails });
  },
};
