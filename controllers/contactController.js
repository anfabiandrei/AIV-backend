nodeMailer = require('nodemailer')

const contactController = {};

contactController.send = async function (req, res) {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAILHOST,
        port: process.env.EMAILPORT,
        auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASSWORD
        }
    });

    const message = [
        `Name: ${req.body.name}`,
        `Company: ${req.body.company}`,
        `Email: ${req.body.email}`,
        `Phone number: ${req.body.phone}`,
        `Message: ${req.body.message}`,
    ]

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: "New notification",
        text: message.join(),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return (err) => res.status(500).json({ message: "Error" });
        }
         return res.status(200).json({ message: "Success" });
    });
  };

module.exports = contactController;
