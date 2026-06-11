const express = require('express');
const authRouter = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const connectionRoutes = require('./routes/connections');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');

const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip, userId: req.user?._id });
  next();
});

// Routes
app.use('/auth', authRouter);
app.use('/user', profileRoutes);
app.use('/connections', connectionRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;