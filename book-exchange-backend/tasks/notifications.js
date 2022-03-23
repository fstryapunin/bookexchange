var cron = require('node-cron');
const { messageModel } = require('../models')

const generateAddresateList = (messages) => {
    const list = []
    messages.forEach(message => {
        list.forEach(user => {
            if(user.id){}
        })
    });
}

const messageNotificationTask = cron.schedule('*/5 * * * * *', async () => {
    /*try {

        const dateNow = new Date()       
        dateNow.setMinutes(dateNow.getMinutes() - 5)
        const dateISO = dateNow.toISOString()  
        
        const newMessages = await messageModel
            .query()
            .withGraphFetched('user')
            .where('messages.added', '>', dateISO)
            .andWhere('messages.deleted', false)
            .andWhere('messages.notification_sent', false)
            .andWhere('messages.seen', false)
            .orderBy('messages.added', 'desc')
       
        
       
    } catch(e) {
        console.log(e)
    }*/
    
});
  

module.exports = {
    messageNotificationTask : messageNotificationTask
}