const jwt = require("jsonwebtoken");
const authMidddleware = (req, res, next) => {
  const browserToken = req.cookie.token;
  if (!browserToken) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Expired JWT token ",
      success: true,
    });
  }
};
module.exports = authMidddleware;
