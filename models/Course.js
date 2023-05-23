const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  description: String,
  classroom: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
  },
  students: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
