const path = require("path");
const zip = require('express-zip');

const notificationController = {};

const filesPath = {
    General: { path: path.resolve(__dirname, '../files/Quick_Raise_General_Templates.zip'), name: 'Quick_Raise_General_Templates.zip' },
    Financials: { path: path.resolve(__dirname, '../files/Quick_Raise_Financials_Template.zip'), name: 'Quick_Raise_Financials_Template.zip' },
    'Technical Q&A': { path: path.resolve(__dirname, '../files/Quick_Raise_Technical_Q&A.zip'), name: 'Quick_Raise_Technical_Q&A.zip' },
    Legal: { path: path.resolve(__dirname, '../files/Quick_Raise_Legal_Pack.zip'), name: 'Quick_Raise_Legal_Pack.zip' }
};

const stripe = require("stripe")(process.env.STRIPE_SK);

const getFile = (files) => {
    return files.reduce((p, n) => [...p, filesPath[n]],[]).filter(file => file);
}

notificationController.send = async function (req, res) {
    const files = req.query.plan.split(',');
    stripe.paymentIntents.confirm(
        `${req.query.id}`,
        { payment_method: `${req.query.method}` },
        function (err, paymentIntent) {
            check = err.message === 'You cannot confirm this PaymentIntent because it has already succeeded after being previously confirmed.'
            const file = check ? getFile(files) : [];
            if (!file.length) {
                return res.status(404).json({ message: 'Not Found' });
            }
            return file.length > 1
                ? res.status(200).zip(file, 'Quick_Raise_Templates.zip')
                : res.status(200).download(file[0].path);
        }
    );
};


module.exports = notificationController;
