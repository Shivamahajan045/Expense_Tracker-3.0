const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.port || 3000;
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const sequelize = require("./utils/database");

const User = require("./models/user");
const Expense = require("./models/expense");

const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const leaderboardRouter = require("./routes/leaderBoard");
const forgotPasswordRouter = require("./routes/forgotPassword");
const downloadRouter = require("./routes/download");
const paginationRouter = require("./routes/pagination");

const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

app.use(cors());
app.use(express.static(path.join(__dirname, "views")));
app.use("/payment", paymentRouter);
app.use("/premium", leaderboardRouter);
app.use("/expense", downloadRouter);
app.use("/", paginationRouter);
//Root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

//login route
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

//expense route
app.get("/expense", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "expense.html"));
});

app.get("/error", (req, res, next) => {
  const error = new Error("This is a test error!");
  next(error);
});

//  relationships
User.hasMany(Expense, { foreignKey: "userId", onDelete: "CASCADE" });
Expense.belongsTo(User, { foreignKey: "userId" });

//// API Routes
app.use("/user", userRouter);
app.use("/expense", expenseRouter);
app.use("/password", forgotPasswordRouter);

app.use((err, req, res, next) => {
  const errorLogPath = path.join(logDirectory, "error.log");
  const logEntry = `
[${new Date().toISOString()}] 
URL: ${req.originalUrl}
Method: ${req.method}
Status: ${res.statusCode}
Error Message: ${err.message}
Stack Trace: ${err.stack}

`;

  fs.appendFile(errorLogPath, logEntry, (fsErr) => {
    if (fsErr) {
      console.error("Failed to write to error.log", fsErr);
    }
  });

  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});
// Database Connection
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected...");
    app.listen(port, () => {
      console.log(`Server is listening to port: ${port}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
