const Transaction = require('../models/transaction');

const transactionController = {};

transactionController.create = async function (req, res) {
  const { planForBuy: plans } = req.body;
  const { amount: totalPrice, currency: usd, clientSecret } = req.purchase;

  try {
    await Transaction.create({
      userId: req.userId,
      plans,
      totalPrice,
      usd,
      clientSecret,
    });
    res.status(200).send({
      clientSecret,
    });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

transactionController.getByUser = async function (req, res) {
  const { userId } = req.body;

  try {
    const transactions = await Transaction.find({ userId });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

module.exports = transactionController;
