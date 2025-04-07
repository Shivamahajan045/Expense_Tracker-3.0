const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../controller/leaderBoard");
const { authenticate } = require("../middleware/auth");
// GET /premium/leaderboard
router.get("/leaderboard", authenticate, getLeaderboard);

module.exports = router;
