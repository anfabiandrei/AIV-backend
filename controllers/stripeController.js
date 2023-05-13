nodeMailer = require('nodemailer')

const stripeController = {};

const stripe = require("stripe")(process.env.STRIPE_SK);

const calculateOrderAmount = plan => {
    switch (plan) {
        case 'Financials':
            return 79900
        case 'Technical Q&A':
            return 99900
        default:
            return 49900
    }
};

stripeController.send = async function (req, res) {
    const { planForBuy, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(planForBuy),
      currency: currency
    });
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  };

module.exports = stripeController;
