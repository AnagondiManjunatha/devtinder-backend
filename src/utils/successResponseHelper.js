const successResponseHelper = (res, status, message, data) => {
  return res.status(status).json({ success: true,  message, data  });
  
};

const getProfileData = (req, res, next) => {

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  next();
}

module.exports = {successResponseHelper, getProfileData};
  
