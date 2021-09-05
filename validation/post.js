const validator = require("validator");

const isEmpty = require("./is_empty");
module.exports = function validationPostInput(data) {
  let errors = {};
  data.description = !isEmpty(data.description) ? data.description : "";
  data.title = !isEmpty(data.title) ? data.title : "";

  if (!validator.isLength(data.description, { min: 10, max: 300 })) {
    return {
      errors: "Description must be between 10 to 300",
      isValid: false,
    };
  }
  if (validator.isEmpty(data.description)) {
    return {
      errors: "Description is required",
      isValid: false,
    };
  }

  if (!validator.isLength(data.title, { min: 5, max: 300 })) {
    return {
      errors: "Title must be between 5 to 300",
      isValid: false,
    };
  }
  if (validator.isEmpty(data.title)) {
    return {
      errors: "Title is required",
      isValid: false,
    };
  }

  return {
    isValid: true,
  };
};
