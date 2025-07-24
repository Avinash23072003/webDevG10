require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // ✅ Use environment variable
    pass: process.env.MAIL_PASS, // ✅ Use environment variable
  },
  logger: true,
  debug: true, // ✅ Enables SMTP logs in console
});

const mailOptions = {
  from: process.env.MAIL_USER,
  to: 'chitareavinash6@gmail.com',
  subject: '✅ Manual Nodemailer Test',
  text: 'Hello! This is a test email sent from Node.js using Nodemailer.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('❌ Error sending email:', error);
  }
  console.log('✅ Email sent:', info.response);
});
