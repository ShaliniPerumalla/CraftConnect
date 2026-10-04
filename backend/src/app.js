const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to MakerMatch API",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "MakerMatch backend is running",
  });
});

app.use("/api", routes);

module.exports = app;