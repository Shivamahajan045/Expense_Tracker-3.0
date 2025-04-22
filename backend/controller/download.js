const Expense = require("../models/expense");
const fs = require("fs");
const path = require("path");

exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });

    let csv = "Amount,Description,Category,Date\n";

    expenses.forEach((exp) => {
      csv += `${exp.amount},${exp.description},${exp.category},${exp.createdAt}\n`;
    });

    const filename = `expenses_${req.user.id}_${Date.now()}.csv`;
    const filepath = path.join(__dirname, "..", "downloads", filename);

    // ✅ Create downloads folder if not exist
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    fs.writeFileSync(filepath, csv);

    // ✅ Send public URL (e.g., localhost:3000/downloads/...)
    const fileUrl = `http://localhost:3000/downloads/${filename}`;
    return res.status(200).json({ fileUrl });
  } catch (err) {
    console.error("Error generating download:", err);
    res.status(500).json({ message: "Failed to download expenses." });
  }
};
