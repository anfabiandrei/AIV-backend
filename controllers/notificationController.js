const nodeMailer = require('nodemailer');
const { getAttachments } = require('../helpers/files');
const { replaceTemplates } = require('../helpers/attachments');

const notificationController = {};

notificationController.send = async function (req, res) {
  const { id: order, plan } = req.body;
  const payment_method = req.body.payload.paymentIntent.payment_method;
  const page = await replaceTemplates(order, plan, payment_method);
  const files = getAttachments(plan);

  const transporter = nodeMailer.createTransport({
    host: process.env.EMAILHOST,
    port: process.env.EMAILPORT,
    service: 'gmail',
    auth: {
      user: process.env.EMAILUSER,
      pass: process.env.EMAILPASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: `${req.userEmail}`,
    subject: 'Purchase notification',
    text: '',
    html: page,
    attachments: files,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error', error });
    }
    return res.status(200).json({ message: 'Success' });
  });
};

module.exports = notificationController;
