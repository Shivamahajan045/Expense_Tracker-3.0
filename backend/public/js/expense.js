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
        `${window.BASE_URL}/expense/addExpense`,
        { amount, description, category },
        { headers: { Authorization: token } }
      );

      fetchAllExpense();
    } catch (error) {
      console.error("Error Adding Expense:", error.response.data);
    }
  });

  let currentPage = 1;
  const limitSelector = document.getElementById("expense-limit");

  let limit = parseInt(localStorage.getItem("expenseLimit")) || 10;
  limitSelector.value = limit;

  limitSelector.addEventListener("change", () => {
    limit = parseInt(limitSelector.value);
    localStorage.setItem("expenseLimit", limit);
    fetchAllExpense(1);
  });

  async function fetchAllExpense(page = 1) {
    const token = localStorage.getItem("token");

    try {
      let response = await axios.get(
        `${window.BASE_URL}/expense/paginated?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: token },
        }
      );

      ul.innerHTML = "";
      response.data.expenses.forEach((expense) => {
        addExpenseToUI(expense);
      });

      setupPagination(response.data.totalPages, response.data.currentPage);
      currentPage = response.data.currentPage;
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }

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
        `${window.BASE_URL}/expense/delete/${id}`,
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
      const res = await axios.get(`${window.BASE_URL}/user/status`, {
        headers: { Authorization: token },
      });

      if (res.data.isPremium) {
        document.getElementById("premium-msg").style.display = "block";
        document.getElementById("downloadexpense").style.display = "block";
        document.getElementById("leaderboard-btn").style.display = "block";
      } else {
        document.getElementById("premium-msg").style.display = "none";
        document.getElementById("downloadexpense").style.display = "none";
        document.getElementById("leaderboard-btn").style.display = "none";
      }
    } catch (err) {
      console.error("Error fetching user status", err);
    }
  }

  document
    .getElementById("downloadexpense")
    .addEventListener("click", async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${window.BASE_URL}/expense/download`, {
          headers: { Authorization: token },
        });

        if (res.data.fileURL) {
          const a = document.createElement("a");
          a.href = res.data.fileURL;
          a.download = "expenses.csv";
          a.click();
        } else {
          alert("Download failed. Please try again.");
        }
      } catch (err) {
        console.error("Error downloading expenses", err);
      }
    });

  function setupPagination(totalPages, currentPage) {
    const pagination = document.getElementById("pagination-buttons");
    pagination.innerHTML = "";

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.innerText = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.className = "btn btn-outline-primary btn-sm me-1";
    prevBtn.onclick = () => fetchAllExpense(currentPage - 1);
    pagination.appendChild(prevBtn);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.innerText = i;
      pageBtn.className = `btn btn-sm me-1 ${
        i === currentPage ? "btn-primary" : "btn-outline-secondary"
      }`;
      pageBtn.disabled = i === currentPage;
      pageBtn.onclick = () => fetchAllExpense(i);
      pagination.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className = "btn btn-outline-primary btn-sm";
    nextBtn.onclick = () => fetchAllExpense(currentPage + 1);
    pagination.appendChild(nextBtn);
  }

  document
    .getElementById("buy-premium-btn")
    .addEventListener("click", async () => {
      const token = localStorage.getItem("token");

      try {
        let res = await axios.post(
          `${window.BASE_URL}/user/buyPremium`,
          {},
          {
            headers: { Authorization: token },
          }
        );

        if (res.data.success) {
          alert("You are now a premium user!");
          checkPremiumStatus();
        }
      } catch (err) {
        console.error("Error upgrading to premium", err);
      }
    });

  fetchAllExpense();
  checkPremiumStatus(); // <-- run this again after payment return
});
