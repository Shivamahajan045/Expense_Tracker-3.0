const express = require("express");
const router = express.Router();
const expenseController = require("../controller/expenseController");
const userAuthentication = require("../middleware/auth");

router.get(
  "/getAllExpense",
  userAuthentication.authenticate,
  expenseController.getAllExpense
);

router.post(
  "/addExpense",
  userAuthentication.authenticate,
  expenseController.addExpense
);

router.delete(
  "/delete/:id",
  userAuthentication.authenticate,
  expenseController.deleteExpense
);

module.exports = router;
