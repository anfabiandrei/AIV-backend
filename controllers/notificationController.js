const nodeMailer = require("nodemailer");
const { getAttachments } = require("../helpers/files");
const { replaceTemplates } = require("../helpers/attachments");

const notificationController = {};

notificationController.send = async function (req, res) {
  const order = req.body.id;
  const plan = req.body.plan;
  const payment_method = req.body.payload.paymentIntent.payment_method
  const page = await replaceTemplates(order, plan, payment_method);
  const files = getAttachments(req.body.plan);

  const transporter = nodeMailer.createTransport({
    host: process.env.EMAILHOST,
    port: process.env.EMAILPORT,
    auth: {
      user: process.env.EMAILUSER,
      pass: process.env.EMAILPASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: `${req.body.email}`,
    subject: "New notification",
    text: "",
    html: page,
    attachments: files,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return (err) => res.status(500).json({ message: "Error" });
    }
    return res.status(200).json({ message: "Success" });
  });
};

module.exports = notificationController;
