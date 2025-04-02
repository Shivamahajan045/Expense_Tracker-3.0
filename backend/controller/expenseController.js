const Expense = require("../models/expense");

const getAllExpense = async (req, res) => {
  try {
    let response = await Expense.findAll({ where: { userId: req.user.id } });
    if (!response) {
      return res.status(400).json({ message: "No expense found" });
    }
    return res
      .status(200)
      .json({ message: "Expense Fetched successfully", response });
    // console.log(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong!", err: error.message });
  }
};

const addExpense = async (req, res) => {
  try {
    let { amount, description, category } = req.body;
    console.log(req.user);
    let newExpense = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      userId: req.user.id,
    });
    // console.log(newExpense);
    return res
      .status(200)
      .json({ message: "Expense added Successfully", newExpense });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong!", err: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    let expenseId = req.params.id;
    if (!expenseId) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    // Delete the expense if it belongs to the logged-in user
    const deletedRows = await Expense.destroy({
      where: { id: expenseId, userId: req.user.id },
    });

    if (deletedRows === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Cannot delete this expense" });
    }

    return res
      .status(200)
      .json({ message: "Expense deleted successfully", expenseId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

module.exports = {
  getAllExpense,
  addExpense,
  deleteExpense,
};
