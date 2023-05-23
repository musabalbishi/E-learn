const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const instructorSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    min: [9, "must be 9 numbers"],
    max: [9, "must be 9 numbers"],
  },
  password: {
    type: String,
    required: true,
    min: [6, "must be atleast 6 charachters"],
  },
});

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
