const User = require('../models/user');

const userController = {};

userController.getById = async function (req, res) {
  const { id: userId } = req.params;

  try {
    const user = await User.findById(userId);
    const { email, nickname, createdAt } = user;
    res.this.status(200).json({ email, nickname, createdAt });
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
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      res.status(409).json({ message: 'User is not defined' });
      return;
    }

    if (nickname) {
      const isNameDefined = await User.find({ nickname });
      if (isNameDefined) {
        res.status(409).json({ message: 'Nickname already defined' });
        return;
      } else {
        currentUser.nickname = nickname;
      }
    }

    if (email) {
      const isEmailDefined = await User.find({ email });
      if (isEmailDefined) {
        res.status(409).json({ message: 'Email already defined' });
        return;
      } else {
        currentUser.email = email;
      }
    }

    await currentUser.save();
    res.status(200).json({ message: 'User was successfully edited' });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

module.exports = userController;
