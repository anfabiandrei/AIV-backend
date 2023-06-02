const stripe = require('stripe')(process.env.STRIPE_SK);
const Coupon = require('../models/coupon');

const stripeController = {};

const prices = {
  Financials: 49900,
  'Technical Q&A': 39900,
  General: 39900,
  Legal: 9900,
};

const calculateOrderAmount = (plan, discount = 0) => {
  const initAmount = plan.reduce((p, n) => p + prices[n], 0);
  return +((1 - discount) * initAmount).toFixed(2);
};

stripeController.send = async function (req, res) {
  const { planForBuy, currency } = req.body;
  const amount = calculateOrderAmount(planForBuy);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency,
      metadata: { integration_check: 'accept_a_payment' },
      description: JSON.stringify({ plans: planForBuy }),
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
};

stripeController.update = async function (req, res) {
  const { planForBuy, currency, paymentIntentId, couponCode } = req.body;

  let couponId = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(400).json({ message: 'Coupon is not defined' });
    }

    discount = coupon.discount;
    couponId = coupon._id;
  }

  const amountWithDiscount = calculateOrderAmount(planForBuy, discount);
  const amountWithoutDiscount = calculateOrderAmount(planForBuy);

  const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
    amount: amountWithDiscount,
    description: JSON.stringify({ plans: planForBuy, couponId, amountWithoutDiscount }),
  });

  const { client_secret, id } = paymentIntent;
  res.status(200).json({ discount, amountWithDiscount });
};

module.exports = stripeController;
