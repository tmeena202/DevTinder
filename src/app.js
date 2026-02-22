const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS (adjust frontend URL when deployed)
const allowedOrigins = [
  "http://localhost:5173",
  "https://devconnect-web.vercel.app", // replace with real frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// Routes
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userRouter = require("./routers/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// ✅ KEEPING YOUR DATABASE LOGIC SAME
connectDB()
  .then(() => {
    console.log("Database connection established ....");

    // ✅ Only start server if NOT running on Vercel
    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.log("Database connection failed ....");
  });

// ✅ Always export (needed for Vercel)
module.exports = app;
