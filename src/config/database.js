const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://tusharmeena202:8TmzuqOj1sdHA5AW@namastenode.cm2hylf.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
