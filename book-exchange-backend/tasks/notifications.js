var cron = require('node-cron');
const { messageModel } = require('../models')

const notificationTask = cron.schedule('*/5 * * * * *', async () => {
    try {

        const dateNow = new Date()       
        dateNow.setMinutes(dateNow.getMinutes() - 5)
        const dateISO = dateNow.toISOString()  
        
        const newMessages = await messageModel
            .query()
            .where('added', '>', dateISO)
            .andWhere('deleted', false)
            .andWhere('notification_sent', false)
            .andWhere('seen', false)
            .orderBy('added', 'desc')
       
        
       
    } catch(e) {
        console.log(e)
    }
    
});
  

module.exports = {
    notificationTask : notificationTask
}