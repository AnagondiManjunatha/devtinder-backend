const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validator = require('validator');

// What REAL DB-Level Validations
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 2
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 2
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is not a format');
      }

    }

  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    validate(value) {
      if (!validator.isStrongPassword(value, { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new Error('Password must be at least 10 characters long and include uppercase, lowercase, number, and special character.');
      }
    },
  },
  phone: {
    type: String,
    optional: true
  },
  profilePic: {
    type: String,
    validate: {
      validator: function (value) {
        return !value || validator.isURL(value);
      },
      message: 'Profile picture must be a valid URL'
    }
  },
  roles: {
    type: String,
    default: 'user'
  },
  gender: {
    type: String,
    validate(value) {
      const allowedGenders = ['male', 'female', 'other'];
      if (!allowedGenders.includes(value.toLowerCase())) {
        throw new Error('Gender must be either "male", "female", or "other".');
      }
    }
  }

}, { timestamps: true });

userSchema.methods.getJWT = async function () {
  const User = this;
  const token = jwt.sign({ userId: User._id, email: User.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}
userSchema.methods.isPasswordValid = async function (userInputPassword) {
  const User = this;

  // If the password is missing (e.g. not selected or missing from DB), fail safely.
  if (!User.password) return false;

  const isMatch = await bcrypt.compare(userInputPassword, User.password);
  return isMatch;
}
userSchema.statics.passwordHashing = async function (plainPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

// userSchema.methods.passwordComare = async function(userInputPassword) {
//   const User = this;

//   // If the password is missing (e.g. not selected or missing from DB), fail safely.
//   if (!User.password) return false;

//   const isMatch = await bcrypt.compare(userInputPassword, User.password);
//   return isMatch;
// }
module.exports = mongoose.model('User', userSchema);




























































// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 2,
//       maxlength: 50,
//       validate: {
//         validator: (value) => /^[a-zA-Z]+$/.test(value),
//         message: "First name should contain only letters.",
//       },
//     },

//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 2,
//       maxlength: 50,
//       validate: {
//         validator: (value) => /^[a-zA-Z]+$/.test(value),
//         message: "Last name should contain only letters.",
//       },
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       validate: {
//         validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
//         message: "Please provide a valid email address.",
//       },
//     },

// /*-At least 1 uppercase
//   -At least 1 lowercase
//   -At least 1 number
//   -At least 1 special character
//   -Minimum 10 characters
// */
//     password: {
//       type: String,
//       required: true,
//       minlength: 10,
//       select: false,
//       validate: {
//         validator: (value) =>
//           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{10,}$/.test(value),
//         message:
//           "Password must contain uppercase, lowercase, number and special character.",
//       },
//     },

//     phone: {
//       type: String,
//       validate: {
//         validator: (value) => !value || /^\+?[1-9]\d{7,14}$/.test(value),
//         message: "Please provide a valid international phone number.",
//       },
//     },

//     profilePic: {
//       type: String,
//       validate: {
//         validator: (value) =>
//           !value || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(value),
//         message: "Profile picture must be a valid image URL.",
//       },
//     },

//     roles: {
//       type: [String],
//       default: ["user"],
//       validate: {
//         validator: (roles) => {
//           const allowedRoles = ["user", "admin", "moderator"];
//           return roles.every((role) => allowedRoles.includes(role));
//         },
//         message: "Invalid role detected.",
//       },
//     },

//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//     },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("User", userSchema);
