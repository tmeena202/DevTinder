const express = require("express");

const app = express();

// this will match only GET API calls to /user
app.get("/user", (req, res) => {
  res.send({ firstName: "John", lastName: "Doe" });
});

app.post("/user", (req, res) => {
  res.send("Data successfully saved!");
});

app.delete("/user", (req, res) => {
  res.send("Data successfully deleted!");
});

// this will match all the HTTP methods API calls to /test
app.use("/test", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on 3000");
});
