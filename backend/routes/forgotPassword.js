const express = require("express");
const router = express.Router();
const { forgotPassword } = require("../controller/forgotPassword");

router.post("/forgotpassword", forgotPassword);

module.exports = router;
