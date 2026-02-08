const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    
    // Encryt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error in saving user:" + err.message);
  }
});

// get user bu email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    console.log(userEmail);
    const user = await User.findOne({ emailId: userEmail });
    res.send(user);
    // const users = await User.find({ emailId: userEmail });
    // if (users.length === 0) {
    //   return res.status(404).send("User not found");
    // } else {
    //   return res.send(users);
    // }
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});

// Delete a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});

// Update a user
app.patch("/user", async (req, res) => {
  console.log("Patch hit");

  const userId = req.body.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "gender", "age"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
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
