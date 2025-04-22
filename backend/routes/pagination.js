const express = require("express");
const router = express.Router();
const { getPaginatedExpenses } = require("../controller/pagination");
const { authenticate } = require("../middleware/auth");

router.get("/expense/paginated", authenticate, getPaginatedExpenses);

module.exports = router;
