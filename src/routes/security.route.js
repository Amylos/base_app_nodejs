// src/routes/security.route.js
const express = require("express");
const router = express.Router();
const csrfProtection = require("../middlewares/csrf");

// Route to get CSRF token
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;