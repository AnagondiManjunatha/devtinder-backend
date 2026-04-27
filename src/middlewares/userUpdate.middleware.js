//API Level Validations for update
const updateValidation = (req, res, next) => {

  const updateFields = Object.keys(req.body);
  const allowedFields = ['firstName', 'lastName', 'password', 'gender'];
  const isValidUpdate = updateFields.every(field => allowedFields.includes(field));

  if (!isValidUpdate) {
    return res.status(400).json({ error: 'Invalid fields in update. Allowed fields: firstName, lastName, password, gender' });
  }
  next();
  
}


module.exports = { updateValidation};