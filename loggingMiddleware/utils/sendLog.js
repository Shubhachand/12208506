const axios = require("axios");
require("dotenv").config();

let token = null;

// Function to get a new access token
async function getToken() {
  const body = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  };

  try {
    const res = await axios.post(process.env.AUTH_API, body);
    token = res.data.access_token;
    return token;
  } catch (err) {
    console.error("🔐 Auth Error:", err.response?.data || err.message);
  }
}

// Function to send a log entry to the logging API
async function sendLog({ level, message, stack, packageName }) {
  if (!token) {
    token = await getToken();
  }

  const logData = {
    level,
    message,
    stack,
    package: packageName
  };

  try {
    const response = await axios.post(process.env.LOG_API, logData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("📤 Log Sent:", response.status);
  } catch (err) {
    console.error("❌ Log Failed:", err.response?.data || err.message);
  }
}

module.exports = sendLog;
