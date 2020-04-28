const Validator = require("validator");
const isEmpty = require("is-empty");
var passwordValidator = require('password-validator');
 
// Create a schema
var schema = new passwordValidator();
 
// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(30)                                   // Maximum length 30
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().symbols()                                // Must have symbols

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : "",
  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : "";

  if (!schema.validate(data.password)) errors.password = "Password must contain at least one uppercase, one number and one symbol, and at least 8 characters.";
  if (Validator.isEmpty(data.password_confirm)) errors.password_confirm = "Confirm password field is required";
  if (!Validator.equals(data.password, data.password_confirm)) errors.password_confirm = "Passwords must match";
  if (Validator.isEmpty(data.username)) errors.username = "Username field is required"
  if (Validator.isEmpty(data.lastname)) errors.lastname = "Name field is required";
  if (Validator.isEmpty(data.firstname)) errors.firstname = "Firstname field is required";
  if (Validator.isEmpty(data.password)) errors.password = "Password field is required";
  if (Validator.isEmpty(data.email))
    errors.email = "Email field is required";
  else if (!Validator.isEmail(data.email))
    errors.email = "Email is invalid";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};