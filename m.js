const loginValidation = (req, res, next) => {

  const { email, password } = req.body || {};

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
    const errors = {};

  if (!email?.trim()) errors.email = 'Email is required';
  if (!password) errors.password = 'Password is required';

  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  // if (!email || !password) {
  //   return res.status(400).json({ error: 'Missing required fields: email, password' });
  // }
  next();
}

const getUserValidation = (req, res, next) => {

  const { id } = req.params || {};
  // console.log('User ID from params:', id); // Debugging log

  if (!id) {
    return res.status(400).json({ error: 'Missing required field: id' });
  }
  next();
}


const getUserController = async (req, res) => {

    try {
        //Controller + handle the http requests | Read request data (req.body, req.params, req.query)
        const user = await User.findById(req.params?.id).select('-password');

        if (!user) {
            throw new Error('User not found');
        }

        return successResponseHelper(res, 200, 'User fetched successfully', user);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};