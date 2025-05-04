const token = localStorage.getItem("token"); // or however you're storing it
const cashfree = Cashfree({
  mode: "sandbox",
});

document
  .getElementById("buy-premium-btn")
  .addEventListener("click", async () => {
    try {
      const response = await axios.post(
        `${window.BASE_URL}/payment/create-order`,

        {
          amount: 10000,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const { paymentSessionId, orderId } = response.data;
      let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
      };
      cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Error:", error);
    }
  });
