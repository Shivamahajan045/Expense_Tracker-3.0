const cashfree = Cashfree({
  mode: "sandbox",
});

document
  .getElementById("buy-premium-btn")
  .addEventListener("click", async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/payment/create-order",
        {
          amount: 1,
        }
      );
      console.log(response);

      const { paymentSessionId } = response.data;

      let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
      };

      cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Error:", error);
    }
  });
