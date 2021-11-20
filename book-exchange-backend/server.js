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

const corsConfig = {
    origin: ['http://localhost:3000', 'https://kepler-x.vercel.app'],   
    optionsSuccessStatus: 200
}

app.use(cors(corsConfig))

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
        console.log(token)
        
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: googleClientId
        });
        
        const payload = ticket.getPayload()
        console.log(payload)
        const firstName = payload.given_name
        const lastName = payload.family_name
        const email = payload.email
        const imageLink = payload.picture

        const exists = await db.select('*').from('users').where('email', email)
        if (exists.length === 0) {
            const newUserId = await db('users').insert({
                email: email,
                first_name: firstName,
                last_name: lastName,
                img_link: imageLink
            }, 'id')
            res.sendStatus(200)
        } else {
            const userId = await db('users').where('email', email).update({
                email: email,
                first_name: firstName,
                last_name: lastName,
                img_link: imageLink
            }, 'id')

            res.sendStatus(200)
        }
        
        
    } else {
        res.sendStatus(400)
    }
})