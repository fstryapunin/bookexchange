var cron = require('node-cron');
const { messageModel } = require('../models')
const { sendMessageNotificationMail } = require('../emailing')

const generateAddresateList = (messages) => {
    const list = []
    messages.forEach(message => {
        let addresateIsUnique = true
        list.forEach(addressate => {
            if (addressate.id === message.addressate.id) {
                addresateIsUnique = false
                addressate.messages.push(message)
            }
        })
        if (addresateIsUnique) {
            list.push(Object.assign(message.addressate, { messages : [message] }))
        }
    });
    return list
}

const sendNotification = async (addresate) => {
    await sendMessageNotificationMail(addresate)    
    const messageIds = addresate.messages.map(message => message.id)
    await messageModel.query().where('id', 'in', messageIds).update({notification_sent: true})
}

const messageNotificationTask = cron.schedule('* */5 * * * *', async () => {
    try {

        const dateNow = new Date()       
        dateNow.setMinutes(dateNow.getMinutes() - 5)
        const dateISO = dateNow.toISOString()  
        
        const newMessages = await messageModel
            .query()
            .withGraphFetched('user')
            .withGraphFetched('addressate')
            .where('messages.added', '>', dateISO)
            .andWhere('messages.deleted', false)
            .andWhere('messages.notification_sent', false)
            .andWhere('messages.seen', false)
            .orderBy('messages.added', 'desc')
       
        

        if (newMessages.length > 0) {
            const addresateList = generateAddresateList(newMessages)                        
            addresateList.forEach(add => sendNotification(add))            
        }
       
       
    } catch(e) {
        console.log(e)
    }
    
});
  

module.exports = {
    messageNotificationTask : messageNotificationTask
}