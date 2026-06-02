const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const auth = require("../middlewares/authentification");
const csrfProtection = require("../middlewares/csrf");

// --- Existing routes ---
router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.post("/logout", auth(), csrfProtection, usersController.logout);
router.get("/profile", auth(), usersController.profile);
router.get("/verify/:token", usersController.verifyEmail);

// --- Admin CRUD for users ---
router.get("/", auth({ admin: true }), usersController.listUsers); // List all users
router.put("/:id/role", auth({ admin: true }), usersController.updateUserRole); // Update role
router.delete("/:id", auth({ admin: true }), usersController.deleteUser); // Delete user

router.get("/testmail", usersController.sendTestEmail);

module.exports = router;