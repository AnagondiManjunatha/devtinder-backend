const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || undefined;

  // Log the error
  if (status >= 500) {
    logger.error('Server Error', { 
      status, 
      message, 
      stack: err.stack,
      path: req.path,
      method: req.method 
    });
  } else {
    logger.warn('Client Error', { 
      status, 
      message, 
      path: req.path,
      method: req.method 
    });
  }

  return res.status(status).json({
    success: false,
    message,
    ...(errors ? { errors } : {})
  });
};

module.exports = { errorHandler };
