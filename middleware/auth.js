const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

    if (!token) {
      const err = new Error("Authorization token missing");
      err.status = 401;
      return next(err);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err = new Error("JWT secret is not configured");
      err.status = 500;
      return next(err);
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    return next();
  } catch (err) {
    if (!err.status) {
      err.status = err.name === "JsonWebTokenError" || err.name === "TokenExpiredError" ? 401 : 500;
    }
    return next(err);
  }
};