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

userController.getPrivateData = function (req, res) {
  try {
    User.findById(req.userId, (err, user) => {
      if (err) {
        return res.status(400).json({ message: 'User is not defined' });
      }

      const { region, phone, address, city, postaleCode } = user;
      res.status(200).json({ region, phone, address, city, postaleCode });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

userController.edit = function (req, res) {
  const { nickname, email, region, phone, address, city, postaleCode } = req.body;

  // if (userId !== req.userId) {
  //   return res.status(409).json({ message: "This isn't your account" });
  // }

  try {
    User.findById(req.userId, async (err, currentUser) => {
      if (err) {
        return res.status(409).json({ message: `Server error: ${err}` });
      }

      if (!currentUser) {
        return res.status(409).json({ message: 'User is not defined' });
      }

      // check on existence nickname
      if (nickname) {
        const isNameDefined = await User.findOne({ nickname });
        if (isNameDefined) {
          return res.status(409).json({ message: 'Nickname already defined' });
        } else {
          currentUser.nickname = nickname;
        }
      }

      // check on existence email
      if (email) {
        const isEmailDefined = await User.findOne({ email });
        if (isEmailDefined) {
          return res.status(409).json({ message: 'Email already defined' });
        } else {
          currentUser.email = email;
        }
      }

      region && (currentUser.region = region);
      phone && (currentUser.phone = phone);
      address && (currentUser.address = address);
      city && (currentUser.city = city);
      postaleCode && (currentUser.postaleCode = postaleCode);

      await currentUser.save();
      res.status(200).json({ message: 'User was successfully edited' });
    });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

module.exports = userController;
