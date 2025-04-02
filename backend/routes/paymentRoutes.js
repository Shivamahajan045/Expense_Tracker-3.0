const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");

router.post("/create-order", paymentController.createOrder);
router.get("/payment-status/:orderId", paymentController.getPaymentStatus);

module.exports = router;
