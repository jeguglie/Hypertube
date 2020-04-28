const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.email = !isEmpty(data.email) ? data.email : "";

    // Username checks
    if (Validator.isEmpty(data.email)) {
        errors.err_email = "Email field is required";
    }
    if (!Validator.isEmail(data.email)){
        errors.err_email = "Email is incorrect";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};