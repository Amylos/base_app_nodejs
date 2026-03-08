const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const auth = require("../middlewares/authentification");
const csrfProtection = require("../middlewares/csrf");

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.post("/logout", auth, csrfProtection, usersController.logout);
router.get("/profile", auth, usersController.profile);

module.exports = router;