nodeMailer = require('nodemailer')
const path = require("path");
const fs = require('fs');

const notificationController = {};

const filesPath = [
    [
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

const imageUrl = {
    checked: 'https://amazonbucketstorage.s3.us-east-2.amazonaws.com/aiv-svg-icons/checked.svg',
    folder: 'https://amazonbucketstorage.s3.us-east-2.amazonaws.com/aiv-svg-icons/folder.svg',
    logo: 'https://amazonbucketstorage.s3.us-east-2.amazonaws.com/aiv-svg-icons/logo.svg'
};

notificationController.send = async function (req, res) {
    replaceTemplates = async function () {
        let general = req.body.plan === 'General' ? '' : fs.readFileSync(path.join(__dirname, '../files/newsletter/templates/general.html'), 'utf8');
        let financials = req.body.plan === 'Financials' ? '' : fs.readFileSync(path.join(__dirname, '../files/newsletter/templates/financials.html'), 'utf8');
        let technical = req.body.plan === 'Technical Q&A' ? '' : fs.readFileSync(path.join(__dirname, '../files/newsletter/templates/technical.html'), 'utf8');
    
        const page = fs.readFileSync(path.join(__dirname, '../files/newsletter/templates/index.html'), 'utf8');
 
        const websiteUrl = `${process.env.REACT_APP_URL}/pricing`;

        general = general.replace(/#{cidChecked}/g, imageUrl.checked);
        financials = financials.replace(/#{cidChecked}/g, imageUrl.checked);
        technical = technical.replace(/#{cidChecked}/g, imageUrl.checked);
        
        return  page
            .replace('#{description}', '')
            .replace('#{table1}', general || financials)
            .replace('#{table2}', technical || financials)
            .replace(/#{websiteUrl}/g, websiteUrl)
            .replace('#{downloadUrl}', downloadLink)
            .replace('#{orderNumber}', req.body.id)
            .replace('#{packName}', `${getFile(req.body.plan)[0].name}.zip`)
            .replace(/#{cidFolder}/g, imageUrl.folder)
            .replace(/#{cidLogo}/g, imageUrl.logo)
    }
    
    let check;
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAILHOST,
        port: process.env.EMAILPORT,
        auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASSWORD
        }
    });


    const downloadLink = `${process.env.HOST}/download?id=${req.body.id}&method=${req.body.payload.paymentIntent.payment_method}&plan=${req.body.plan}`;
    const page = await replaceTemplates();

    stripe.paymentIntents.confirm(
        `${req.body.payload.paymentIntent.id}`,
        { payment_method: `${req.body.payload.paymentIntent.payment_method}` },
        function (err, paymentIntent) {
            check = err.message === 'You cannot confirm this PaymentIntent because it has already succeeded after being previously confirmed.'
            const files = check ? getFile(req.body.plan) : [];
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: `${req.body.email}`,
                subject: 'New notification',
                text: '',
                html: page,
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
