
const validator = require('validator');

const validateSignup = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body || {};
  const errors = {};

  if (!firstName?.trim()) errors.firstName = 'First name is required';
  if (!lastName?.trim()) errors.lastName = 'Last name is required';
  if (!email?.trim()) errors.email = 'Email is required';
  if (!password) errors.password = 'Password is required';

  if (password && !validator.isStrongPassword(password, { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
    errors.password = 'Password must be at least 10 chars with upper, lower, number & symbol';
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  next();
};


module.exports = { validateSignup };