const User = require('../models/user.model');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signup = async (data) => {

  const { firstName, lastName, email, password, roles } = data || {};
  //✔️Business Logic Check (User-friendly error)
  const existingUser = await User.findOne({ email: data.email }, { returnDocument: 'after' }, { runValidators: true });

  if (existingUser) {
    throw new Error('Email already exists');
  }
  try {
    const bycryptpassword = await User.passwordHashing(password);
    const user = new User({firstName, lastName,roles, email, password: bycryptpassword});
    await user.save();
    return user;

  } catch (e) {
    throw new Error(`Signup failed - ${e.message}`);
  }
};

const login = async (req, res) => {

  const { email, password } = req.body || {};
  try { 
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await existingUser.isPasswordValid(password);
    if (!isPasswordValid) {
      // 'we should not mentiond it the Invalid credentials- password is incorrect' we never expose the sensitive info
      throw new Error('Invalid credentials');
    }
     
    const token = await existingUser.getJWT();
    // set token in HTTP-only cookie 1000 × 60 × 60 = 3,600,000 ms = 1 hour
    res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true, secure: true });
    
    return existingUser;

  } catch (e) {
    throw new Error(`Login failed -${e.message}`);
  }
};

const updateUser = async (req) => {

  //body | params | query
  const userId = req.user._id;
  const updateData = req.body;
  const updatePasword = req.body.password;

  if (updatePasword) {
    updateData.password = await User.passwordHashing(updatePasword);
  }

  try {
    //updated document & run schema validation
    const existingUser = await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after', runValidators: true }).select('-password');

    if (!existingUser) {
      throw new Error('User not found');
    }
    return existingUser;

  } catch (e) {
    throw new Error(`User update failed -${e.message}`);
  }
}

const getUser = async (params) => {

  const userId = params;

  try {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      throw new Error('User not found');
    }
    return existingUser;

  } catch (e) {
    throw new Error(`Get user failed -${e.message}`);
  }
};

module.exports = { signup, updateUser ,getUser,login};

































// const update = async (data)=>{

// const userId = data._id;
// const updateData = data;

// const existingUser = await User.findByIdAndUpdate({ _id:userId }, updateData);

//   if (!existingUser) {
//     throw new Error('User not found');
//   }

//   try {
//     Object.assign(existingUser, updateData);
//     await existingUser.save();
//     return existingUser;

//   } catch (e) {
//     throw new Error(e.message);
//   } 
// }








// const token = req.cookies?.token;
// console.log('Cookies object in update service:', token); // Debugging log
 // const isPasswordValid = await bycrypt.compare(password, existingUser.password); --- IGNORE ---
    // const isPasswordValid = await bycrypt.compare(password, existingUser.password);

     // Generate JWT token
    // const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        //  const decoded = jwt.verify(token, 'Dev@dinder$7799!'); // Replace with your secret key
    //  const userIdFromToken = decoded.userId;
    //  console.log('User ID extracted from token:', userIdFromToken); // Debugging log