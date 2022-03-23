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

const sendMessageNotificationMail = async (addresate) => {
    try { 
    const getMessageLine = (message) => {
        return `Od ${message.user.first_name} ${message.user.last_name}: \n${message.text}`
       
    }

    const stringArr = addresate.messages.map(message => {
        return getMessageLine(message)
    })

    const joinedMessage = stringArr.join('\n\n')

    var message = {
        from: gmailLogin,
        to: addresate.email,
        subject: "Máš nové zprávy na Kepler Burze!",
        text: joinedMessage,
    };

        const info = await transporter.sendMail(message)
        
        return {success: true}
        
    }
    catch(e) {
        console.log(e)
        return {success: false}
    }
}

module.exports = {
    transporter: transporter,
    sendMessageNotificationMail: sendMessageNotificationMail
}