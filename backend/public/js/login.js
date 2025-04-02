const loginForm = document.querySelector(".login-form");
const errMsg = document.createElement("p");
errMsg.classList.add("text-red-500", "mt-2");
loginForm.appendChild(errMsg);

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const response = await axios.post("http://localhost:3000/user/login", {
      email,
      password,
    });
    console.log(response);
    const token = response.data.token;
    console.log(token);
    localStorage.setItem("token", token);
    errMsg.textContent = "Login successful!";
    errMsg.classList.remove("text-red-500");
    errMsg.classList.add("text-green-500");
    window.location.href = "/expense";
  } catch (error) {
    console.log(error);
    errMsg.textContent = error.response?.data?.message || "Login failed!";
  }
});
