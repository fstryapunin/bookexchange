const nodemailer = require('nodemailer')
const {gmailLogin, gmailPass} = require('./config')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: gmailLogin,
      pass: gmailPass, 
    },
});

const getMessageNotificationMail = (messagelist, user) => {

}

module.exports = {
    transporter: transporter
}