const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const { authenticate } = require("../middleware/auth");

router.post("/signup", userController.createUser);
router.post("/login", userController.getUser);

router.get("/status", authenticate, userController.getUserStatus);

module.exports = router;
