nodeMailer = require('nodemailer')
const path = require("path");

const notificationController = {};

const filesPath = [
    [
        { name: 'Legal', path: path.resolve(__dirname, '../files/Quick_Raise_Legal_Template.zip') },
        { name: 'General', path: path.resolve(__dirname, '../files/Quick_Raise_General_Templates.zip') },
    ],
    [
        { name: 'Financials', path: path.resolve(__dirname, '../files/Quick_Raise_Financials_Template.zip') },
    ],
    [
        { name: 'Technical', path: path.resolve(__dirname, '../files/Quick_Raise_Technical_Q&A.zip') }
    ]
];

const stripe = require("stripe")(process.env.STRIPE_SK);

const getFile = (plan) => {
    // This is the basis for files output when using the basket   

    // let paths = [];
    // files.map((val) => {
    //     filesPath.forEach((file) => {
    //         file.name === val && paths.push({ filename: `${file.name}`, path: `${file.path}` })
    //     })
    // });
    // return paths;

    switch (plan) {
        case 'Financials':
            return filesPath[1];
        case 'Technical Q&A':
            return filesPath[2];
        default:
            return filesPath[0];
    }
}

notificationController.send = async function (req, res) {
    let check;
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAILHOST,
        port: process.env.EMAILPORT,
        auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASSWORD
        }
    });


    const message = [
        `Your region: ${req.body.region}<br/> ID Purchase: ${req.body.id} <br/> Status: ${req.body.status}`,
    ]
    stripe.paymentIntents.confirm(
        `${req.body.payload.paymentIntent.id}`,
        { payment_method: `${req.body.payload.paymentIntent.payment_method}` },
        function (err, paymentIntent) {
            check = err.message === 'You cannot confirm this PaymentIntent because it has already succeeded after being previously confirmed.'
            const files = check ? getFile(req.body.plan) : [];
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: `${req.body.email}`,
                subject: "New notification",
                text: '',
                html: message.join(),
                attachments: files,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return (err) => res.status(500).json({ message: "Error" });
                }
                return res.status(200).json({ message: "Success" });
            });
        }
    );


};


module.exports = notificationController;
