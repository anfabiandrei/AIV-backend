const { getGMTDate } = require('../services/auth');
const Transaction = require('../models/transaction');

const transactionController = {};

transactionController.create = async function (req, res, next) {
  const { plan: plans, id: stripeId } = req.body;
  const { created, amount, currency, client_secret } = req.body.payload.paymentIntent;

  try {
    await Transaction.create({
      userId: req.userId,
      plans,
      amount,
      currency,
      stripeId,
      clientSecret: client_secret,
      purchaseTime: getGMTDate(new Date(created * 1000)),
    });

    next();
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

transactionController.getByUser = async function (req, res) {
  const { userId } = req.body;

  try {
    const transactions = await Transaction.findOne({ userId });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

transactionController.getByFilter = async function (req, res) {
  const { userId } = req;
  const { from, to } = req.query;

  if (!(from || to)) {
    return res.status(400).json({ message: 'Bad request' });
  }

  try {
    let transactions = await Transaction.find({ userId });
    console.log('transaction', transactions);

    from &&
      (transactions = transactions.filter((tran) => {
        console.log(tran.purchaseTime, new Date(from));
        return new Date(tran.purchaseTime) >= new Date(from);
      }));
    console.log(transactions.length);
    to && (transactions = transactions.filter((tran) => new Date(tran.purchaseTime) <= new Date(to)));
    console.log(transactions.length);

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
};

module.exports = transactionController;
