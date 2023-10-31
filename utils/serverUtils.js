const express = require("express");
const cors = require("cors");

const auth = require("../routes/authRoutes")
const user = require("../routes/userRoutes")
const job = require("../routes/jobRoutes");
const jobApplication = require("../routes/jobApplicationRoutes");

const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use(
    "/api",
    auth,
    user,
    job,
    jobApplication
  );

  app.all("/api/*", (req, res) => {
    res.status(404).json({
      message: `Route ${req.originalUrl} not found!`,
    });
  });

  return app;
}

module.exports = { createServer };