const { getGMTDate } = require('../services/auth');
const Transaction = require('../models/transaction');
const { filterByPlan } = require('../services/filtrations');

const transactionController = {};

transactionController.create = async function (req, res, next) {
  const { plan: plans, id: stripeId } = req.body;
  const { created, amount, currency, client_secret, description } = req.body.payload.paymentIntent;
  let { couponId, amountWithoutDiscount } = JSON.parse(description);
  !couponId && (couponId = null);

  try {
    await Transaction.create({
      userId: req.userId,
      plans,
      amount,
      currency,
      stripeId,
      clientSecret: client_secret,
      purchaseTime: getGMTDate(new Date(created * 1000)),
      couponId,
      amountWithoutDiscount,
    });

    next();
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

transactionController.getByUser = async function (req, res) {
  const { id } = req.params;

  try {
    const transactions = await Transaction.findOne({ userId });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

transactionController.getByFilter = async function (req, res) {
  const { userId } = req;
  const { from, to, minp: minPrice, maxp: maxPrice } = req.query;
  const plans = req.query.plans && req.query.plans.split(',');

  if (!(!from || !to || !plans || !minPrice || !maxPrice)) {
    return res.status(400).json({ message: 'Bad request' });
  }

  try {
    let transactions = await Transaction.find({ userId });

    from && (transactions = transactions.filter((tran) => new Date(tran.purchaseTime) >= new Date(from)));
    to && (transactions = transactions.filter((tran) => new Date(tran.purchaseTime) <= new Date(to)));
    plans && (transactions = filterByPlan(plans, transactions));
    minPrice && (transactions = transactions.filter((item) => item.amount >= minPrice));
    maxPrice !== undefined && (transactions = transactions.filter((item) => item.amount <= maxPrice));

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
};

module.exports = transactionController;
