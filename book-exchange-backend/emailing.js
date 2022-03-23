const nodemailer = require('nodemailer')
const {gmailLogin, gmailPass} = require('./config')

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: gmailLogin,
      pass: gmailPass, 
    },
  });

module.exports = {
    transporter: transporter
}