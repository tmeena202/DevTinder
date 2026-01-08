const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error in saving user:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established ....");
    app.listen(3000, () => {
      console.log("Server is running on 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed ....");
  });
