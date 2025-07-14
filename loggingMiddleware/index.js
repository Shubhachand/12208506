// index.js

require("dotenv").config();
const express = require("express");
const logger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(logger); 


app.get("/", (req, res) => {
  res.send("Welcome to AffordMed Backend Test");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
