const express = require('express');
const knex = require('knex')
const cors = require('cors')
const { OAuth2Client } = require('google-auth-library')
const { port, googleClientId, dbUrl } = require('./config');


const app = express();
const googleClient = new OAuth2Client(googleClientId)
const db = knex({
    client: 'pg',
    connection: {
       connectionString : dbUrl,      
    }
  });

app.use(cors())
app.use(
    express.json() 
);

app.listen(port, () => {
});

console.log('Listening on port', port)

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.post('/auth/google/login', async (req, res) => {
    
    const { token } = req.body
    if (token) {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: googleClientId
        });
           
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }

})