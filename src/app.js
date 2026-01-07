const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Namaste, from dashboard");
});

app.use("/hello", (req, res) => {
  res.send("Hello, hello hello");
});

app.use("/test", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on 3000");
});
