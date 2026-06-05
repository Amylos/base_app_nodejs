const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

const auth =
    require("../../middlewares/authentification");

router.get(
    "/profile",
    auth(),
    userController.profile
);

router.get(
    "/",
    auth({ admin: true }),
    userController.listUsers
);

router.put(
    "/:id/role",
    auth({ admin: true }),
    userController.updateUserRole
);

router.delete(
    "/:id",
    auth({ admin: true }),
    userController.deleteUser
);

module.exports = router;