// these functions are used multiple times to validate data

// the email address is validated against the standard format of emails
export const emailValidator = (email) => {
  const re =
    /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
  if (re.test(email)) {
    return email;
  } else {
    throw `Invalid email`;
  }
};

// the password should contain a capital letter, a small letter, a number, and a special character and has to 6 or more characters
export const passwordValidator = (password) => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (re.test(password)) {
    return password;
  } else {
    throw `Invalid password`;
  }
};

// basic string validation
export const stringValidator = (str, type) => {
  if (!str || str.trim().length == 0) throw new Error(`${type} cannot be empty`);
  if (typeof str !== "string") throw new Error(`${type} should be a string`);

  // Check for numbers
  const hasNumber = /\d/;
  if (hasNumber.test(str)) throw new Error(`${type} should not contain numbers`);

  // Check for special characters
  const hasSpecialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (hasSpecialChar.test(str))
    throw new Error(`${type} should not contain special characters`);

  return str;
};
