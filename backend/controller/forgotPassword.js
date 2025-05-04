const sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const ForgotPasswordRequest = require("../models/forgotPasswordRequest");
const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Step 1: Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Step 2: Generate UUID and save request
    const id = uuidv4();
    await ForgotPasswordRequest.create({
      id: id,
      userId: user.id,
      isActive: true,
      expiresBy: new Date(Date.now() + 3600000), // optional: expires in 1 hour
    });

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
      subject: "Reset your password",
      htmlContent: `<p>Click the link below to reset your password:</p>
        <a href="${BASE_URL}/password/resetpassword/${id}">Reset Password</a>`,
    });
    res.status(200).json({ message: "Reset link sent to email!" });
  } catch (error) {
    console.error("Error sending reset password link:", error);
    res
      .status(500)
      .json({ message: "Failed to process forgot password request." });
  }
};

const resetPassword = async (req, res) => {
  const requestId = req.params.id;

  try {
    const resetRequest = await ForgotPasswordRequest.findOne({
      where: { id: requestId },
    });
    // console.log(resetRequest);

    if (!resetRequest || resetRequest.isActive === false) {
      return res
        .status(400)
        .send("<h2>Reset link is invalid or has expired.</h2>");
    }

    res.send(`
      <html>
      <head>
      <link rel="stylesheet" href="/css/reset.css"/>
       <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-...your-integrity"
            crossorigin="anonymous"
          />
      </head>
        <body>
       
          <form action="/password/updatepassword/${requestId}" method="POST">
          <div class="card shadow p-4" style="width: 25rem;">
          <h3 class="mb-3 text-center text-primary">Reset Password</h3>
            <div class="mb-3">
            <label class="form-label">Enter new password:</label>
            <input class="form-control" type="password" name="password" required />
            </div>
            <button class="btn btn-primary w-100" type="submit">Update Password</button>
          </form>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
};

const updatePassword = async (req, res) => {
  const newPassword = req.body.password;
  const resetId = req.params.id;

  try {
    // 1. Find the reset request
    const request = await ForgotPasswordRequest.findOne({
      where: { id: resetId },
    });

    if (!request || !request.isActive) {
      return res.status(400).json({ message: "Link is invalid or expired" });
    }

    // 2. Find the user associated with this request
    const user = await User.findByPk(request.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update user's password
    await user.update({ password: hashedPassword });

    // 5. Mark this reset request as inactive
    request.isActive = false;
    await request.save();

    res.send(
      "Password updated successfully. You can now log in with your new password."
    );
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  updatePassword,
};
