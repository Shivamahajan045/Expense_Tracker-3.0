const form = document.querySelector("form");
const ul = document.querySelector("ul");

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
    console.log("Expense Added:", response.data);

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
  console.log("Fetched Expenses:", response.data);
  // console.log(response.data.response); //Array
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

  // Delete btn
  let delBtn = document.createElement("button");
  delBtn.className = "btn btn-danger btn-sm me-2";
  delBtn.textContent = "Delete";

  delBtn.onclick = () => deleteExpense(expense.id);

  // Edit btn
  let editBtn = document.createElement("button");
  editBtn.className = "btn btn-warning btn-sm me-2";
  editBtn.textContent = "Edit";

  li.appendChild(editBtn);
  li.appendChild(delBtn);
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
    console.log("Expense deleted successfully");
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};
