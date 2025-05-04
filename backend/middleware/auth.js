const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization") || req.query.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findByPk(userData.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = {
  authenticate,
};
