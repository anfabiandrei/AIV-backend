const stripeController = {};

const stripe = require("stripe")(process.env.STRIPE_SK);

const prices = {
    Financials: 49900,
    "Technical Q&A": 39900,
    General: 39900,
    Legal: 9900
};

const calculateOrderAmount = plan => {
    return plan.reduce((p, n) => p + prices[n], 0);
};

stripeController.send = async function (req, res) {
    const { planForBuy, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(planForBuy),
      currency: currency,
      metadata: {integration_check: 'accept_a_payment'},
      description: JSON.stringify(planForBuy),
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
};

stripeController.update = async function (req, res) {
    const { planForBuy, currency, paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: calculateOrderAmount(planForBuy)
    });
    const { client_secret, id } = paymentIntent;
    res.status(200).json({ message: 'Success' });
};

module.exports = stripeController;
