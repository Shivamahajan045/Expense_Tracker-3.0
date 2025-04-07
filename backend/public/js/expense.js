document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const ul = document.getElementById("expenses");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let amount = e.target.amount.value;
    let description = e.target.description.value;
    let category = e.target.category.value;

    const token = localStorage.getItem("token"); //  Get token from localStorage

    try {
      let response = await axios.post(
        "http://localhost:3000/expense/addExpense",
        { amount, description, category },
        { headers: { Authorization: token } } //  Send token in headers
      );
      // console.log("Expense Added:", response.data);

      fetchAllExpense(); // Refresh expenses after adding new one
    } catch (error) {
      console.error("Error Adding Expense:", error.response.data);
    }
  });

  async function fetchAllExpense() {
    const token = localStorage.getItem("token");
    let response = await axios.get(
      "http://localhost:3000/expense/getAllExpense",
      { headers: { Authorization: token } }
    );
    ul.innerHTML = "";
    response.data.response.forEach((expense) => {
      addExpenseToUI(expense);
    });
  }

  document.addEventListener("DOMContentLoaded", fetchAllExpense);
  function addExpenseToUI(expense) {
    let li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `${expense.amount} ---- > ${expense.description} ----> ${expense.category}  `;

    // create a div for editBtn and delBtn to wrap
    let div = document.createElement("div");
    div.className = "d-grid gap-2 d-md-flex justify-content-md-end";
    // Delete btn
    let delBtn = document.createElement("button");
    delBtn.className = "btn btn-danger btn-sm me-2";
    delBtn.textContent = "Delete";

    delBtn.onclick = () => deleteExpense(expense.id);

    // Edit btn
    let editBtn = document.createElement("button");
    editBtn.className = "btn btn-warning btn-sm me-md-2";
    editBtn.textContent = "Edit";
    div.appendChild(editBtn);
    div.appendChild(delBtn);
    li.appendChild(div);
    ul.appendChild(li);
  }

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");
      let response = await axios.delete(
        `http://localhost:3000/expense/delete/${id}`,
        { headers: { Authorization: token } }
      );
      fetchAllExpense();
    } catch (error) {
      console.log("Something went wrong!", error);
    }
  };

  async function checkPremiumStatus() {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:3000/user/status", {
        headers: { Authorization: token },
      });

      if (res.data.isPremium) {
        const banner = document.getElementById("premium-banner");
        if (banner) banner.style.display = "block";

        const premiumMsg = document.getElementById("premium-msg");
        if (premiumMsg) premiumMsg.style.display = "block";

        const leaderboardBtn = document.getElementById("leaderboard-btn");
        if (leaderboardBtn) leaderboardBtn.style.display = "block";
      }
    } catch (err) {
      console.error("Error fetching user status", err);
    }
  }

  fetchAllExpense();
  checkPremiumStatus(); // <-- run this again after payment return
});
