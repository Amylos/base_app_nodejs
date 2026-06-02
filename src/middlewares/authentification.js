const jwt = require("jsonwebtoken");

/**
 * Middleware to check JWT and optionally require admin.
 * Usage:
 *  - auth() → normal authentication
 *  - auth({ admin: true }) → only admins allowed
 */
const auth = (options = {}) => {
  return (req, res, next) => {
    const token = req.cookies.token; // or headers

    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, email, role }

      if (options.admin && req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = auth;