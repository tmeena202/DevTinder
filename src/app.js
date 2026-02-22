const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===========================
   CORS CONFIGURATION
=========================== */

const allowedOrigins = [
  "http://localhost:5173",
  "https://devconnect-web.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ===========================
   MIDDLEWARES
=========================== */

app.use(express.json());
app.use(cookieParser());

/* ===========================
   HEALTH CHECK ROUTE
=========================== */

app.get("/", (req, res) => {
  res.status(200).send("Backend is running successfully 🚀");
});

/* ===========================
   ROUTES
=========================== */

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userRouter = require("./routers/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

/* ===========================
   DATABASE CONNECTION
=========================== */

connectDB()
  .then(() => {
    console.log("Database connection established ....");
  })
  .catch((err) => {
    console.error("Database connection failed ....", err.message);
  });

/* ===========================
   LOCAL SERVER ONLY
=========================== */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}

/* ===========================
   EXPORT FOR VERCEL
=========================== */

module.exports = app;