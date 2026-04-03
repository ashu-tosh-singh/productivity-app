const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ✅ DB connection successful ✅`);
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1); // Kill the process — app can't run without DB
  }
};

module.exports = connectDB;