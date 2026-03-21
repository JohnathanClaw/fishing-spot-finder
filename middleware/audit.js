const db = require("../lib/db");

module.exports = async function (req, res, next) {
  try {
    const user = req.user || {};
    const userId = user.id || user.user_id || null;
    const method = req.method || "UNKNOWN";
    const path = req.originalUrl || req.url || "/";
    const action = `${method} ${path}`.slice(0, 255);

    const forwardedFor = req.headers["x-forwarded-for"];
    const ipAddress = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : (forwardedFor || req.ip || req.connection?.remoteAddress || null);
    const userAgent = req.get && req.get("user-agent") ? req.get("user-agent").slice(0, 255) : null;

    await db.query(
      `
        INSERT INTO audit_logs (user_id, action, ip_address, user_agent)
        VALUES ($1, $2, $3, $4)
      `,
      [userId, action, ipAddress, userAgent]
    );

    next();
  } catch (error) {
    next(error);
  }
};