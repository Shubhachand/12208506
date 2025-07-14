const sendLog = require("../utils/sendLog");

const logger = async (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - startTime;

    const log = {
      level: "info", // You can dynamically set this based on statusCode if needed
      message: `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      stack: "backend",
      packageName: "controller" // Can be: cache, controller, cron_job, db, domain, handler
    };

    try {
      await sendLog(log);
    } catch (err) {
      console.error("🛑 Logging failed:", err.message);
    }
  });

  next();
};

module.exports = logger;
