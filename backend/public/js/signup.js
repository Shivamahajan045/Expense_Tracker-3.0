const form = document.querySelector(".signup-form");
const errMsg = document.createElement("p");
errMsg.classList.add("text-red-500", "mt-2");
form.appendChild(errMsg);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const signUpData = {
    username: e.target.username.value,
    email: e.target.email.value,
    password: e.target.password.value,
  };

  try {
    let response = await axios.post(
      `${window.BASE_URL}/user/signup`,
      signUpData
    );
    console.log("Response Message:", response.data.message);
    errMsg.textContent = "User registered successfully!";
    errMsg.classList.remove("text-red-500");
    errMsg.classList.add("text-green-500");
  } catch (error) {
    errMsg.textContent = error.response?.data?.message || "Signup failed!";
  }
});
