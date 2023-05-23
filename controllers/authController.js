const { hashPassword, comparePasswords, signAccessToken } = require('../helpers');
const User = require('../models/user');

const authController = {};

authController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email,
    });

    const isValidPassword = await comparePasswords(password, user.password || null);

    if (!isValidPassword) {
      res.status(409).json({ message: 'Invalid email or password' });
      return;
    }

    console.log('userId', user._id);
    const accessToken = signAccessToken({ email: user.email, userId: user._id });
    console.log('accessToken', accessToken);
    res.status(200).json({ email, accessToken });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

authController.register = async (req, res) => {
  const { email, nickname, password } = req.body;

  try {
    const userByNickname = await User.findOne({ nickname });

    if (userByNickname) {
      res.status(409).json({ message: 'Nickname already exist' });
      return;
    }

    const userByEmail = await User.findOne({ email });

    if (userByEmail) {
      res.status(409).json({ message: 'Email already exist' });
      return;
    }

    const hashedPassword = await hashPassword(password);

    await User.create({
      email,
      nickname,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'User was successfully created' });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

module.exports = authController;
