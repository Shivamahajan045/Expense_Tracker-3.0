const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controller/forgotPassword");

router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword/:id", resetPassword);
router.post("/updatepassword/:id", updatePassword);

module.exports = router;
