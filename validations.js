const Joi = require("joi");

// Registeration Validation
const registerationValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(9).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
// Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
// student validation
const studentValidation = (data) => {
  const schema = Joi.object({
    studentName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
const studentLoginValidation = (data) => {
  const schema = Joi.object({
    studentName: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
module.exports.registerationValidation = registerationValidation;
module.exports.loginValidation = loginValidation;
module.exports.studentValidation = studentValidation;
module.exports.studentLoginValidation = studentLoginValidation;
