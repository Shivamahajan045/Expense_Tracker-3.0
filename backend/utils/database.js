const Sequelize = require("sequelize");
const sequelize = new Sequelize("expense", "root", "Shivu@123", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});

module.exports = sequelize;
