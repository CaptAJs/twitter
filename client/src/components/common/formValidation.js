const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const validateEmail = (email, type = "register") => {
  if (isEmpty(email)) return "Email is required";
  if (type !== "register") return false;
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !emailRegex.test(String(email).toLowerCase()) && "Email is invalid";
};

export const validateName = (name) => {
  if (isEmpty(name)) return "Name is required";
  if (name.length < 2 || name.length > 30)
    return "Name must be between 2 to 30 chararters";
  return false;
};

export const validatePassword = (password, type = "register") => {
  if (isEmpty(password)) return "Password is required";
  if (type !== "register") return false;
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  return (
    !passwordRegex.test(password) &&
    "At least one small, captial alphabet, one digit & special char"
  );
};

export const validateMobile = (mobileNumber, type = "register") => {
  if (isEmpty(mobileNumber)) return "Mobile number is required";
  if (type !== "register") return false;
  const mobileRegex = /^[6-9]\d{9}$/;
  return !mobileRegex.test(mobileNumber) && "Mobile Number must have 10 digits";
};
