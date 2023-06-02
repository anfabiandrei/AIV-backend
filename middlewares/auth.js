const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];

  if (token === null) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Access denied' });
    }

    req.userId = user.userId;
    next();
  });
}

module.exports = verifyToken;
