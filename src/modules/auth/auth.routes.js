const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const auth = require("../../middlewares/authentification");
const csrfProtection = require("../../middlewares/csrf");


// --- AUTH ROUTES ---

// Register
router.post(
    "/register",
    authController.register
);

// Login
router.post(
    "/login",
    authController.login
);

// Logout
router.post(
    "/logout",
    auth(),
    csrfProtection,
    authController.logout
);

// Email verification
router.get(
    "/verify/:token",
    authController.verifyEmail
);

module.exports = router;