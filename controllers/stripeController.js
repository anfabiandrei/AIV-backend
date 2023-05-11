nodeMailer = require('nodemailer')

const stripeController = {};

const stripe = require("stripe")(process.env.STRIPE_SK);

const calculateOrderAmount = plan => {
    switch (plan) {
        case 'Plus':
            return 299900
        case 'Premium':
            return 499900
        default:
            return 99900
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
