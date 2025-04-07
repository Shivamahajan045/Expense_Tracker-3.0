const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const { authenticate } = require("../middleware/auth");
router.post("/create-order", paymentController.createOrder);
router.get(
  "/payment-status/:orderId",
  authenticate,
  paymentController.getPaymentStatus
);

module.exports = router;
