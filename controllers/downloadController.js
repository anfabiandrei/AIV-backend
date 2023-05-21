nodeMailer = require('nodemailer')
const path = require("path");

const notificationController = {};

const filesPath = {
    General:  path.resolve(__dirname, '../files/Quick_Raise_General_Templates.zip') ,
    Financials: path.resolve(__dirname, '../files/Quick_Raise_Financials_Template.zip') ,
    'Technical Q&A':  path.resolve(__dirname, '../files/Quick_Raise_Technical_Q&A.zip') ,
    Legal: path.resolve(__dirname, '../files/Quick_Raise_Legal_Pack.zip') 
};

const stripe = require("stripe")(process.env.STRIPE_SK);

const getFile = (plan) => {
    //todo multiple download
    return filesPath[plan[0]];
}

notificationController.send = async function (req, res) {
    const files = req.query.plan.split(',');
    stripe.paymentIntents.confirm(
        `${req.query.id}`,
        { payment_method: `${req.query.method}` },
        function (err, paymentIntent) {
            check = err.message === 'You cannot confirm this PaymentIntent because it has already succeeded after being previously confirmed.'
            const file = check ? getFile(req.query.plan) : [];
            return res.status(200).download(getFile(files));
        }
    );
};


module.exports = notificationController;
