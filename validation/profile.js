const validator = require("validator");

const isEmpty = require("./is_empty");
module.exports = function validationProfileInput(data) {
  let errors = {};
  data.handle = !isEmpty(data.handle) ? data.handle : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    return {
      errors: "handle needs to be between 2 and 40 characters",
      isValid: false,
    };
  }
  if (validator.isEmpty(data.handle)) {
    return {
      errors: "handle required",
      isValid: false,
    };
  }

  return {
    isValid: true,
  };
};
