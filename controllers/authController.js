const { hashPassword, comparePasswords, signAccessToken } = require('../helpers');
const User = require('../models/user');
const {
  sentEmailVerification,
  isVerificationCodeValid,
  generateCode,
  isValidEmail,
  isValidPassword,
} = require('../services/auth');

const authController = {};

authController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const isValidPassword = await comparePasswords(password, user.password || null);

    if (!isValidPassword) {
      return res.status(409).json({ message: 'Invalid email or password' });
    }

    const accessToken = signAccessToken({ email: user.email, userId: user._id });
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

authController.register = async (req, res, next) => {
  const { email, nickname, password, firstName, lastName } = req.body;

  if (
    !isValidEmail(email) ||
    !isValidPassword(password) ||
    !firstName.trim().length > 3 ||
    !lastName.trim().length > 3
  ) {
    return res.status(409).json({ message: 'Invalid data' });
  }

  try {
    if (nickname) {
      const userByNickname = await User.findOne({ nickname });

      if (userByNickname) {
        return res.status(409).json({ message: 'Nickname already exist' });
      }
    }

    const userByEmail = await User.findOne({ email });

    if (userByEmail) {
      return res.status(409).json({ message: 'Email already exist' });
    }

    const code = generateCode();

    sentEmailVerification(email, code, async (error, info) => {
      if (error) {
        res.status(500).json({ message: 'Sent email is failed' });
        return console.error(error);
      }

      const timeDeadLine = new Date().setHours(new Date().getHours() + 5);

      await User.create({
        email,
        nickname: nickname || null,
        firstName,
        lastName,
        password: await hashPassword(password),
        createdAt: new Date(),
        emailSubmits: [
          {
            code,
            evt: new Date(timeDeadLine),
          },
        ],
      });

      next();
    });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

authController.repeatEmailRequest = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(409).json({ message: 'User is not defined' });
    }

    const code = generateCode();

    sentEmailVerification(email, code, async (error, info) => {
      if (error) {
        res.status(500).json({ message: 'Sent email is failed' });
        return console.error(error);
      }

      const timeDeadLine = new Date().setHours(new Date().getHours() + 5);

      user.emailSubmits.push({ code, evt: new Date(timeDeadLine) });
      await user.save();
      res.status(201).json({ message: `Code successfully created` });
    });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

authController.submitEmail = async (req, res) => {
  const { email, code } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(409).json({ message: 'User is not defined' });
    }

    if (user.approved) {
      return res.status(409).json({ message: 'User already approved' });
    }

    if (isVerificationCodeValid(user, code)) {
      user.emailSubmits = [];
      user.approved = true;
      user.save();
      res.status(201).json({ message: 'Access allowed' });
    } else {
      res.status(409).json({ message: 'Access denied' });
    }
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
};

module.exports = authController;
