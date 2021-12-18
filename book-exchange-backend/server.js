const express = require('express');
const knex = require('knex')
const cors = require('cors')
const jwt = require("jsonwebtoken");
//const mockData = require('./files/MOCK_DATA.json')
const { Model } = require('objection');
const { cookieAuth, tokenAuth } = require('./middleware/auth')
const cookieParser = require('cookie-parser')
const { OAuth2Client } = require('google-auth-library')
const { port, googleClientId, dbUrl, tokenKey } = require('./config');
const { listingModel } = require('./models')
const { body, param, validationResult } = require('express-validator');


const app = express();
const googleClient = new OAuth2Client(googleClientId)
const db = knex({
   
    client: 'pg',
    connection : dbUrl,      
    
});
Model.knex(db)

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

app.get('/public/listings/new/:page', param('page').escape().toInt(), async (req, res) => {   
    const { page } = req.params
    
    if (Number.isInteger(page) && page >= 0) {
        const listings = await listingModel.query().withGraphFetched('tags').withGraphFetched('user').select('*').from({ listings: 'dupe_listings' }).orderBy('added', 'desc').offset(page * 20).limit(20)        
        if (listings.length === 0) {
            res.sendStatus(204)
        } else {
            res.json(listings)
        }
    } else {
        res.sendStatus(400)
    }
})

app.get('/public/listing/:listingId', param('listingId').escape().toInt(), async (req, res) => {
    const { listingId } = req.params
    if (Number.isInteger(listingId)) {
        const data = await listingModel.query().withGraphFetched('tags').withGraphFetched('user').select('*').from({ listings: 'dupe_listings' }).where('id', listingId)
        if (data.length > 0) {
            res.json(data[0])
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(400)
    } 
})

app.get('/categories', async (req, res) => {
    const categories = await db.select('*').from('categories').orderBy('order')    
    res.json(categories)
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
    //limit ammount    
    const userListings = await listingModel.query().withGraphFetched('tags').select('*').from({ listings: 'dupe_listings' }).where('poster_id', req.user.id).orderBy('added', 'desc') 
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

app.post('/user/listing/:listingId', tokenAuth, param('listingId').escape().toInt(), async (req, res) => {
    const { listingId } = req.params
    if (Number.isInteger(listingId)) {
        //const listing = await db.select('*').from({ listings: 'dupe_listings' }).where('id', listingId)
        const listing = await listingModel.query().withGraphFetched('tags').select('*').from({ listings: 'dupe_listings' }).where('id', listingId)
        if(listing.length > 0){
            if (parseInt(listing[0].poster_id) === req.user.id) {
                res.json(listing[0])
            } else {
                res.sendStatus(403)
            }
        } else {
            res.sendStatus(404)
        }        
    } else {
        res.sendStatus(400)
    }
})

app.get('/public/tags/:name', param('name').escape(), async (req, res) => {
    const { name } = req.params    
    const data = await db('tags').select('*').where('text', 'like', `${name}%`).orderBy('times_used')    
    res.json(data)
})

app.put('/user/listing/create', async (req, res) => {
    console.log(req.get('origin'))
    res.sendStatus(200)
})


/*
app.get('/public/listings/new', async (req, res) => {
   
    const data = await db('dupe_listings').select('*').limit('100') 
    data.sort(function(a, b) {
        return (a.added < b.added) ? -1 : ((a.added > b.added) ? 1 : 0);
    });
    const hundredItems = data.slice(0, 100)
    
    res.status(200).json(hundredItems)
})*/

/*const loadSampleData = async () => {
    const response = await db('dupe_listings').select('*')  

    for (element of response) {
        console.log(element)
        const update = await db('dupe_listings').where('id', element.id).update('active', Math.random() < 0.5)
        console.log(update)
    }
}*/