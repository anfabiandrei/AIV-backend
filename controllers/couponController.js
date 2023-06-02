const Coupon = require('../models/coupon');
const { generateCode } = require('../services/auth');

const couponController = {};

couponController.get = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json(`Server error: ${err}`);
  }
};

couponController.create = async (req, res) => {
  const { discount } = req.body;
  let { isActive } = req.body;

  isActive === undefined && (isActive = true);
  const code = generateCode().slice(0, 10);

  try {
    await Coupon.create({ code, discount, isActive });
    res.status(201).json({ message: 'Successfully created' });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
};

couponController.edit = (req, res) => {
  const { couponId, isActive, discount } = req.body;

  if (isActive === undefined && discount === undefined) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    Coupon.findById(couponId, async (err, coupon) => {
      if (err) {
        return res.status(400).json({ message: 'Coupon is not defined' });
      }

      isActive !== undefined && (coupon.isActive = isActive);
      discount !== undefined && (coupon.discount = discount);
      await coupon.save();
      res.status(200).json({ message: 'Successfully edited' });
    });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
};

couponController.delete = async (req, res) => {
  const { couponId } = req.body;

  try {
    await Coupon.findByIdAndDelete(couponId);
    res.status(200).json({ message: 'Successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
};

module.exports = couponController;
