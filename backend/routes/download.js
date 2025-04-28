const express = require("express");
const router = express.Router();

const {
  downloadExpenses,
  getDownloadedFiles,
} = require("../controller/download");
const { authenticate } = require("../middleware/auth");

router.get("/download", authenticate, downloadExpenses);
router.get("/downloaded-files", authenticate, getDownloadedFiles);

module.exports = router;
