const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //validate my token
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send(" Something went wrong:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.send(` ${loggedInUser.firstName}, your Profile updated successfully`);
  } catch (err) {
    res.status(400).send(" Something went wrong:" + err.message);
  }
});

const bcrypt = require("bcrypt"); // Ensure bcrypt is installed

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    // 1. Basic Validation (You could also add this to your validation utils)

    const loggedInUser = req.user;

    // 2. Hash the new password
    // Never store the plain text password from req.body!
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Update the user object and save
    loggedInUser.password = passwordHash;
    await loggedInUser.save();

    res.send("Password updated successfully!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
