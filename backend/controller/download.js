const Expense = require("../models/expenseRoutes");
const DownloadedFile = require("../models/downloadedfile");
const UserServices = require("../services/userservices");
const S3Service = require("../services/S3services");
require("dotenv").config();

const downloadExpenses = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id;
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Service.uploadToS3(stringifiedExpenses, fileName);

    // Save download history
    await DownloadedFile.create({
      fileUrl: fileURL,
      userId: userId,
    });

    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    res.status(500).json({
      fileURL: "",
      success: false,
      message: "Failed to download expenses.",
      err: err,
    });
  }
};

const getDownloadedFiles = async (req, res) => {
  try {
    const files = await req.user.getDownloadedFiles({
      order: [["downloadedAt", "DESC"]],
    });

    res.status(200).json({ success: true, files });
  } catch (err) {
    console.error("Error fetching downloaded files:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch history." });
  }
};

module.exports = {
  downloadExpenses,
  getDownloadedFiles,
};
