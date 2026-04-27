
const validator = require('validator');
const loginValidation = (req, res, next) => {

  const { email, password } = req.body || {};
  const errors = {};

  const emailTrimmed = email?.trim();

  if (!emailTrimmed) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(emailTrimmed)) {
    errors.email = 'Invalid email format';
  }

  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  next();
}
module.exports = { loginValidation };