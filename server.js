require('dotenv').config();

const app = require('./src/app');

const connectDB = require('./src/config/db');

connectDB();
console.log('Database connected successfully.....!');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.....!`);
});