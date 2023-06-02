const User = require('../models/user');

const userController = {};

userController.getById = async function (req, res) {
  const { id: userId } = req.params;

  try {
    await User.findById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ message: `Server error ${err}` });
      }
      if (!user) {
        return res.status(401).json({ message: 'User is not defined' });
      }

      const { email, nickname, createdAt } = user;
      res.status(200).json({ email, nickname, createdAt });
    });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

userController.edit = async function (req, res) {
  const { userId, nickname, email } = req.body;

  if (userId !== req.userId) {
    res.status(409).json({ message: "This isn't your account" });
    return;
  }

  try {
    await User.findById(userId, async (err, currentUser) => {
      if (err) {
        return res.status(409).json({ message: `Server error: ${err}` });
      }

      if (!currentUser) {
        return res.status(409).json({ message: 'User is not defined' });
      }

      if (nickname) {
        const isNameDefined = await User.findOne({ nickname });
        if (isNameDefined) {
          res.status(409).json({ message: 'Nickname already defined' });
          return;
        } else {
          currentUser.nickname = nickname;
        }
      }

      if (email) {
        const isEmailDefined = await User.findOne({ email });
        if (isEmailDefined) {
          res.status(409).json({ message: 'Email already defined' });
          return;
        } else {
          currentUser.email = email;
        }
      }

      await currentUser.save();
      res.status(200).json({ message: 'User was successfully edited' });
    });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

module.exports = userController;
