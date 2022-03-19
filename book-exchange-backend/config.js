const dotenv = require('dotenv');
dotenv.config();
module.exports = { 
    port: process.env.PORT,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    dbUrl: process.env.DATABASE_URL,
    tokenKey: process.env.TOKEN_KEY,
    appRoot: __dirname
};