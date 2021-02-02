const express = require("express");
const router = express.Router();

// get request to root route
// used to see that server is up and running on localhost:5000
router.get("/", (req, res) => {
  res.send("server is up and running");
});

module.exports = router;
