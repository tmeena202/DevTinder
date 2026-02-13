const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encryt the password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("EmailId is not present in DB");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // create a JWT token

      const token = await user.getJWT();
      console.log(token);

      //Add the token to cookie and then the response back to user
      res.cookie("token", token);

      res.send("Login successfully");
    } else {
      throw new error("Password is not correct");
    }
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});

authRouter.post("/logout", async (rq, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful");
});

module.exports = authRouter;
