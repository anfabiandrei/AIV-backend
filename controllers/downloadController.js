nodeMailer = require('nodemailer')
const path = require("path");

const notificationController = {};

const filesPath = [
    { path: path.resolve(__dirname, '../files/Quick_Raise_Legal_Template.zip') },
    { path: path.resolve(__dirname, '../files/Quick_Raise_General_Templates.zip') },
    { path: path.resolve(__dirname, '../files/Quick_Raise_Financials_Template.zip') },
    { path: path.resolve(__dirname, '../files/Quick_Raise_Technical_Q&A.zip') },
];

const stripe = require("stripe")(process.env.STRIPE_SK);

const getFile = (plan) => {
    switch (plan) {
        case 'Financials':
            return filesPath[2].path;
        case 'Technical Q&A':
            return filesPath[3].path;
        case 'General1':
            return filesPath[0].path;
        default:
            return filesPath[1].path;
    }
}

notificationController.send = async function (req, res) {
    stripe.paymentIntents.confirm(
        `${req.query.id}`,
        { payment_method: `${req.query.method}` },
        function (err, paymentIntent) {
            check = err.message === 'You cannot confirm this PaymentIntent because it has already succeeded after being previously confirmed.'
            const file = check ? getFile(req.query.plan) : [];
            return res.status(200).download(file);
        }
    );
};


module.exports = notificationController;
