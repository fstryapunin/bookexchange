const express = require('express');
const knex = require('knex')
const cors = require('cors')
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const { OAuth2Client } = require('google-auth-library')
const { port, googleClientId, dbUrl, tokenKey } = require('./config');


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
    methods: "GET,PUT,POST,DELETE, OPTIONS",
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cors(corsConfig))
app.use(cookieParser())
app.use(
    express.json() 
);

app.listen(port, () => {
});

console.log('Listening on port', port)

app.get('/', (req, res) => {    
    res.sendStatus(200)
})

const upsertUser = async (payload) => {
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
            return newUserId
        } else {
            const userId = await db('users').where('email', email).update({
                email: email,
                first_name: firstName,
                last_name: lastName,
                img_link: imageLink
            }, 'id')

            return userId
        }
}

app.post('/auth/google/login', async (req, res) => {
    
    const { token } = req.body   
    if (token) {      
        
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: googleClientId
        });
        
        const payload = ticket.getPayload()
        
        const userId = upsertUser(payload)      

        const jRefreshToken = jwt.sign(
            {
                email: payload.email,
                id : userId
            },
            tokenKey,
            {
              expiresIn: "1m",
            }
        );       

        res.cookie('token', jRefreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 14 })
        res.sendStatus(200)
        
    } else {
        res.sendStatus(400)
    }
})

app.get('/test', (req, res) => {
    console.log(req.cookies)
    res.sendStatus(200)
})