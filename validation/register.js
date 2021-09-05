const validator = require("validator");

const isEmpty = require("./is_empty");
module.exports = function validationRegisterInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.mobile = !isEmpty(data.mobile) ? data.mobile : "";

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    return {
      errors: "Name must be between 2 to 30 chararters",
      isValid: false,
    };
  }
  if (validator.isEmpty(data.name)) {
    return {
      errors: "Name is required",
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
      errors: "Password is required",
      isValid: false,
    };
  }
  if (validator.isEmpty(data.mobile)) {
    return {
      errors: "Mobile Number is required",
      isValid: false,
    };
  }
  if (!validator.isEmail(data.email)) {
    return {
      errors: "Email is invalid",
      isValid: false,
    };
  }
  if (!validator.isMobilePhone(data.mobile)) {
    return {
      errors: "Mobile Number is invalid",
      isValid: false,
    };
  }
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    return {
      errors: "Password must be between 6 to 30 characters",
      isValid: false,
    };
  }

  return {
    isValid: true,
  };
};
