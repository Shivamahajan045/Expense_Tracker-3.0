const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const DownloadedFile = sequelize.define("DownloadedFile", {
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  downloadedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = DownloadedFile;
