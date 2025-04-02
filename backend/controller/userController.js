const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if any field is missing
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name: username,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created successfully!", user });
  } catch (error) {
    console.error("Signup error:", error.name);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(403).json({ message: "Email already in use!" });
    }
    res.status(500).json({ message: "User not created", error: error.message });
  }
};

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET);
}
const getUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All feilds are required!" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found! Please sign up." });
    }

    // Correct async/await bcrypt.compare usage
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    return res.status(200).json({
      success: true,
      message: "User loggedin successfully!",
      token: generateAccessToken(user.id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = {
  createUser,
  getUser,
};
