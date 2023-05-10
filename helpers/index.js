const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function hashPassword(password) {
  const saltRounds = 10;

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (!err) {
        resolve(hash);
      } else {
        reject(err);
      }
    });
  });
}

function comparePasswords(plainPassword, hashPassowrd) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashPassowrd, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function signAccessToken(data = {}, expiresIn = "1y") {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn });
}

module.exports = {
  hashPassword,
  comparePasswords,
  signAccessToken,
};
