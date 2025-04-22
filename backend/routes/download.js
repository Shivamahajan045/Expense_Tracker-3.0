const express = require("express");
const router = express.Router();

const { downloadExpenses } = require("../controller/download");
const { authenticate } = require("../middleware/auth");

router.get("/download", authenticate, downloadExpenses);

module.exports = router;
