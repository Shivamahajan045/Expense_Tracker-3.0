const Expense = require("../models/expense");
const User = require("../models/user");
const { Sequelize } = require("sequelize");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ["name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });
    res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch leaderboard" });
  }
};

// exports.getLeaderboard = async (req, res) => {
//   try {
//     const leaderboard = await Expense.findAll({
//       attributes: [
//         "userId",
//         [Sequelize.fn("SUM", Sequelize.col("amount")), "totalExpense"],
//       ],
//       include: [
//         {
//           model: User,
//           attributes: ["name"], // show user name
//         },
//       ],
//       group: ["userId"],
//       order: [[Sequelize.literal("totalExpense"), "DESC"]],
//     });

//     res.status(200).json({ success: true, leaderboard });
//   } catch (err) {
//     console.error("Error fetching leaderboard:", err);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch leaderboard" });
//   }
// };
