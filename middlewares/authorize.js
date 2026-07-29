import jwt from "jsonwebtoken";

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          error: "Access denied. No token provided.",
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret_key"
      );

      req.user = decoded;

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: "Access denied. Insufficient permissions.",
        });
      }

      next();
    } catch (err) {
      console.error("Token verification error:", err);

      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expired",
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "Invalid token",
        });
      }

      return res.status(401).json({
        error: "Authentication failed",
      });
    }
  };
};

export default authorize;