const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const User = require("./user");

const ForgotPasswordRequest = sequelize.define("forgotPasswordRequest", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  expiresBy: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

ForgotPasswordRequest.belongsTo(User); // Each request belongs to a user
User.hasMany(ForgotPasswordRequest); // A user can have many reset requests

module.exports = ForgotPasswordRequest;
