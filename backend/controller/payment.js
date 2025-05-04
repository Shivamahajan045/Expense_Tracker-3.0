const { Cashfree } = require("cashfree-pg");
require("dotenv").config();
const User = require("../models/user");
Cashfree.XClientId = process.env.CASHFREE_KEY_ID;
Cashfree.XClientSecret = process.env.CASHFREE_KEY_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
const BASE_URL = process.env.BASE_URL;

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
    const formattedExpiryDate = expiryDate.toISOString();

    const orderId = `order_${Date.now()}`;
    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: "123456789",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: `${BASE_URL}/payment/payment-status/${orderId}?token=${req.headers.authorization}`,
        payment_methods: "cc,upi,nb",
      },
      order_expiry_time: formattedExpiryDate,
    };
    const response = await Cashfree.PGCreateOrder("2025-01-01", request);
    const paymentSessionId = response.data.payment_session_id;
    res.status(200).json({ success: true, paymentSessionId, orderId });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const response = await Cashfree.PGOrderFetchPayments("2025-01-01", orderId);
    const getOrderResponse = response.data;
    let orderStatus; // Save premium status when payment is successful

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Success";
      await User.update({ isPremium: true }, { where: { id: req.user.id } });
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }

    return res.status(200).json({ success: true, orderStatus });
  } catch (error) {
    console.error("Error fetching order status: ", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch order status" });
  }
};
