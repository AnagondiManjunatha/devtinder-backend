require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/utils/logger');

const connectDB = require('./src/config/db');

connectDB();
logger.info('Database connected successfully');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});