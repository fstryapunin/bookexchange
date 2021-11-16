const dotenv = require('dotenv');
dotenv.config();
module.exports = { 
    port: process.env.PORT,
    googleClientId: process.env.GOOGLE_CLIENT_ID
};