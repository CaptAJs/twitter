const validator = require("validator");

const isEmpty = require("./is_empty");
module.exports = function validationLoginInput(data) {
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!validator.isEmail(data.email)) {
    return {
      errors: "Email is invalid",
      isValid: false,
    };
  }
  if (validator.isEmpty(data.email)) {
    return {
      errors: "Email is required",
      isValid: false,
    };
  }
  if (validator.isEmpty(data.password)) {
    return {
      errors: "password is required",
      isValid: false,
    };
  }

  return {
    isValid: true,
  };
};
