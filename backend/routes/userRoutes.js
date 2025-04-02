const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/signup", userController.createUser);

router.post("/login", userController.getUser);

module.exports = router;
