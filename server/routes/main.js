const express = require("express");
const router = express.Router();

// Routes

router.get("/", (req, res) => {
  res.send("My Blog");
});

module.exports = router;
