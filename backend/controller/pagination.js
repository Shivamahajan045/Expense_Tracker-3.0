// GET /expense/paginated?page=1&limit=2
const Expense = require("../models/expenseRoutes");
const getPaginatedExpenses = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 2;
  const offset = (page - 1) * limit;
  const userId = req.user.id;

  const { count, rows } = await Expense.findAndCountAll({
    where: { userId },
    limit,
    offset,
  });

  res.status(200).json({
    expenses: rows,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    totalExpenses: count,
  });
};

module.exports = { getPaginatedExpenses };
