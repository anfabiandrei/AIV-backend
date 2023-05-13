nodeMailer = require('nodemailer')

const notificationController = {};

notificationController.send = async function (req, res) {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAILHOST,
        port: process.env.EMAILPORT,
        auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASSWORD
        }
    });
    
    const message = [
        `Name: ${req.body.name}<br/> Your region: ${req.body.region}<br/> ID Purchase: ${req.body.id} <br/> Status: ${req.body.status}`,
    ]

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: `${req.body.email}`,
        subject: "New notification",
        text: '',
        html: message.join(),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return (err) => res.status(500).json({ message: "Error" });
        }
            return res.status(200).json({ message: "Success" });
    });
  };

module.exports = notificationController;
