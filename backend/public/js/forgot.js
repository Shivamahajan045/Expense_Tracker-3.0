const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;

  try {
    const response = await axios.post(
      `${window.BASE_URL}/password/forgotpassword`,
      {
        email,
      }
    );
    alert("Reset link sent to your email!");
  } catch (err) {
    console.log("Error: " + err.message);
    alert("Failed to send reset link.");
  }
});
