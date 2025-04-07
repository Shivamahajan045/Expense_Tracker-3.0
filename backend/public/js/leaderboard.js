document
  .getElementById("leaderboard-btn")
  .addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/premium/leaderboard",
        {
          headers: { Authorization: token },
        }
      );
      console.log(response.data);

      const leaderboardList = document.getElementById("leaderboard-list");
      leaderboardList.innerHTML = ""; // Clear old list

      // 🔥 Make container visible
      document.getElementById("leaderboard-container").style.display = "block";

      response.data.leaderboard.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.innerText = `${index + 1}. ${entry.user.name} - ₹${
          entry.totalExpense
        }`;
        leaderboardList.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      alert("Something went wrong while loading leaderboard.");
    }
  });
