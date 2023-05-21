nodeMailer = require('nodemailer')
const path = require("path");
const fs = require('fs');

const notificationController = {};

//TODO replace legal with actual legal pack
const filesPath = {
    General: { name: 'General', path: path.resolve(__dirname, '../files/Quick_Raise_General_Templates.zip') },
    Financials: { name: 'Financials', path: path.resolve(__dirname, '../files/Quick_Raise_Financials_Template.zip') },
    'Technical Q&A': { name: 'Technical', path: path.resolve(__dirname, '../files/Quick_Raise_Technical_Q&A.zip') },
    Legal: { name: 'Legal', path: path.resolve(__dirname, '../files/Quick_Raise_Legal_Pack.zip') }
};

const stripe = require("stripe")(process.env.STRIPE_SK);

const getAttachments = (plan) => {
    return plan.reduce((p, n) => [...p, filesPath[n]], []);
}

const getFileList = (plan) => {
    return plan.reduce((p, n) => p + ', ' + filesPath[n].name + '.zip', '').slice(2);
}

const getSuggestedPacksList = (plan) => {
    const initialPacks = ['General', 'Financials', 'Technical Q&A'];
    let suggestedPacks = initialPacks.filter(pack => !plan.includes(pack));

    if (suggestedPacks.length === 2) {
        return suggestedPacks;
    } else {
        const packsSet = new Set([...suggestedPacks, ...initialPacks]);
        return [...packsSet].slice(0, 2);
    }
}

notificationController.send = async function (req, res) {
    replaceTemplates = async function () {
        const packs = getSuggestedPacksList(req.body.plan);

        let general = !packs.includes('General') ? '' : fs.readFileSync(path.join(__dirname, '../files/newsletter/templates/general.html'), 'utf8');
        let financials = !packs.includes('Financials') ? '' : fs.readFileSync(path.join(__dirname, '../files/newsletter/templates/financials.html'), 'utf8');
        let technical = !packs.includes('Technical Q&A') ? '' : fs.readFileSync(path.join(__dirname, '../files/newsletter/templates/technical.html'), 'utf8');
    
        const page = fs.readFileSync(path.join(__dirname, '../files/newsletter/templates/index.html'), 'utf8');
 
        const websiteUrl = `${process.env.REACT_APP_URL}/pricing`;

        general = general.replace(/#{cidChecked}/g, `${process.env.IMAGE_HOST}images/checked.png`);
        financials = financials.replace(/#{cidChecked}/g, `${process.env.IMAGE_HOST}images/checked.png`);
        technical = technical.replace(/#{cidChecked}/g, `${process.env.IMAGE_HOST}images/checked.png`);
        
        return  page
            .replace('#{description}', '')
            .replace('#{table1}', general || financials)
            .replace('#{table2}', technical || financials)
            .replace(/#{websiteUrl}/g, websiteUrl)
            .replace('#{downloadUrl}', downloadLink)
            .replace('#{orderNumber}', req.body.id)
            .replace('#{packName}', `${getFileList(req.body.plan)}`)
            .replace(/#{cidFolder}/g, `${process.env.IMAGE_HOST}images/folder.png`)
            .replace(/#{cidLogo}/g, `${process.env.IMAGE_HOST}images/logo.png`)
            .replace(/#{fontBaseUrl}/g, `${process.env.IMAGE_HOST}fonts`);
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


    const downloadLink = `${process.env.HOST}/download?id=${req.body.id}&method=${req.body.payload.paymentIntent.payment_method}&plan=${encodeURIComponent(req.body.plan)}`;
    const page = await replaceTemplates();

    stripe.paymentIntents.confirm(
        `${req.body.payload.paymentIntent.id}`,
        { payment_method: `${req.body.payload.paymentIntent.payment_method}` },
        function (err, paymentIntent) {
            check = err.message === 'You cannot confirm this PaymentIntent because it has already succeeded after being previously confirmed.'
            const files = check ? getAttachments(req.body.plan) : [];
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
