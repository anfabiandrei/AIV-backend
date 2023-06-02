const nodeMailer = require('nodemailer');

const { HOST } = process.env;

const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isValidPassword = (password) => {
  const reg = [];
  reg.push('[A-Z]');
  reg.push('[a-z]');
  reg.push('[0-9]');
  reg.push('[!@#$%^&*_-]');

  return (
    reg.reduce((prev, curr, i) => {
      return new RegExp(reg[i]).test(password) ? prev + 1 : prev;
    }, 0) === 4
  );
};

const sentEmailVerification = (email, code, cb) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAILHOST,
    port: process.env.EMAILPORT,
    auth: {
      user: process.env.EMAILUSER,
      pass: process.env.EMAILPASSWORD,
    },
    service: 'gmail',
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Auth notification',
    text: `Please, submit your auth code`,
    html: `<p>Enter in input field this code: <a href='${HOST}/auth/email_submit?email=${email}&code=${code}'>${HOST}/auth/email_submit?email=${email}&code=${code}</a></p>`,
  };

  transporter.sendMail(mailOptions, cb);
};

const getGMTDate = (date) => new Date(date.toGMTString());

const isVerificationCodeValid = (user, code) =>
  user.emailSubmits.some((item) => item.code === code && item.evt >= new Date());

const generateCode = () => `${Math.random().toString(36).substr(3, 10)}${Math.random().toString(36).substr(2, 10)}`;

module.exports = {
  sentEmailVerification,
  generateCode,
  isVerificationCodeValid,
  isValidEmail,
  isValidPassword,
  getGMTDate,
};
