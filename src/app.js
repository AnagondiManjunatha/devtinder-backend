const express = require('express');
const authRouter = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');

const connectionRoutes = require('./routes/connections.routes');

const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRouter);

app.use('/user', profileRoutes);
app.use('/connections', connectionRoutes);


module.exports = app;