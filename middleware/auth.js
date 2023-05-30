const jwt = require("jsonwebtoken");
const User = require('../models/user');

function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (token === null) {
    res.status(404).json({ message: "Access denied" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      console.error("err", err);
      res.status(404).json({ message: "Access denied" });
      return;
    }

    req.userId = user.userId;
    next();
  });
}

module.exports = verifyToken;
