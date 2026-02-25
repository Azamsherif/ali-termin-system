const jwt = require("jsonwebtoken");

// JWT authentication middleware
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  // Validate Bearer token format
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify JWT and attach user data to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains: { id, email }
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = auth;
