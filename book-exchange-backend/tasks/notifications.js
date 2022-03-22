var cron = require('node-cron');

const testTask = cron.schedule('*/5 * * * * *', () => {
    console.log('running a task every 5 secs');
});
  

module.exports = {
    testTask : testTask
}