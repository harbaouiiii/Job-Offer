const mongoose = require("mongoose");
require('dotenv').config();

const ConnectDB = () => {
  mongoose
    .connect(
      process.env.MONGO_URI
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(err));
};

module.exports = ConnectDB;