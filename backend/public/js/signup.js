const form = document.querySelector(".signup-form");
// const toggleForm = document.getElementById("toggle-form");
const errMsg = document.createElement("p");
errMsg.classList.add("text-red-500", "mt-2");
form.appendChild(errMsg);

/*
let isLoginForm = false;

function renderForm() {
  if (isLoginForm) {
    form.innerHTML = `
      <h1 class="font-bold text-3xl py-4 text-center">Login</h1>
      <label for="email">Enter your email: </label>
      <input type="email" id="email" name="email" class="p-4 my-2 bg-gray-700 w-full" placeholder="Enter your email" required />
      <br /><br />
      <label for="password">Enter your password: </label>
      <input type="password" id="password" name="password" class="p-4 my-2 bg-gray-700 w-full" placeholder="Enter your password" required />
      <br /><br />
      <button id="login" class="p-4 my-4 text-white border-black bg-red-700 w-full rounded-lg cursor-pointer" type="submit">Login</button>
      <p class="py-4 cursor-pointer" id="toggle-form">New User? Sign Up</p>
    `;
  } else {
    form.innerHTML = `
      <h1 class="font-bold text-3xl py-4 text-center">Sign Up</h1>
      <label for="username">Enter your name: </label>
      <input type="text" id="username" name="username" class="p-4 my-2 bg-gray-700 w-full" placeholder="Enter your name" required />
      <br /><br />
      <label for="email">Enter your email: </label>
      <input type="email" id="email" name="email" class="p-4 my-2 bg-gray-700 w-full" placeholder="Enter your email" required />
      <br /><br />
      <label for="password">Enter your password: </label>
      <input type="password" id="password" name="password" class="p-4 my-2 bg-gray-700 w-full" placeholder="Enter your password" required />
      <br /><br />
      <button id="signup" class="p-4 my-4 text-white border-black bg-red-700 w-full rounded-lg cursor-pointer" type="submit">SignUp</button>
      <p class="py-4 cursor-pointer" id="toggle-form">Existing User? Login</p>
    `;
  }
  form.appendChild(errMsg);
}
//Initial render
renderForm();

//Toggle functionality betwewen login and signup
document.addEventListener("click", (e) => {
  if (e.target.id === "toggle-form") {
    isLoginForm = !isLoginForm;
    renderForm();
  }
});

*/

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const signUpData = {
    username: e.target.username.value,
    email: e.target.email.value,
    password: e.target.password.value,
  };

  try {
    let response = await axios.post(
      "http://localhost:3000/user/signup",
      signUpData
    );
    // console.log("Full Response Object:", response); // Debugging
    // console.log("Response Data:", response.data); // Debugging
    console.log("Response Message:", response.data.message); // This should now print
    errMsg.textContent = "User registered successfully!";
    errMsg.classList.remove("text-red-500");
    errMsg.classList.add("text-green-500");
  } catch (error) {
    errMsg.textContent = error.response?.data?.message || "Signup failed!";
  }
});
