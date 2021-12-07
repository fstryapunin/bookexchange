const express = require('express');
const knex = require('knex')
const cors = require('cors')
const jwt = require("jsonwebtoken");
const mockData = require('./files/MOCK_DATA.json')
const { cookieAuth, tokenAuth } = require('./middleware/auth')
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
app.use('/images', express.static('images'))

app.listen(port, () => {
});

console.log('Listening on port', port)

app.get('/', (req, res) => {    
    res.sendStatus(200)
})

app.get('/categories', async (req, res) => {
    const categories = await db.select('*').from('categories')
    const sorted = categories.sort((a, b) => (a.order > b.order) ? 1 : -1)
    res.json(sorted)
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
            return parseInt(newUserId[0])
        } else {
            const userId = await db('users').where('email', email).update({
                email: email,
                first_name: firstName,
                last_name: lastName,
                img_link: imageLink
            }, 'id')            
            return parseInt(userId[0])
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
        
        const userId = await upsertUser(payload)      

        const refreshToken = jwt.sign(
            {
                email: payload.email,
                id : userId
            },
            tokenKey,
            {
              expiresIn: "30d",
            }
        );
        
        const accessToken = jwt.sign(
            {
                id: userId
            },
            tokenKey,
            {
                expiresIn: '12h'
            }
        ) 

        res.cookie('token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 * 13 })
        res.status(200).json({token: accessToken})
        
    } else {
        res.sendStatus(400)
    }
})

app.get('/auth/getAccessToken', cookieAuth, (req, res) => {
    const accessToken = jwt.sign(
        {
            id: req.user.id
        },
        tokenKey,
        {
            expiresIn: '12h'
        }
    )    
   
    res.status(200).json({token : accessToken})
   
})

app.get('/auth/logout', (req, res) => {
    res.clearCookie('token')
    res.sendStatus(200)
})

app.post('/user/listings', tokenAuth, async (req, res) => {
    const userListings = await db.select('*').from('dupe_listings').where('poster_id', req.user.id)
    res.status(200).json(userListings)
})

app.post('/user/profile', tokenAuth, async (req, res) => {
    const userData = await db.select('*').from('users').where('id', req.user.id)
    const user = userData[0]    
    const resBody = {
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        link: user.img_link
    }
    res.status(200).json(resBody)
})

app.post('/public/listings/new', async (req, res) => {
    const { page } = req.body
    const data = await db('dupe_listings').select('*')
    data.sort(function(a, b) {
        return (a.date < b.date) ? -1 : ((a.date > b.date) ? 1 : 0);
    });
    const hundredItems = data.slice(0, 100)
    
    res.status(200).json(hundredItems)
})

/*const loadSampleData = async () => {
    const response = await db('dupe_listings').select('*')  

    for (element of response) {
        console.log(element)
        const update = await db('dupe_listings').where('id', element.id).update('active', Math.random() < 0.5)
        console.log(update)
    }
}

loadSampleData()*/