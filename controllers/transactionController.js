const { getGMTDate } = require('../services/auth');
const Transaction = require('../models/transaction');

const transactionController = {};

transactionController.create = async function (req, res) {
  const { planForBuy: plans } = req.body;
  const { amount, currency, clientSecret } = req.dbData;

  try {
    await Transaction.create({
      userId: req.userId,
      plans,
      amount,
      currency,
      clientSecret,
      purchaseTime: getGMTDate(new Date()),
    });
    res.status(201).send(req.cliendData);
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

transactionController.getByDate = async function (req, res) {
  const { userId } = req;
  const { from, to } = req.query;

  if (!(from || to)) {
    return res.status(400).json({ message: 'Bad request' });
  }

  try {
    let transactions = await Transaction.find({ userId });

    from && (transactions = transactions.filter((tran) => new Date(tran.purchaseTime) >= new Date(from)));
    to && (transactions = transactions.filter((tran) => new Date(tran.purchaseTime) <= new Date(to)));

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
};

module.exports = transactionController;
