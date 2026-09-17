const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CraftConnect API",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "CraftConnect backend is running",
  });
});

module.exports = app;