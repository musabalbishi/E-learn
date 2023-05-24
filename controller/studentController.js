const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const salt = 10;
const { studentValidation, studentLoginValidation } = require("../validations");

//

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN);
};

module.exports = {
  // Create new student
  createStudent: async (req, res) => {
    const { studentName, email, password } = req.body;

    const { error } = studentValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const isEmailExist = await Student.exists({ email: req.body.email });
    if (isEmailExist) {
      res.status(400).json({ error: "email already exist" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, salt);
    const student = await Student.create({
      studentName: studentName,
      email: email,
      password: hashedPassword,
    });
    res.status(200).json({ success: "you have registered successfuly" });
  },
  //   login student
  studentLogin: async (req, res) => {
    const { error } = studentLoginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //
    const student = await Student.findOne({
      studentName: req.body.studentName,
    });
    if (!student)
      return res.status(400).json({ msg: "email or password is wrong" });
    //
    const validPass = await bcrypt.compare(req.body.password, student.password);
    if (!validPass) return res.status(400).json({ msg: "invalid password" });

    const token = createToken(student._id);
    //
    res.header("authorization", token).send(token);
  },

  //   get courses
  getCourses: async (req, res) => {
    // output the courses from the courses collection.
    const foundCourses = await Course.find();
    res.status(200).json(foundCourses);
    console.log(req.user.id);
  },

  //   add course
  addCourse: async (req, res) => {
    const courseId = req.params.courseId;
    const foundCourse = await Course.findById(courseId);
    const addedCourse = await Student.findByIdAndUpdate(req.user.id, {
      $addToSet: {
        courses: foundCourse._id,
      },
    }).select("-password");
    res.status(200).json(addedCourse);

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: {
        students: req.user.id,
      },
    });
    // add student id to instructor
    await Instructor.findByIdAndUpdate(foundCourse.instructor, {
      $addToSet: {
        students: req.user.id,
      },
    });
  },

  //   delete course
  deleteCourse: async (req, res) => {
    const courseId = req.params.courseId;
    const foundCourse = await Course.findById(courseId);
    const deletedCourse = await Student.findByIdAndUpdate(req.user.id, {
      $pull: {
        courses: foundCourse._id,
      },
    }).select("-password");
    res.status(200).json(deletedCourse);

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        students: req.user.id,
      },
    });
    // add student id to instructor
    await Instructor.findByIdAndUpdate(foundCourse.instructor, {
      $pull: {
        students: req.user.id,
      },
    });
  },

  //   view my courses
  getMyCourses: async (req, res) => {
    const myCourses = await Course.find({ students: req.user.id });
    res.status(200).json(myCourses);
  },
};
