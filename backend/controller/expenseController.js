const Expense = require("../models/expenseRoutes");
const User = require("../models/user");
const sequelize = require("../utils/database");

const getAllExpense = async (req, res) => {
  try {
    let response = await Expense.findAll({ where: { userId: req.user.id } });
    if (!response) {
      return res.status(400).json({ message: "No expense found" });
    }
    return res
      .status(200)
      .json({ message: "Expense Fetched successfully", response });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong!", err: error.message });
  }
};

const addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let { amount, description, category } = req.body;
    amount = parseFloat(amount);
    let newExpense = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id,
      },
      { transaction: t }
    );

    const user = await User.findByPk(req.user.id, { transaction: t });
    const updatedTotal = user.totalExpense + amount;
    // Update user's totalExpense
    await User.update(
      { totalExpense: updatedTotal },
      { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();
    return res
      .status(200)
      .json({ message: "Expense added Successfully", newExpense });
  } catch (error) {
    await t.rollback();
    return res
      .status(500)
      .json({ message: "Something went wrong!", err: error.message });
  }
};

const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id;

    const expense = await Expense.findOne({
      where: { id: expenseId, userId: req.user.id },
      transaction: t,
    });

    if (!expense) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Expense not found or unauthorized" });
    }

    const user = await User.findByPk(req.user.id, { transaction: t });
    const updatedTotal = user.totalExpense - expense.amount;

    await User.update(
      { totalExpense: updatedTotal },
      { where: { id: req.user.id }, transaction: t }
    );

    await Expense.destroy({
      where: { id: expenseId, userId: req.user.id },
      transaction: t,
    });

    await t.commit();
    return res.status(200).json({
      message: "Expense deleted successfully",
      expenseId,
    });
  } catch (error) {
    await t.rollback();
    return res
      .status(500)
      .json({ message: "Something went wrong!", err: error.message });
  }
};

module.exports = {
  getAllExpense,
  addExpense,
  deleteExpense,
};
