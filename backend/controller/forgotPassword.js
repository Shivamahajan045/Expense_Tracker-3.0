const sib = require("sib-api-v3-sdk");
require("dotenv").config();

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const client = sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY;
    const tranEmailApi = new sib.TransactionalEmailsApi();
    const sender = {
      email: "shivamahajan055@gmail.com",
    };
    const recievers = [
      {
        email: email,
      },
    ];
    tranEmailApi.sendTransacEmail({
      sender,
      to: recievers,
      subject: "subscribe to expense tracker",
      textContent: `Expense tracker will track your expense`,
    });
    res.status(200).json({ message: "Reset email sent successfully!", email });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send reset email." });
  }
};

module.exports = {
  forgotPassword,
};
