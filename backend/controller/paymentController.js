const { Cashfree } = require("cashfree-pg");
require("dotenv").config();

Cashfree.XClientId = process.env.CASHFREE_KEY_ID;
Cashfree.XClientSecret = process.env.CASHFREE_KEY_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

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
        customer_id: "12345", // You can use a random or fixed ID
        customer_phone: "9999999999", // Provide a valid phone number
      },
      order_meta: {
        return_url: `http://localhost:3000/payment/payment-status/${orderId}`,
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
    let orderStatus;

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Success";
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
