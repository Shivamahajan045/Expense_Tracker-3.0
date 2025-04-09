const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.email.value;

  axios.post("http://localhost:3000/password/forgotpassword", { email });
});
