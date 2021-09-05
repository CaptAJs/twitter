const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const validateEmail = (email) => {
  if (isEmpty(email)) return "Email is required";
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
};

export const validateName = (name) => {
  if (isEmpty(name)) return "Name is required";
  if (name.length < 2 && name.length > 30)
    return "Name must be between 2 to 30 chararters";
};

export const validatePassword = (password) => {
  if (isEmpty(password)) return "Password is required";
  const passwordRegex =
    "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 20}$";
  return passwordRegex.test(password);
};
